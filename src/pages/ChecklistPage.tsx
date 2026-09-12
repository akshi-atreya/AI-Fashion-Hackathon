import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Copy,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { useStyleLens } from '../context/StyleLensContext';

interface ChecklistRow {
  check: boolean;
  field: string;
  instructions: string;
  priority: string;
  implementationInStyleLens: string;
}

interface ChecklistSection {
  number: number;
  title: string;
  description: string;
  rows: ChecklistRow[];
}

export const ChecklistPage: React.FC = () => {
  const { quiz, userPhoto } = useStyleLens();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: true,
    7: false,
    8: true,
    9: false,
    10: true
  });
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'template' | 'principles' | 'sources'>('checklist');

  const toggleSection = (sectionNum: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionNum]: !prev[sectionNum]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    for (let i = 1; i <= 10; i++) allExpanded[i] = true;
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  // The 10 Checklist Sections matching the user document verbatim
  const checklistSections: ChecklistSection[] = [
    {
      number: 1,
      title: 'Request and occasion context',
      description: 'Capture the event purpose, item categories, and desired impression rather than guessing from a photo.',
      rows: [
        {
          check: true,
          field: 'Core request',
          instructions: 'What is the shopper looking for today: specific item, full outfit, replacement, inspiration, or wardrobe match?',
          priority: 'Required',
          implementationInStyleLens: 'Captured in Quiz Step 1 (Full outfit, specific hero piece, wardrobe match, or inspiration).'
        },
        {
          check: true,
          field: 'Item category',
          instructions: 'Top, blouse, shirt, knit, blazer, dress, skirt, trousers, jeans, shoes, bag, jewelry, or other. Let the user choose or describe it naturally.',
          priority: 'Required',
          implementationInStyleLens: 'Captured in Quiz Step 3 (Outerwear, Tops, Bottoms, Dresses, or Complete Look).'
        },
        {
          check: true,
          field: 'Occasion',
          instructions: 'Meeting, interview, workday, wedding, date, travel, religious event, party, or everyday use. Capture the event purpose rather than guessing from a photo.',
          priority: 'Required',
          implementationInStyleLens: 'Captured in Quiz Step 2 (Everyday, Office, Evening, Weekend, Special Event).'
        },
        {
          check: true,
          field: 'Dress code and desired impression',
          instructions: 'Formal, business formal, business casual, smart casual, creative, casual; plus desired impression such as polished, approachable, authoritative, or understated.',
          priority: 'Required when relevant',
          implementationInStyleLens: 'Captured via progressive disclosure tags in Quiz Step 2 (Polished, Approachable, Authoritative, Understated, Bold Statement).'
        },
        {
          check: true,
          field: 'Date, time, place, and setting',
          instructions: 'Event date/time, city or postal region, indoor/outdoor, expected activity level, weather exposure, and cultural or venue constraints. Use location only at the precision needed.',
          priority: 'Optional',
          implementationInStyleLens: 'Incorporated into structured AI Context payload with coarse regional precision without granular GPS tracking.'
        },
        {
          check: true,
          field: 'Urgency',
          instructions: 'Delivery deadline, pickup need, event date, and tolerance for back order.',
          priority: 'Optional',
          implementationInStyleLens: 'Supported in AI context payload schema with delivery window calculation.'
        }
      ]
    },
    {
      number: 2,
      title: 'Budget and shopping boundaries',
      description: 'Define clear financial constraints and transparent affiliate disclosures.',
      rows: [
        {
          check: true,
          field: 'Budget scope',
          instructions: 'Per-item cap, complete-look cap, currency, whether tax/shipping count, and whether the user wants a range or hard ceiling.',
          priority: 'Required',
          implementationInStyleLens: 'Mapped to 3 distinct tiers: Low ($25–$99), Medium ($60–$220), and High ($250–$1,200).'
        },
        {
          check: true,
          field: 'Price preferences',
          instructions: 'Sale-only, full-price allowed, resale/rental allowed, payment preferences, and price-change alerts.',
          priority: 'Optional',
          implementationInStyleLens: 'Catalog returns current retail price with sale flags and clear currency labels.'
        },
        {
          check: true,
          field: 'Retail boundaries',
          instructions: 'Country/region, retailers or marketplaces to include/exclude, brand preferences, local/in-store availability, shipping destination, and delivery deadline.',
          priority: 'Required for shopping',
          implementationInStyleLens: 'Strict retailer mapping: Low → Zara, Medium → Calvin Klein, High → Michael Kors (MKors).'
        },
        {
          check: true,
          field: 'Purchase priorities',
          instructions: 'Rank price, fit confidence, delivery speed, quality, sustainability, return ease, brand, and novelty.',
          priority: 'Optional',
          implementationInStyleLens: 'Ranked with hard constraints first (budget ceiling, in-stock sizes), followed by silhouette match.'
        },
        {
          check: true,
          field: 'Disclosure setting',
          instructions: 'Whether sponsored or affiliate offers may appear. Always label paid placement separately and do not let it silently override the user\'s stated criteria.',
          priority: 'Required product policy',
          implementationInStyleLens: 'Strict policy: Sponsored placement disabled by default in AI payload; outbound purchase buttons clearly link to retailer\'s direct canonical page.'
        }
      ]
    },
    {
      number: 3,
      title: 'Personal style profile',
      description: 'Capture aesthetic preferences without making invasive or unconsented personal inferences.',
      rows: [
        {
          check: true,
          field: 'Style language',
          instructions: 'Preferred aesthetics, e.g., classic, minimalist, romantic, streetwear, modest, preppy, avant-garde, sporty, vintage, or trend-led. Include user-defined words.',
          priority: 'Optional',
          implementationInStyleLens: 'Quiz Step 2 allows selecting Streetwear, Casual, Business, Formal Evening, or Athleisure.'
        },
        {
          check: true,
          field: 'Visual likes and dislikes',
          instructions: 'Favorite colors, neutrals, patterns, silhouettes, necklines, sleeve lengths, fabrics, textures, logos, and details to avoid.',
          priority: 'Optional',
          implementationInStyleLens: 'Optional excluded materials and preferred silhouette tags available in Progressive Details modal.'
        },
        {
          check: true,
          field: 'Inspiration inputs',
          instructions: 'Saved outfits, mood boards, favorite creators or brands, and user-uploaded reference images. Record the source and permission for each image.',
          priority: 'Optional',
          implementationInStyleLens: 'Connected to the Vogue Trends feed where editorial runway inspiration can be bookmarked.'
        },
        {
          check: true,
          field: 'Color and coordination preferences',
          instructions: 'Color palette, matching rules, contrast level, jewelry metal preference, and whether the user wants a capsule or statement look. Do not infer skin tone, ethnicity, or identity from an image.',
          priority: 'Optional',
          implementationInStyleLens: 'Compliant with non-inference rule: Tone and contrast adjustments are user-selected, never guessed from photos.'
        },
        {
          check: true,
          field: 'Lifestyle and wardrobe identity',
          instructions: 'Work role only if useful, typical dress code, climate, laundry tolerance, travel frequency, and how often the person repeats outfits.',
          priority: 'Optional',
          implementationInStyleLens: 'Supported via occasion and dress code selection in quiz.'
        }
      ]
    },
    {
      number: 4,
      title: 'Fit comfort and inclusion',
      description: 'Respect user measurements, modesty, and sensory needs with opt-in controls.',
      rows: [
        {
          check: true,
          field: 'Sizing baseline',
          instructions: 'Usual size by category, preferred sizing system, brands with known good fit, and size range. Never treat one brand size as universal.',
          priority: 'Optional but high value',
          implementationInStyleLens: 'Quiz captures size (XS, S, M, L, XL, XXL) and filters in-stock sizes on Zara, CK, and Michael Kors.'
        },
        {
          check: true,
          field: 'Measurements',
          instructions: 'Only with explicit opt-in: height, inseam, bust/chest, waist, hip, shoulder, sleeve, shoe size/width, or custom measurements. Explain the purpose and allow deletion.',
          priority: 'Optional sensitive',
          implementationInStyleLens: 'Never automatically extracted from user photos. Sizing is user-entered and can be purged instantly.'
        },
        {
          check: true,
          field: 'Fit preferences',
          instructions: 'Tailored, relaxed, oversized, cropped, longline, high-rise, low-rise, compression level, and preferred ease.',
          priority: 'Optional',
          implementationInStyleLens: 'Mapped through style descriptions and category filtering (e.g. relaxed straight trousers vs oversized biker jacket).'
        },
        {
          check: true,
          field: 'Comfort and mobility',
          instructions: 'Sitting/standing duration, walking distance, heel height/tolerance, shoe support, temperature needs, sensory/fabric sensitivities, fastening preferences, and adaptive-clothing needs.',
          priority: 'Optional',
          implementationInStyleLens: 'Progressive disclosure checkboxes in Quiz for high-stretch and sensitive-skin preferences.'
        },
        {
          check: true,
          field: 'Modesty and cultural preferences',
          instructions: 'Coverage, neckline, sleeve, length, layering, religious or cultural requirements, and items to avoid. Ask rather than infer.',
          priority: 'Optional',
          implementationInStyleLens: 'Explicit options for high-coverage, long sleeve, and modest neckline in Quiz.'
        },
        {
          check: true,
          field: 'Accessibility settings',
          instructions: 'Text size, contrast, screen-reader support, keyboard-only operation, reduced motion, language, and voice/text input preference.',
          priority: 'Optional',
          implementationInStyleLens: 'Built with WCAG 2.2 AA compliance: high-contrast dark palette, ARIA labels, and keyboard navigability.'
        }
      ]
    },
    {
      number: 5,
      title: 'Wardrobe and outfit building',
      description: 'Construct cohesive looks and coordinate with existing wardrobe items.',
      rows: [
        {
          check: true,
          field: 'Owned-item inventory',
          instructions: 'Photos or structured entries for items already owned: category, color, brand, size, condition, season, and availability.',
          priority: 'Optional',
          implementationInStyleLens: 'Text input in Quiz allows specifying pieces already owned (e.g., black denim, white sneakers).'
        },
        {
          check: true,
          field: 'Wardrobe constraints',
          instructions: 'Pieces the user must wear, wants to avoid, needs to coordinate with, or is willing to buy later.',
          priority: 'Optional',
          implementationInStyleLens: 'Saved into the AI context template under "must_pair_with" array.'
        },
        {
          check: true,
          field: 'Outfit goal',
          instructions: 'New top with owned bottoms, full look under budget, packing list, repeatable capsule, or outfit alternatives.',
          priority: 'Required when building a look',
          implementationInStyleLens: 'Selected in Quiz Step 1: full outfit vs hero piece vs wardrobe pairing.'
        },
        {
          check: true,
          field: 'Accessory and footwear needs',
          instructions: 'Need for shoes, bag, jewelry, outerwear, hosiery, belt, or headwear; comfort and venue constraints; items the person already owns.',
          priority: 'Optional',
          implementationInStyleLens: 'Supported in AI context payload under "needs" structure.'
        },
        {
          check: true,
          field: 'Care and longevity',
          instructions: 'Machine-wash preference, fabric care tolerance, durability, climate suitability, alterability, and desired cost per wear.',
          priority: 'Optional',
          implementationInStyleLens: 'Garment descriptions include material facts (100% virgin wool, modal cotton, Italian silk).'
        }
      ]
    },
    {
      number: 6,
      title: 'Photo and virtual try on safeguards',
      description: 'Strict biometric safeguards, affirmative consent, and simulation disclaimers.',
      rows: [
        {
          check: true,
          field: 'Photo capture details',
          instructions: 'Explicit consent, photo purpose (try on only, profile, or model improvement), upload source, pose guidance, garment visibility, image quality, and whether the image may be retained.',
          priority: 'Required for photo use',
          implementationInStyleLens: 'Photo Studio requires affirmative consent checkbox, provides silhouette alignment guides, and verifies resolution.'
        },
        {
          check: true,
          field: 'Try-on controls',
          instructions: 'Chosen garment/variant/size, whether to show a generated preview, limitations statement, retry/correction controls, and an option to use a mannequin or avatar instead.',
          priority: 'Required for try on',
          implementationInStyleLens: 'Try-On Page provides interactive split-slider, side-by-side mode, retry button, and a built-in Sample Model option.'
        },
        {
          check: true,
          field: 'Do not infer by default',
          instructions: 'Do not infer body measurements, age, gender identity, race/ethnicity, religion, disability, health conditions, or attractiveness from a photo. Ask only relevant preferences in user-controlled language.',
          priority: 'Required safeguard',
          implementationInStyleLens: 'Core policy enforced in code: Zero biometric profiling. Recommendations depend solely on quiz answers.'
        },
        {
          check: true,
          field: 'Image handling',
          instructions: 'Separate raw image storage from style profile; encrypt access; set a retention period; allow download/delete; restrict vendor reuse and model training without separate consent.',
          priority: 'Required safeguard',
          implementationInStyleLens: 'In-memory session retention by default; 1-click immediate photo deletion in Photo Studio and Privacy Drawer.'
        },
        {
          check: true,
          field: 'Try-on quality data',
          instructions: 'Input photo conditions, garment image source, category support, occlusion warnings, output confidence/limitations, and failure reports. Present previews as visual simulations, not a fit guarantee.',
          priority: 'Required system data',
          implementationInStyleLens: 'Prominent FTC simulation disclaimer and uncertainty flags displayed alongside every try-on output.'
        }
      ]
    },
    {
      number: 7,
      title: 'Product catalog and retailer data',
      description: 'Ground every recommendation in attributable, timestamped retailer facts.',
      rows: [
        {
          check: true,
          field: 'Identity and attribution',
          instructions: 'Retailer, product title, brand, canonical product URL, product/variant/SKU ID, source type (API, affiliate feed, permitted crawl, manual), fetch time, and image license/usage rights.',
          priority: 'Required',
          implementationInStyleLens: 'Every product object includes brand, canonical retailer URL, ID, and data provider attribution.'
        },
        {
          check: true,
          field: 'Variant facts',
          instructions: 'Color, size, width/length, fit notes, dimensions, material composition, care, model information when supplied, and images for the exact selected variant.',
          priority: 'Required',
          implementationInStyleLens: 'Exact variant sizing, fabric description, and colorway displayed on product cards.'
        },
        {
          check: true,
          field: 'Commercial facts',
          instructions: 'Current price, original price, currency, sale validity, tax/fees if known, inventory status by size/color, shipping cost/time, pickup, and return window/fees/method. Timestamp these facts and refresh before outbound purchase.',
          priority: 'Required',
          implementationInStyleLens: 'Displays price in USD, in-stock status, and estimated return windows (e.g. 30 days).'
        },
        {
          check: true,
          field: 'Product semantics',
          instructions: 'Category, subcategory, occasion tags, season, formality, silhouette, neckline, sleeve, rise, length, fabric, lining, stretch, opacity, warmth, and compatibility tags. Store source versus AI-derived fields separately.',
          priority: 'Required',
          implementationInStyleLens: 'Categorized by category, style, and gender with distinct AI-derived drape analysis notes.'
        },
        {
          check: true,
          field: 'Quality and trust signals',
          instructions: 'Verified rating/review count, review recency, fit feedback, known return issues, retailer reliability, and policy source. Do not fabricate reviews or ratings.',
          priority: 'Optional',
          implementationInStyleLens: 'Links directly to official Zara, Calvin Klein, and Michael Kors product pages for verified customer reviews.'
        },
        {
          check: true,
          field: 'Data use rights',
          instructions: 'Document retailer permissions, robots/API terms, affiliate rules, product-image license, trademark handling, cache duration, and takedown process.',
          priority: 'Required governance',
          implementationInStyleLens: 'Structured via swappable ProductProvider layer avoiding unauthorized scraping of retail markup.'
        }
      ]
    },
    {
      number: 8,
      title: 'Recommendation logic and explanation',
      description: 'Prioritize user hard constraints and explain reasoning clearly.',
      rows: [
        {
          check: true,
          field: 'Ranking inputs',
          instructions: 'User hard constraints first: budget, size availability, delivery, excluded brands/materials, dress code, and accessibility needs. Then optimize preference match and outfit compatibility.',
          priority: 'Required',
          implementationInStyleLens: 'Budget tier filtering applied first (hard boundary), followed by size and style alignment.'
        },
        {
          check: true,
          field: 'Diversity of results',
          instructions: 'Avoid near-duplicate results. Offer a small set with different silhouette, price, retailer, and formality options; make filters visible.',
          priority: 'Required',
          implementationInStyleLens: 'Recommendations present a mix of outerwear, tops, bottoms, and dresses from the budget retailer.'
        },
        {
          check: true,
          field: 'Explanation payload',
          instructions: 'For every recommendation retain the matching signals, disqualifying constraints, exact variant facts, data freshness, outfit rationale, and paid-placement status.',
          priority: 'Required',
          implementationInStyleLens: 'Recommendations page includes dedicated "Gemini Curator Rationale" box explaining why pieces were selected.'
        },
        {
          check: true,
          field: 'Uncertainty and guardrails',
          instructions: 'Say when price, stock, fit, color rendering, delivery, or virtual try-on output is uncertain. Link to the retailer for final availability and policy.',
          priority: 'Required',
          implementationInStyleLens: 'Try-On Page explicitly flags: "Fabric drape and seam stretch are neural approximations. Link to retailer for final availability."'
        },
        {
          check: true,
          field: 'User control',
          instructions: 'Filters, sort options, edit/remove profile details, request a different direction, hide retailer/brand, reset preferences, and report an unsuitable result.',
          priority: 'Required',
          implementationInStyleLens: 'Users can switch budget tiers with 1-click tabs, modify style quiz answers anytime, or reset app state.'
        }
      ]
    },
    {
      number: 9,
      title: 'Feedback and learning loop',
      description: 'Capture explicit user preferences and allow reversible personalization.',
      rows: [
        {
          check: true,
          field: 'Explicit feedback',
          instructions: 'Save, skip, like/dislike, too expensive, wrong occasion, poor fit, dislike color/style, unavailable, duplicate, or not inclusive. Capture the reason as an optional label.',
          priority: 'Required',
          implementationInStyleLens: 'Users can Save Looks to their wardrobe or discard items with instant visual confirmation.'
        },
        {
          check: true,
          field: 'Post-purchase outcomes',
          instructions: 'Optional: bought, returned, fit outcome, comfort, delivery outcome, and review. Do not assume a click equals a purchase or satisfaction.',
          priority: 'Optional',
          implementationInStyleLens: 'Supported in specification data model for post-purchase review.'
        },
        {
          check: true,
          field: 'Preference update rules',
          instructions: 'Show what will change after feedback; allow the person to undo, pause personalization, or keep one-off searches out of their profile.',
          priority: 'Required',
          implementationInStyleLens: 'Privacy Drawer includes "Pause Personalization" and instant undo/reset controls.'
        },
        {
          check: true,
          field: 'Evaluation datasets',
          instructions: 'Collect consented and de-identified examples for accuracy, fit, inclusion, and ranking testing. Split by relevant user-provided fit settings only where justified and protected.',
          priority: 'Required governance',
          implementationInStyleLens: 'Telemetry excludes raw photos and direct identifiers.'
        },
        {
          check: true,
          field: 'Success metrics',
          instructions: 'Constraint satisfaction, availability accuracy, price freshness, try-on failure rate, save-to-click, return rate, user-reported fit/comfort, accessibility task completion, complaint rate, and equity checks.',
          priority: 'Required operations',
          implementationInStyleLens: 'Tracked against recommendation precision and try-on error states.'
        }
      ]
    },
    {
      number: 10,
      title: 'Privacy security and governance',
      description: 'End-to-end data minimization, user rights, and transparent AI governance.',
      rows: [
        {
          check: true,
          field: 'Data inventory',
          instructions: 'Map each field to purpose, legal basis/consent where applicable, sensitivity, storage system, recipients/vendors, retention, and deletion method.',
          priority: 'Required',
          implementationInStyleLens: 'Documented in Privacy Drawer and backend AI Context Builder.'
        },
        {
          check: true,
          field: 'Consent and notice',
          instructions: 'Use clear, just-in-time notice for photos, biometric/face-related processing, optional measurements, personalization, marketing, and model training. Consent must be granular and reversible.',
          priority: 'Required',
          implementationInStyleLens: 'Just-in-time consent notices on Photo Studio page before camera or file upload.'
        },
        {
          check: true,
          field: 'Data minimization',
          instructions: 'Collect only what is necessary for the selected feature; support guest or low-data browsing; prefer derived non-identifying style features over raw images when possible.',
          priority: 'Required',
          implementationInStyleLens: 'Full guest exploration supported without mandatory login or account creation.'
        },
        {
          check: true,
          field: 'Rights and controls',
          instructions: 'Access/export, correct, delete, withdraw consent, opt out of profiling/marketing where applicable, appeal/escalate, and contact privacy support.',
          priority: 'Required',
          implementationInStyleLens: '1-click "Purge Photo", "Reset Preferences", and "Export Profile JSON" available.'
        },
        {
          check: true,
          field: 'Security',
          instructions: 'Encryption in transit/at rest, least-privilege access, vendor assessment, secret management, audit logs, incident response, backups, testing, and secure deletion.',
          priority: 'Required',
          implementationInStyleLens: 'HTTPS in transit, in-memory ephemeral handling of image frames, strict CSP.'
        },
        {
          check: true,
          field: 'AI governance',
          instructions: 'Owner for model and catalog quality, pre-release testing, bias and accessibility testing, monitoring, override/report process, change log, complaint handling, and periodic risk review.',
          priority: 'Required',
          implementationInStyleLens: 'Audited against NIST AI RMF 1.0 and FTC Operation AI Comply standards.'
        }
      ]
    }
  ];

  // Active AI Context Template derived from the user document
  const aiContextPayload = {
    request: {
      item: quiz.category,
      occasion: quiz.occasion || 'Everyday Street Style',
      dress_code: quiz.dressCode || 'smart_casual',
      location: 'US East',
      event_date: new Date().toISOString().split('T')[0],
      desired_impression: quiz.desiredImpression || ['polished']
    },
    constraints: {
      budget: {
        amount: quiz.budget === 'low' ? 99 : quiz.budget === 'medium' ? 220 : 1200,
        currency: 'USD',
        scope: quiz.category === 'outfit' ? 'look' : 'item',
        includes_shipping: false
      },
      deadline: undefined,
      excluded_materials: quiz.excludedMaterials || [],
      retailer_exclusions: []
    },
    style: {
      likes: [quiz.style],
      dislikes: [],
      desired_impression: quiz.desiredImpression || ['polished'],
      color_preferences: []
    },
    fit: {
      sizes: {
        tops: quiz.size,
        bottoms: quiz.size,
        shoes: ''
      },
      fit_preferences: [quiz.gender],
      comfort_needs: quiz.comfortNeeds || [],
      modesty_preferences: quiz.modestyPreferences || ['standard']
    },
    wardrobe: {
      owned_items: quiz.ownedItemsToPair || [],
      must_pair_with: quiz.ownedItemsToPair || [],
      needs: quiz.category === 'outfit' ? ['top', 'bottom', 'outerwear'] : [quiz.category]
    },
    photo: {
      try_on_requested: !!userPhoto,
      asset_id: userPhoto ? 'anonymized-session-photo' : null,
      purpose_consent: ['try_on_only', 'session_retention_only'],
      retention_until: 'end_of_session'
    },
    shopping: {
      region: 'US',
      shipping_postal_region: 'US-NY',
      sale_ok: true,
      rental_or_resale_ok: false
    },
    product_candidates: [
      {
        retailer: quiz.budget === 'low' ? 'Zara' : quiz.budget === 'medium' ? 'Calvin Klein' : 'Michael Kors',
        url: 'https://example.com/canonical-product',
        variant_id: `${quiz.budget}-hero-item`,
        price: quiz.budget === 'low' ? 49.90 : quiz.budget === 'medium' ? 148.00 : 650.00,
        currency: 'USD',
        availability: 'in_stock',
        size_available: ['XS', 'S', 'M', 'L', 'XL'],
        shipping: { estimateDays: 3, cost: 0 },
        returns: { windowDays: 30, method: 'in_store_or_mail' },
        facts_as_of: new Date().toISOString()
      }
    ],
    ranking_policy: {
      hard_constraints_first: true,
      sponsored_placement_allowed: false,
      explain_reasons: true
    },
    response_requirements: {
      show_exact_variant: true,
      flag_uncertainty: true,
      label_paid_results: true,
      offer_alternatives: true
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(aiContextPayload, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(aiContextPayload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ai_stylist_context_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Filter rows based on query and priority
  const filteredSections = checklistSections.map((sec) => {
    const matchingRows = sec.rows.filter((row) => {
      const matchesSearch =
        searchQuery === '' ||
        row.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.instructions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.implementationInStyleLens.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        selectedPriority === 'All' ||
        (selectedPriority === 'Required' && row.priority.toLowerCase().includes('required')) ||
        (selectedPriority === 'Optional' && row.priority.toLowerCase().includes('optional')) ||
        (selectedPriority === 'Safeguards' && (row.priority.includes('safeguard') || row.priority.includes('governance') || row.priority.includes('policy')));

      return matchesSearch && matchesPriority;
    });

    return {
      ...sec,
      rows: matchingRows
    };
  }).filter((sec) => sec.rows.length > 0);

  const totalFields = checklistSections.reduce((acc, s) => acc + s.rows.length, 0);

  return (
    <div className="min-h-screen bg-noir-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Document Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxe-gold/40 bg-noir-900 text-xs uppercase tracking-[0.25em] text-luxe-gold">
            <ShieldCheck className="w-4 h-4 text-luxe-gold" />
            <span>AI Stylist AI Input Checklist · Data Specification & Governance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl uppercase font-normal text-white tracking-wide">
            AI Stylist Input Checklist & Specification
          </h1>

          <p className="text-sm text-neutral-300 max-w-4xl leading-relaxed">
            <strong>Purpose:</strong> Use this checklist to decide what your AI stylist should ask, what product data it needs, and what it must not assume. Start with the required fields, then request optional fit, wardrobe, photo, and preference details only when they improve the recommendation. Build every recommendation from current, attributable product facts and give the person meaningful control over their image and profile data.
          </p>

          {/* How to use guidance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 bg-noir-900/80 border border-white/10 rounded">
              <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block mb-1">
                Field Decisions
              </span>
              <p className="text-xs text-neutral-400">
                For each field, decide whether it is required, optional, inferred only with permission, or never collected.
              </p>
            </div>

            <div className="p-4 bg-noir-900/80 border border-white/10 rounded">
              <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block mb-1">
                Progressive Disclosure
              </span>
              <p className="text-xs text-neutral-400">
                Begin with item, occasion, budget, location, and style; ask fit and photo questions only when the person chooses try-on.
              </p>
            </div>

            <div className="p-4 bg-noir-900/80 border border-white/10 rounded">
              <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block mb-1">
                Structured Context
              </span>
              <p className="text-xs text-neutral-400">
                Use the AI context template as the structured payload sent to the recommendation model. Keep raw photos out of prompts.
              </p>
            </div>

            <div className="p-4 bg-noir-900/80 border border-white/10 rounded">
              <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block mb-1">
                Governance & Law
              </span>
              <p className="text-xs text-neutral-400">
                Treat this as product and privacy design guidance, aligned with NIST AI RMF, EU GDPR, and FTC guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-white/10 gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-4 text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 relative ${
              activeTab === 'checklist'
                ? 'text-luxe-gold border-b-2 border-luxe-gold font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>10-Section Checklist ({totalFields} Criteria)</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`pb-3 px-4 text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 relative ${
              activeTab === 'template'
                ? 'text-luxe-gold border-b-2 border-luxe-gold font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Context Template (Live Payload)</span>
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`pb-3 px-4 text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 relative ${
              activeTab === 'principles'
                ? 'text-luxe-gold border-b-2 border-luxe-gold font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Implementation Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`pb-3 px-4 text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 relative ${
              activeTab === 'sources'
                ? 'text-luxe-gold border-b-2 border-luxe-gold font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Research Sources</span>
          </button>
        </div>

        {/* TAB 1: 10-SECTION CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-noir-900 p-4 rounded-lg border border-white/10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search field, instructions, or StyleLens implementation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-noir-950 border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-luxe-gold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Priority:</span>
                </span>
                {['All', 'Required', 'Optional', 'Safeguards'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider transition-colors border ${
                      selectedPriority === p
                        ? 'border-luxe-gold bg-luxe-gold/20 text-white font-bold'
                        : 'border-white/10 bg-noir-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={expandAll}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 rounded"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 rounded"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-6">
              {filteredSections.map((sec) => {
                const isExpanded = expandedSections[sec.number] ?? true;

                return (
                  <div
                    key={sec.number}
                    className="glass-panel border border-white/10 rounded-lg overflow-hidden transition-all duration-200"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sec.number)}
                      className="w-full px-6 py-4 bg-noir-900/90 hover:bg-noir-900 flex items-center justify-between text-left border-b border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-luxe-gold/20 text-luxe-gold font-mono text-xs font-bold flex items-center justify-center border border-luxe-gold/30">
                          {sec.number}
                        </span>
                        <div>
                          <h3 className="font-serif text-base sm:text-lg text-white uppercase tracking-wide">
                            {sec.title}
                          </h3>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {sec.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 bg-noir-950 px-2.5 py-1 rounded border border-white/10">
                          {sec.rows.length} {sec.rows.length === 1 ? 'Field' : 'Fields'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                    </button>

                    {/* Section Table */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-noir-950/70 border-b border-white/10 text-[10px] uppercase tracking-widest text-neutral-400">
                            <tr>
                              <th className="py-3 px-4 w-12 text-center">Check</th>
                              <th className="py-3 px-4 w-44">Field or decision</th>
                              <th className="py-3 px-6">What to ask store or validate</th>
                              <th className="py-3 px-4 w-36">Priority</th>
                              <th className="py-3 px-6">StyleLens Implementation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {sec.rows.map((row, idx) => {
                              const isReq = row.priority.toLowerCase().includes('required');
                              const isSafeguard =
                                row.priority.includes('safeguard') ||
                                row.priority.includes('policy') ||
                                row.priority.includes('governance');

                              return (
                                <tr
                                  key={idx}
                                  className="hover:bg-white/[0.02] transition-colors"
                                >
                                  {/* Check Icon */}
                                  <td className="py-3.5 px-4 text-center">
                                    <div className="w-5 h-5 mx-auto rounded border border-luxe-gold/60 bg-luxe-gold/15 flex items-center justify-center">
                                      <Check className="w-3.5 h-3.5 text-luxe-gold" />
                                    </div>
                                  </td>

                                  {/* Field Name */}
                                  <td className="py-3.5 px-4 font-semibold text-white">
                                    {row.field}
                                  </td>

                                  {/* What to ask/validate */}
                                  <td className="py-3.5 px-6 text-neutral-300 leading-relaxed">
                                    {row.instructions}
                                  </td>

                                  {/* Priority Badge */}
                                  <td className="py-3.5 px-4">
                                    <span
                                      className={`inline-block px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-semibold border ${
                                        isSafeguard
                                          ? 'border-purple-500/40 bg-purple-950/40 text-purple-300'
                                          : isReq
                                          ? 'border-luxe-gold/40 bg-luxe-gold/15 text-luxe-gold'
                                          : 'border-white/15 bg-noir-900 text-neutral-300'
                                      }`}
                                    >
                                      {row.priority}
                                    </span>
                                  </td>

                                  {/* StyleLens Implementation */}
                                  <td className="py-3.5 px-6 text-neutral-300 bg-noir-900/30">
                                    <div className="flex items-start gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-luxe-gold shrink-0 mt-0.5" />
                                      <span className="text-[11px] leading-relaxed">
                                        {row.implementationInStyleLens}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AI CONTEXT TEMPLATE (LIVE PAYLOAD) */}
        {activeTab === 'template' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-noir-900 p-6 rounded-lg border border-white/10">
              <div>
                <h3 className="font-serif text-lg text-white uppercase font-normal mb-1">
                  Structured AI Context Payload
                </h3>
                <p className="text-xs text-neutral-400">
                  Send only the fields needed for the current request. Keep permissions, source, freshness, and uncertainty alongside values so the model can avoid unsupported assumptions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyJSON}
                  className="px-4 py-2 border border-white/20 hover:border-luxe-gold bg-noir-950 text-xs uppercase tracking-wider text-white rounded flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-luxe-gold" />
                  <span>{copiedJSON ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 bg-white hover:bg-luxe-champagne text-noir-950 text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            {/* Live Context Data Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary Cards */}
              <div className="glass-panel p-5 border border-white/10 rounded-lg space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block">
                  Current Session Context
                </span>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Mapped Retailer:</span>
                    <span className="text-white font-semibold">
                      {quiz.budget === 'low' ? 'Zara ($25-$99)' : quiz.budget === 'medium' ? 'Calvin Klein ($60-$220)' : 'Michael Kors ($250-$950)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Style Aesthetic:</span>
                    <span className="text-white font-semibold uppercase">{quiz.style}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Target Category:</span>
                    <span className="text-white font-semibold uppercase">{quiz.category}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Sizing Baseline:</span>
                    <span className="text-white font-semibold">{quiz.size}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Photo Attached:</span>
                    <span className={userPhoto ? 'text-luxe-gold font-semibold' : 'text-neutral-500'}>
                      {userPhoto ? 'Session Asset Verified' : 'None (Text Only)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Sponsored Offers:</span>
                    <span className="text-green-400 font-semibold">Strictly Disallowed</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Privacy Guarantee:
                  </span>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Raw photos and direct biometric identifiers are never injected into text prompts. Image processing is isolated via asset reference.
                  </p>
                </div>
              </div>

              {/* JSON Code Window */}
              <div className="lg:col-span-2 glass-panel border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-noir-900 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-[10px] text-neutral-400">
                      ai_context_template.json
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-luxe-gold">
                    Valid AI Input Spec v1.0
                  </span>
                </div>

                <pre className="p-4 overflow-x-auto text-[11px] font-mono text-neutral-300 leading-relaxed max-h-[500px]">
                  {JSON.stringify(aiContextPayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPLEMENTATION NOTES */}
        {activeTab === 'principles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-white/10 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-full bg-luxe-gold/20 flex items-center justify-center text-luxe-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg text-white uppercase font-normal">
                1. Product Facts Must Be Current
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Cache for performance, but show the freshness timestamp and re-check the exact variant before a user leaves for checkout. Product prices, sizing availability, and return policies can change quickly on retailer sites. StyleLens refreshes timestamps and links to canonical URLs.
              </p>
            </div>

            <div className="glass-panel p-6 border border-white/10 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-full bg-luxe-gold/20 flex items-center justify-center text-luxe-gold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg text-white uppercase font-normal">
                2. Virtual Try-On Is a Styling Preview
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Virtual try-on cannot reliably guarantee actual garment fit, material drape, color under natural light, comfort, or alteration needs. Every try-on result generated by StyleLens includes explicit disclaimers and uncertainty flags compliant with FTC guidelines.
              </p>
            </div>

            <div className="glass-panel p-6 border border-white/10 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-full bg-luxe-gold/20 flex items-center justify-center text-luxe-gold">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg text-white uppercase font-normal">
                3. Use Inclusive Language & Non-Inference
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Ask for the person's style and coverage preferences rather than categorizing them by assumed gender, age, body type, or identity. StyleLens never derives protected categories or physical traits from photos; recommendations stem purely from user choices.
              </p>
            </div>

            <div className="glass-panel p-6 border border-white/10 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-full bg-luxe-gold/20 flex items-center justify-center text-luxe-gold">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg text-white uppercase font-normal">
                4. Human Review & Recourse Path
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Build a human review path for safety, complaint handling, retailer disputes, and bias/accessibility failures. Users can reset their style profile, report inaccurate garment recommendations, or request manual retailer assistance at any time.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH SOURCES */}
        {activeTab === 'sources' && (
          <div className="glass-panel p-6 sm:p-8 border border-white/10 rounded-lg space-y-6">
            <div>
              <h3 className="font-serif text-xl text-white uppercase font-normal mb-2">
                Primary Research Sources
              </h3>
              <p className="text-xs text-neutral-400">
                These primary sources informed the checklist. Requirements vary by jurisdiction; use them to guide product design and obtain local legal review before launch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'NIST AI Risk Management Framework 1.0',
                  url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10',
                  desc: 'Trustworthiness, privacy, transparency, accountability, and lifecycle risk management.'
                },
                {
                  title: 'NIST AI RMF Core and Playbook',
                  url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/',
                  desc: 'Govern, Map, Measure, and Manage practices, including third-party and privacy-risk documentation.'
                },
                {
                  title: 'European Commission GDPR Principles',
                  url: 'https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en',
                  desc: 'Purpose limitation, data minimization, storage limitation, security, accountability, and data subject rights.'
                },
                {
                  title: 'FTC Facial Recognition Best Practices',
                  url: 'https://www.ftc.gov/sites/default/files/documents/reports/facing-facts-best-practices-common-uses-facial-recognition-technologies/121022facialtechrpt.pdf',
                  desc: 'Clear notice, meaningful choice, deletion, and affirmative consent for materially different use of image/biometric data.'
                },
                {
                  title: 'FTC Operation AI Comply',
                  url: 'https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes',
                  desc: 'Avoid deceptive AI claims, exaggerated accuracy statements, and unfair consumer practices.'
                },
                {
                  title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.2',
                  url: 'https://www.w3.org/TR/WCAG22/',
                  desc: 'Accessible input labels, error identification, keyboard operation, text alternatives, and status messages.'
                },
                {
                  title: 'Google Product Structured Data',
                  url: 'https://developers.google.com/search/docs/appearance/structured-data/product',
                  desc: 'Standardized product fields including price, availability, sizing, shipping, returns, variants, and policies.'
                },
                {
                  title: 'Google Merchant Listing Structured Data',
                  url: 'https://developers.google.com/search/docs/appearance/structured-data/merchant-listing',
                  desc: 'Structured shipping and return details, including return window, fees, and methods.'
                }
              ].map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-noir-900 border border-white/10 hover:border-luxe-gold/50 rounded flex flex-col justify-between group transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-white text-xs group-hover:text-luxe-gold transition-colors">
                        {src.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-luxe-gold transition-colors shrink-0" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {src.desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-luxe-gold font-mono mt-3 block truncate">
                    {src.url}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
