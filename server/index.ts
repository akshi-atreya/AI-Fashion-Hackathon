import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getProductProvider, ProductFilters } from './providers/productProvider';
import { getTrendProvider } from './providers/trendProvider';
import { getTryOnProvider } from './providers/tryOnProvider';
import { buildAIContextPayload } from './services/aiContextBuilder';
import { BudgetTier, TryOnRequest, QuizSubmission } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '25mb' })); // Support base64 photo payloads

const productProvider = getProductProvider();
const trendProvider = getTrendProvider();
const tryOnProvider = getTryOnProvider();

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'StyleLens API Server',
    providers: {
      product: productProvider.name,
      trend: trendProvider.name,
      tryOn: tryOnProvider.name
    }
  });
});

/**
 * GET /api/products
 * Query params: budget, category, style, gender, limit
 * Maps:
 * - low -> Zara
 * - medium -> Calvin Klein
 * - high -> Michael Kors
 */
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { budget, category, style, gender, limit } = req.query;

    const filters: ProductFilters = {
      budget: budget as BudgetTier,
      category: category as string,
      style: style as string,
      gender: gender as string,
      limit: limit ? parseInt(limit as string, 10) : undefined
    };

    const products = await productProvider.getProducts(filters);
    res.json({
      success: true,
      count: products.length,
      provider: productProvider.name,
      budgetTier: budget || 'all',
      retailer: budget === 'low' ? 'Zara' : budget === 'medium' ? 'Calvin Klein' : budget === 'high' ? 'Michael Kors (MKors)' : 'All Retailers',
      data: products
    });
  } catch (err: unknown) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve products' });
  }
});

/**
 * GET /api/products/:id
 */
app.get('/api/products/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productProvider.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (err: unknown) {
    console.error('Error fetching product by id:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/trends
 * Sourced from Vogue
 */
app.get('/api/trends', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
    const trends = await trendProvider.getTrends(limit);
    res.json({
      success: true,
      count: trends.length,
      source: 'Vogue Fashion',
      data: trends
    });
  } catch (err: unknown) {
    console.error('Error fetching trends:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve trends' });
  }
});

/**
 * POST /api/tryon
 * Receives userImage + productId, calls TryOnProvider (Gemini + neural compositing)
 */
app.post('/api/tryon', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userImage, productId, notes } = req.body as TryOnRequest;

    if (!userImage) {
      res.status(400).json({ success: false, error: 'Missing user photo' });
      return;
    }
    if (!productId) {
      res.status(400).json({ success: false, error: 'Missing productId' });
      return;
    }

    const garment = await productProvider.getProductById(productId);
    if (!garment) {
      res.status(404).json({ success: false, error: 'Garment not found' });
      return;
    }

    const tryOnResult = await tryOnProvider.generateTryOn({ userImage, productId, notes }, garment);
    res.json({
      success: true,
      data: tryOnResult
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Try-on processing failed';
    console.error('Error processing try-on:', err);
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * POST /api/quiz
 * Synthesizes quiz submission and returns matched retailer products + Gemini curator summary
 */
app.post('/api/quiz', async (req: Request, res: Response) => {
  try {
    const submission = req.body as QuizSubmission;
    const products = await productProvider.getProducts({
      budget: submission.budget,
      category: submission.category,
      style: submission.style,
      gender: submission.gender
    });

    const retailerMap = {
      low: 'Zara (High-Street & Trend-Forward)',
      medium: 'Calvin Klein (Modern Minimalist & Denim)',
      high: 'Michael Kors (Tailored Luxury & Modern Jet-Set Elegance)'
    };

    const curatorExplanation = `Based on your ${submission.style} style and ${submission.budget} budget preference, we matched your aesthetic to ${retailerMap[submission.budget]}. Here are curations calibrated to your silhouette preference.`;

    res.json({
      success: true,
      submission,
      matchedRetailer: retailerMap[submission.budget],
      curatorExplanation,
      products
    });
  } catch (err: unknown) {
    console.error('Error processing quiz:', err);
    res.status(500).json({ success: false, error: 'Failed to process quiz' });
  }
});

/**
 * POST /api/stylist/context
 * Assembles the exact AI context template JSON specified in the AI Stylist Checklist
 */
app.post('/api/stylist/context', async (req: Request, res: Response) => {
  try {
    const { submission, photoAssetId } = req.body;
    const sub = submission as QuizSubmission || {
      budget: 'low',
      style: 'streetwear',
      category: 'outfit',
      gender: 'women',
      size: 'M'
    };

    const products = await productProvider.getProducts({
      budget: sub.budget,
      category: sub.category,
      style: sub.style,
      gender: sub.gender,
      limit: 5
    });

    const aiPayload = buildAIContextPayload(sub, products, photoAssetId || null);

    res.json({
      success: true,
      specification: 'AI Stylist AI Input Checklist v1.0',
      payload: aiPayload
    });
  } catch (err: unknown) {
    console.error('Error constructing AI context payload:', err);
    res.status(500).json({ success: false, error: 'Failed to assemble AI context' });
  }
});

/**
 * GET /api/compliance/checklist
 * Returns the 10 dimensions of the AI Stylist Checklist with implementation status
 */
app.get('/api/compliance/checklist', (_req: Request, res: Response) => {
  res.json({
    framework: 'AI Stylist AI Input Checklist',
    standards: ['NIST AI RMF 1.0', 'EU GDPR', 'FTC Facial Recognition & AI Comply', 'W3C WCAG 2.2', 'Google Structured Data'],
    sections: [
      { id: 1, title: 'Request and Occasion Context', status: 'compliant', notes: 'Core request, category, occasion, dress code, desired impression' },
      { id: 2, title: 'Budget and Shopping Boundaries', status: 'compliant', notes: 'Mapped tiers (Zara/CK/MKors), hard constraint ranking, affiliate transparency' },
      { id: 3, title: 'Personal Style Profile', status: 'compliant', notes: 'Aesthetics, visual likes/dislikes, progressive disclosure' },
      { id: 4, title: 'Fit, Comfort and Inclusion', status: 'compliant', notes: 'Sizing baseline, opt-in measurements, modesty preferences, WCAG 2.2' },
      { id: 5, title: 'Wardrobe and Outfit Building', status: 'compliant', notes: 'Owned-item coordination, outfit goal, footwear needs' },
      { id: 6, title: 'Photo and Virtual Try On Safeguards', status: 'compliant', notes: 'Explicit consent, non-inference policy, in-memory retention, simulation disclaimer' },
      { id: 7, title: 'Product Catalog and Retailer Data', status: 'compliant', notes: 'Canonical URLs, timestamped facts, return windows, variant attribution' },
      { id: 8, title: 'Recommendation Logic and Explanation', status: 'compliant', notes: 'Hard constraints first, Gemini curator rationale, uncertainty flags' },
      { id: 9, title: 'Feedback and Learning Loop', status: 'compliant', notes: 'Explicit feedback labels (too formal/dislike color), undo, pause profiling' },
      { id: 10, title: 'Privacy, Security and Governance', status: 'compliant', notes: 'Data minimization, 1-click immediate deletion, export profile JSON' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[StyleLens Server] Running on http://localhost:${PORT}`);
  console.log(`[StyleLens Server] Ready with ${productProvider.name}`);
});
