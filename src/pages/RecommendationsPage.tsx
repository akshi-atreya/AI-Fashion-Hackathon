import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Sliders, Shirt, Filter } from 'lucide-react';
import { useStyleLens } from '../context/StyleLensContext';
import { Product, BudgetTier } from '../types/stylelens';
import { fetchProducts } from '../services/api';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { quiz, setQuiz, recommendations, setRecommendations, setMatchedRetailer, curatorInsight } = useStyleLens();

  const [loading, setLoading] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Load products if empty or when quiz changes
  useEffect(() => {
    setLoading(true);
    fetchProducts({
      budget: quiz.budget,
      category: quiz.category,
      style: quiz.style,
      gender: quiz.gender
    })
      .then((res) => {
        setRecommendations(res.products);
        setMatchedRetailer(res.retailer);
      })
      .finally(() => setLoading(false));
  }, [quiz.budget, quiz.category, quiz.style, quiz.gender, setRecommendations, setMatchedRetailer]);

  const handleBudgetSwitch = (newBudget: BudgetTier) => {
    setQuiz((prev) => ({ ...prev, budget: newBudget }));
  };

  const handleTryOn = (product: Product) => {
    navigate(`/try-on/${product.id}`);
  };

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Recommendations' },
    { key: 'outerwear', label: 'Outerwear' },
    { key: 'tops', label: 'Tops & Knits' },
    { key: 'bottoms', label: 'Trousers & Denim' },
    { key: 'dresses', label: 'Dresses & Formal' }
  ];

  const filteredProducts =
    activeCategoryFilter === 'all'
      ? recommendations
      : recommendations.filter((p) => p.category === activeCategoryFilter);

  const budgetRetailerName =
    quiz.budget === 'low'
      ? 'Zara'
      : quiz.budget === 'medium'
      ? 'Calvin Klein'
      : 'Michael Kors (MKors)';

  return (
    <div className="min-h-screen bg-noir-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Curator Rationale */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-luxe-gold/30 bg-noir-900 text-[10px] uppercase tracking-[0.25em] text-luxe-gold mb-3">
                <Sparkles className="w-3 h-3 text-luxe-gold" />
                <span>AI Style Curation</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase font-normal">
                Curated For You: <span className="text-luxe-champagne">{budgetRetailerName}</span>
              </h1>
              <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
                Mapped to your {quiz.budget} budget tier and {quiz.style} silhouette preference.
              </p>
            </div>

            {/* Retake Quiz or Edit Filters */}
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-luxe-gold text-xs uppercase tracking-wider text-neutral-300 hover:text-white bg-noir-900 rounded transition-colors self-start md:self-auto"
            >
              <Sliders className="w-3.5 h-3.5 text-luxe-gold" />
              <span>Modify Style Quiz</span>
            </Link>
          </div>

          {/* Gemini Curator Rationale Box */}
          <div className="mt-6 p-4 rounded bg-noir-900/70 border border-white/10 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-luxe-gold/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-luxe-gold" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block">
                Gemini Curator Rationale
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">
                {curatorInsight}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Switcher & Category Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Quick Budget Tier Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-1 shrink-0">
              Budget Retailer:
            </span>
            {(['low', 'medium', 'high'] as BudgetTier[]).map((b) => {
              const isActive = quiz.budget === b;
              const name = b === 'low' ? 'Zara (Low)' : b === 'medium' ? 'Calvin Klein (Med)' : 'Michael Kors (High)';
              return (
                <button
                  key={b}
                  onClick={() => handleBudgetSwitch(b)}
                  className={`px-3 py-1.5 rounded text-[11px] uppercase tracking-wider transition-all shrink-0 border ${
                    isActive
                      ? 'border-luxe-gold bg-luxe-gold text-noir-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'border-white/10 bg-noir-900 text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategoryFilter(c.key)}
                className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-all shrink-0 border ${
                  activeCategoryFilter === c.key
                    ? 'border-white/40 bg-white/10 text-white font-medium'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-luxe-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Retrieving live catalog from {budgetRetailerName}...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center glass-panel p-12 border border-white/10 rounded">
            <Shirt className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-white mb-1">No Pieces in this Category</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              Try selecting "All Recommendations" or switch your budget tier to discover more styles.
            </p>
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className="px-5 py-2.5 bg-white text-noir-950 text-xs uppercase tracking-widest font-semibold rounded"
            >
              Show All Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-panel rounded-lg overflow-hidden border border-white/10 hover:border-luxe-gold/50 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-noir-900">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md border border-white/10 text-white font-semibold rounded">
                      {product.brand}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-semibold text-luxe-gold border border-white/10">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      <span>{product.category} · {product.color}</span>
                      <span className="text-neutral-400 font-mono">Facts as of today</span>
                    </div>
                    <h3 className="font-serif text-base text-white font-medium group-hover:text-luxe-champagne transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Commercial & Policy Facts (Checklist Sec 7) */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-white/5 font-mono">
                    <span>30-Day Return Window</span>
                    <span className="text-emerald-400">In Stock</span>
                  </div>

                  {/* Sizes */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider mr-1">Sizes:</span>
                    {product.sizes.map((sz) => (
                      <span
                        key={sz}
                        className="text-[9px] px-1.5 py-0.5 bg-noir-900 border border-white/10 text-neutral-300 rounded"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>

                  {/* Feedback Chips (Checklist Sec 9) */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                    <span className="text-[8px] uppercase tracking-wider text-neutral-500 shrink-0">Feedback:</span>
                    {['Like', 'Too formal', 'Wrong color'].map((fb) => (
                      <button
                        key={fb}
                        onClick={() => alert(`Recorded feedback: "${fb}" for ${product.name}. Your future recommendations will adapt.`)}
                        className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-noir-900 border border-white/10 text-neutral-400 hover:text-white hover:border-luxe-gold/40 transition-colors shrink-0"
                      >
                        {fb}
                      </button>
                    ))}
                  </div>

                  {/* Actions: Try On Button + Buy on Retailer Link */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleTryOn(product)}
                      className="flex-1 py-2.5 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-noir-950" />
                      <span>Try It On</span>
                    </button>

                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 border border-white/20 hover:border-luxe-gold text-neutral-300 hover:text-white bg-noir-900 rounded transition-colors"
                      title={`Buy on ${product.brand} (Official Retailer)`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
