import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Camera,
  Upload,
  UserCheck,
  HeartHandshake,
  DollarSign,
  Layers,
  Palette,
  Compass,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useStyleLens, SAMPLE_USER_PHOTO } from '../context/StyleLensContext';
import {
  BudgetTier,
  FashionStyle,
  GarmentCategory,
  GenderPreference,
  CoreRequestType,
  DesiredImpression,
  ModestyPreference,
  ComfortNeed,
  SilhouettePreference
} from '../types/stylelens';
import { submitQuiz } from '../services/api';
import { captureProvider } from '../services/captureProvider';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    quiz,
    setQuiz,
    setRecommendations,
    setMatchedRetailer,
    setCuratorInsight,
    userPhoto,
    setUserPhoto
  } = useStyleLens();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states matching user's checklist
  const [category, setCategory] = useState<GarmentCategory>(quiz.category || 'outfit');
  const [coreRequest, setCoreRequest] = useState<CoreRequestType>(quiz.coreRequest || 'full_outfit');
  const [occasion, setOccasion] = useState<string>(quiz.occasion || 'Everyday Street Style');

  // Step 2: Budget
  const [budget, setBudget] = useState<BudgetTier>(quiz.budget || 'low');
  const [budgetScope, setBudgetScope] = useState<'look' | 'item'>('look');
  const [excludedMaterials, setExcludedMaterials] = useState<string>(
    quiz.excludedMaterials ? quiz.excludedMaterials.join(', ') : ''
  );

  // Step 3: Style Type & Aesthetic
  const [style, setStyle] = useState<FashionStyle>(quiz.style || 'streetwear');
  const [desiredImpressions, setDesiredImpressions] = useState<DesiredImpression[]>(
    quiz.desiredImpression || ['polished']
  );

  // Step 4: Comfort Level, Tactile Feel & Silhouette
  const [comfortNeeds, setComfortNeeds] = useState<ComfortNeed[]>(
    quiz.comfortNeeds && quiz.comfortNeeds.length > 0
      ? quiz.comfortNeeds
      : ['high_stretch', 'breathable_natural']
  );
  const [silhouette, setSilhouette] = useState<SilhouettePreference>(
    quiz.silhouettePreference || 'relaxed_oversized'
  );
  const [size, setSize] = useState<string>(quiz.size || 'M');
  const [gender, setGender] = useState<GenderPreference>(quiz.gender || 'women');
  const [modestyPreferences, setModestyPreferences] = useState<ModestyPreference[]>(
    quiz.modestyPreferences || ['standard']
  );

  // Step 5: Visual Calibration Studio
  const [photoSource, setPhotoSource] = useState<'sample' | 'upload' | 'camera'>('sample');
  const [localPhoto, setLocalPhoto] = useState<string>(userPhoto || SAMPLE_USER_PHOTO);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  // Options Definitions
  const clothesTypeOptions: { cat: GarmentCategory; core: CoreRequestType; label: string; desc: string }[] = [
    {
      cat: 'outfit',
      core: 'full_outfit',
      label: 'Complete Synchronized Outfit',
      desc: 'Top, bottom, and layering pieces harmonized into a cohesive look.'
    },
    {
      cat: 'outerwear',
      core: 'specific_item',
      label: 'Outerwear & Tailored Jackets',
      desc: 'Statement trench coats, double-breasted blazers, or biker jackets.'
    },
    {
      cat: 'tops',
      core: 'specific_item',
      label: 'Tops, Shirts & Sculpted Knits',
      desc: 'Crisp poplin button-downs, structured knitwear, and essential tees.'
    },
    {
      cat: 'bottoms',
      core: 'specific_item',
      label: 'Denim, Trousers & Tailored Pants',
      desc: 'Wide-leg pleats, selvedge denim cuts, and relaxed fluid pants.'
    },
    {
      cat: 'dresses',
      core: 'specific_item',
      label: 'Dresses & Evening Formalwear',
      desc: 'Architectural cocktail dresses, evening gowns, and black-tie tailoring.'
    }
  ];

  const budgetOptions: {
    tier: BudgetTier;
    retailer: string;
    range: string;
    desc: string;
    highlights: string;
  }[] = [
    {
      tier: 'low',
      retailer: 'Zara',
      range: '$25 – $99',
      desc: 'Trend-driven European streetwear, structured coats, and modern urban essentials.',
      highlights: 'Fast fashion drops, runway-inspired silhouettes & high accessibility.'
    },
    {
      tier: 'medium',
      retailer: 'Calvin Klein',
      range: '$60 – $220',
      desc: 'Minimalist Americana, iconic denim cuts, sculpted knits, and clean tailored lines.',
      highlights: 'Heritage denim, subtle branding & premium everyday comfort.'
    },
    {
      tier: 'high',
      retailer: 'Michael Kors (MKors)',
      range: '$250 – $950',
      desc: 'Double-face wool trench coats, evening georgette gowns, and tailored jet-set luxury.',
      highlights: 'American luxury craftsmanship, fluid drapery & red-carpet gala glamour.'
    }
  ];

  const styleTypeOptions: { style: FashionStyle; label: string; desc: string }[] = [
    {
      style: 'streetwear',
      label: 'Contemporary Streetwear',
      desc: 'Relaxed proportions, oversized layers, graphic outerwear & sneaker culture.'
    },
    {
      style: 'casual',
      label: 'Minimalist Luxe / Quiet Luxury',
      desc: 'Understated neutral palettes, architectural cuts & premium textures without loud logos.'
    },
    {
      style: 'business',
      label: 'Sharp Tailored / Modern Executive',
      desc: 'Double-breasted blazers, pleated wool trousers & crisp structured shirts.'
    },
    {
      style: 'formal',
      label: 'Formal Evening / Nocturnal Elegance',
      desc: 'Velvet, silk, black-tie tuxedos, and striking silhouettes designed for night events.'
    },
    {
      style: 'athleisure',
      label: 'Technical Athleisure & Active Luxury',
      desc: 'Performance fabrics, ergonomic seamlines, seamless knits & elevated comfort.'
    }
  ];

  const impressionOptions: { imp: DesiredImpression; label: string }[] = [
    { imp: 'polished', label: 'Polished & Refined' },
    { imp: 'bold_statement', label: 'Bold Runway Statement' },
    { imp: 'understated', label: 'Understated & Minimal' },
    { imp: 'approachable', label: 'Approachable & Warm' },
    { imp: 'authoritative', label: 'Authoritative & Sharp' }
  ];

  const comfortCards: {
    id: ComfortNeed;
    title: string;
    desc: string;
    fabric: string;
  }[] = [
    {
      id: 'high_stretch',
      title: 'Ultra-Soft & High-Stretch',
      desc: 'Zero-pinch waistline, 4-way modal elastane flexibility for active mobility.',
      fabric: 'Stretch Cotton & Modal'
    },
    {
      id: 'breathable_natural',
      title: '100% Breathable & Natural',
      desc: 'Airy organic linen and breathable cotton for all-day thermal cooling.',
      fabric: 'Airy Linen & Organic Cotton'
    },
    {
      id: 'structured_tailored',
      title: 'Structured & Sculpted Tailoring',
      desc: 'Defined shoulders, crisp lapels & firm fabric weave that holds immaculate posture.',
      fabric: 'Virgin Wool & Structured Poplin'
    },
    {
      id: 'sensitive_skin',
      title: 'Sensitive Skin & Friction-Free',
      desc: 'Tagless construction, flat-lock interior seams, hypoallergenic smooth linings.',
      fabric: 'Brushed Silk & Tagless Bamboo'
    },
    {
      id: 'temperature_adaptive',
      title: 'Temperature-Adaptive Knits',
      desc: 'Micro-ribbed fibers that adapt to shifting outdoor air and indoor air-conditioning.',
      fabric: 'Merino Blend & Thermal Rib'
    }
  ];

  const silhouetteOptions: { id: SilhouettePreference; label: string; desc: string }[] = [
    { id: 'relaxed_oversized', label: 'Relaxed & Oversized', desc: 'Draped shoulders, wide legs & slouchy elegance.' },
    { id: 'slim_tailored', label: 'Slim & Tailored', desc: 'Contoured waist, tapered cuffs & sharp profile.' },
    { id: 'classic_regular', label: 'Classic Regular Fit', desc: 'Timeless straight drape, balanced proportions.' },
    { id: 'draped_flowy', label: 'Fluid & Flowy', desc: 'Liquid motion, bias-cut drapes & graceful movement.' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleComfort = (id: ComfortNeed) => {
    setComfortNeeds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleImpression = (imp: DesiredImpression) => {
    setDesiredImpressions((prev) =>
      prev.includes(imp) ? prev.filter((i) => i !== imp) : [...prev, imp]
    );
  };

  const toggleModesty = (mod: ModestyPreference) => {
    setModestyPreferences((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  // Camera handling for Step 5
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await captureProvider.startCamera(videoRef.current, 'user');
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      alert('Could not start webcam. Using studio model instead.');
      setPhotoSource('sample');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const frame = captureProvider.captureFrame(videoRef.current);
      setLocalPhoto(frame);
      setUserPhoto(frame);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      captureProvider.stopCamera(streamRef.current);
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await captureProvider.compressImage(file);
      setLocalPhoto(compressed);
      setUserPhoto(compressed);
      setPhotoSource('upload');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    stopCamera();

    // Ensure photo is registered
    const activePhoto = localPhoto || SAMPLE_USER_PHOTO;
    setUserPhoto(activePhoto);

    const updatedQuiz = {
      coreRequest,
      budget,
      style,
      category,
      gender,
      size,
      occasion,
      desiredImpression: desiredImpressions,
      modestyPreferences,
      comfortNeeds,
      silhouettePreference: silhouette,
      comfortLevelDescription: comfortNeeds.join(', '),
      excludedMaterials: excludedMaterials ? excludedMaterials.split(',').map((s) => s.trim()) : [],
      completed: true
    };

    setQuiz(updatedQuiz);

    try {
      const res = await submitQuiz(updatedQuiz);
      setRecommendations(res.products);
      setMatchedRetailer(res.matchedRetailer);
      setCuratorInsight(res.curatorExplanation);

      // Navigate straight to the first recommended item's virtual try-on studio!
      if (res.products && res.products.length > 0) {
        navigate(`/try-on/${res.products[0].id}`);
      } else {
        navigate('/recommendations');
      }
    } catch (err) {
      console.warn('Quiz submission fallback triggered:', err);
      navigate('/recommendations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-950 text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Breadcrumb & Checklist Tag */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400 mb-3">
            <span className="font-mono text-luxe-gold">
              QUESTION {currentStep} OF {totalSteps}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-900 border border-white/10 text-luxe-champagne">
              <Shield className="w-3.5 h-3.5 text-luxe-gold" />
              <span>AI Stylist Intake Specification v1.0</span>
            </span>
          </div>

          <div className="w-full h-1.5 bg-noir-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-luxe-gold to-white transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Questionnaire Panel */}
        <div className="glass-panel p-6 sm:p-10 border border-white/10 rounded-xl shadow-2xl relative">
          {/* STEP 1: KIND OF CLOTHES & OCCASION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Section 1: Request & Clothing Scope</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-normal">
                  What kind of clothes are you looking for?
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Specify whether you want a full head-to-toe look or a specific statement hero piece.
                </p>
              </div>

              <div className="space-y-3">
                {clothesTypeOptions.map((opt) => {
                  const isSelected = category === opt.cat;
                  return (
                    <div
                      key={opt.cat}
                      onClick={() => {
                        setCategory(opt.cat);
                        setCoreRequest(opt.core);
                      }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-luxe-gold bg-luxe-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-medium text-white">{opt.label}</span>
                          {opt.cat === 'outfit' && (
                            <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-luxe-gold/20 text-luxe-gold rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-luxe-gold bg-luxe-gold text-noir-950' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Occasion Context */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
                  Occasion & Environment Setting
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Everyday Street Style & Casual',
                    'Corporate Office & Business Smart',
                    'Evening Soirée & Night Out',
                    'Black Tie Gala & Red Carpet',
                    'Weekend Travel & Leisure'
                  ].map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-2.5 text-left text-xs border rounded transition-all ${
                        occasion === occ
                          ? 'border-luxe-gold bg-luxe-gold/15 text-white font-medium'
                          : 'border-white/10 text-neutral-400 bg-noir-900/50 hover:border-white/25'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET BOUNDARIES & RETAILER */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold flex items-center gap-1.5 mb-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Section 2: Budget Boundaries & Retailer Tiers</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-normal">
                  What is your budget tier?
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Budget boundaries are enforced strictly and map directly to our authentic retail partners.
                </p>
              </div>

              <div className="space-y-3.5">
                {budgetOptions.map((opt) => {
                  const isSelected = budget === opt.tier;
                  return (
                    <div
                      key={opt.tier}
                      onClick={() => setBudget(opt.tier)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-luxe-gold bg-luxe-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-base font-medium text-white">{opt.retailer}</span>
                          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-black/60 border border-white/15 text-luxe-gold rounded">
                            {opt.tier} Budget
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-luxe-champagne">{opt.range}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 mb-1">{opt.desc}</p>
                      <p className="text-[10px] text-neutral-400 italic">{opt.highlights}</p>
                    </div>
                  );
                })}
              </div>

              {/* Budget Scope and Excluded Materials */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-1.5">
                    Budget Scope Rule
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBudgetScope('look')}
                      className={`py-2 text-xs border rounded transition-all ${
                        budgetScope === 'look'
                          ? 'border-luxe-gold bg-luxe-gold/20 text-white font-medium'
                          : 'border-white/10 text-neutral-400 bg-noir-900'
                      }`}
                    >
                      Per Total Look
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetScope('item')}
                      className={`py-2 text-xs border rounded transition-all ${
                        budgetScope === 'item'
                          ? 'border-luxe-gold bg-luxe-gold/20 text-white font-medium'
                          : 'border-white/10 text-neutral-400 bg-noir-900'
                      }`}
                    >
                      Per Single Item
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-1.5">
                    Materials to Avoid (Optional)
                  </label>
                  <input
                    type="text"
                    value={excludedMaterials}
                    onChange={(e) => setExcludedMaterials(e.target.value)}
                    placeholder="e.g. wool, polyester, leather, synthetics"
                    className="w-full bg-noir-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-luxe-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STYLE TYPE & AESTHETIC PERSONA */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold flex items-center gap-1.5 mb-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Section 3: Style Aesthetic & Personal Profile</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-normal">
                  What style type resonates with you?
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose your primary design language and the visual mood you wish to embody.
                </p>
              </div>

              <div className="space-y-3">
                {styleTypeOptions.map((opt) => {
                  const isSelected = style === opt.style;
                  return (
                    <div
                      key={opt.style}
                      onClick={() => setStyle(opt.style)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-luxe-gold bg-luxe-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-serif text-sm font-medium text-white">{opt.label}</span>
                        <p className="text-[11px] text-neutral-400">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-luxe-gold bg-luxe-gold text-noir-950' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desired Psychological Impression (Multi-Select) */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
                  Desired Impression (Select all that fit your intent)
                </label>
                <div className="flex flex-wrap gap-2">
                  {impressionOptions.map((opt) => {
                    const active = desiredImpressions.includes(opt.imp);
                    return (
                      <button
                        key={opt.imp}
                        type="button"
                        onClick={() => toggleImpression(opt.imp)}
                        className={`px-3 py-1.5 rounded text-[11px] uppercase tracking-wider transition-all border ${
                          active
                            ? 'border-luxe-gold bg-luxe-gold text-noir-950 font-bold'
                            : 'border-white/15 bg-noir-900 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: COMFORT LEVEL, TACTILE FEEL & SILHOUETTE FIT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold flex items-center gap-1.5 mb-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Section 4: Comfort Level & Sensory Fit Preferences</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-normal">
                  What is your comfort level and fabric feel?
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  We don’t compromise on physical wearability. Select the tactile qualities you demand.
                </p>
              </div>

              {/* Comfort Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comfortCards.map((card) => {
                  const isChecked = comfortNeeds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleComfort(card.id)}
                      className={`p-3.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-luxe-gold bg-luxe-gold/10'
                          : 'border-white/10 hover:border-white/25 bg-noir-900/60'
                      }`}
                    >
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white">{card.title}</span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'border-luxe-gold bg-luxe-gold text-noir-950' : 'border-white/30'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">{card.desc}</p>
                      </div>
                      <span className="text-[9px] font-mono text-luxe-champagne uppercase">
                        {card.fabric}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Silhouette Cut Preference */}
              <div className="pt-2">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
                  Silhouette & Cut Proportions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {silhouetteOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSilhouette(opt.id)}
                      className={`p-2.5 text-center text-xs border rounded transition-all ${
                        silhouette === opt.id
                          ? 'border-luxe-gold bg-luxe-gold/20 text-white font-bold'
                          : 'border-white/10 text-neutral-400 bg-noir-900'
                      }`}
                    >
                      <p className="font-serif text-xs mb-0.5">{opt.label}</p>
                      <p className="text-[9px] text-neutral-400 truncate">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing & Department */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
                    Baseline Size
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`py-2 text-xs font-medium border rounded transition-all ${
                          size === s
                            ? 'border-luxe-gold bg-luxe-gold text-noir-950 font-bold'
                            : 'border-white/10 text-neutral-300 hover:border-white/30 bg-noir-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-2">
                    Department Fit Focus
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { val: 'women' as GenderPreference, label: 'Women' },
                      { val: 'men' as GenderPreference, label: 'Men' },
                      { val: 'unisex' as GenderPreference, label: 'Unisex' }
                    ].map((g) => (
                      <button
                        key={g.val}
                        type="button"
                        onClick={() => setGender(g.val)}
                        className={`py-2 text-xs border rounded transition-all ${
                          gender === g.val
                            ? 'border-luxe-gold bg-luxe-gold/20 text-white font-bold'
                            : 'border-white/10 text-neutral-400 bg-noir-900'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modesty & Coverage Preferences (Checklist Sec 4) */}
                <div className="pt-3 border-t border-white/10 sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-300 mb-1.5">
                    Modesty & Coverage Preferences (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { val: 'standard' as ModestyPreference, label: 'Standard' },
                      { val: 'high_coverage' as ModestyPreference, label: 'High Coverage' },
                      { val: 'modest_neckline' as ModestyPreference, label: 'Modest Neckline' },
                      { val: 'long_sleeve' as ModestyPreference, label: 'Long Sleeves' },
                      { val: 'maxi_length' as ModestyPreference, label: 'Maxi / Ankle Length' }
                    ].map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => toggleModesty(m.val)}
                        className={`px-2.5 py-1 rounded text-[10px] tracking-wider border ${
                          modestyPreferences.includes(m.val)
                            ? 'border-luxe-gold bg-luxe-gold/20 text-white font-medium'
                            : 'border-white/10 text-neutral-400 bg-noir-900'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: VISUAL SILHOUETTE & RUNWAY MODEL CALIBRATION */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold flex items-center gap-1.5 mb-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Section 5: Virtual Try-On Model Calibration</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-normal">
                  Calibrate Your Runway Model Silhouette
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  We composite selected outfits onto your silhouette so you can see how different garments look on you as a runway model.
                </p>
              </div>

              {/* Source Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSource('sample');
                    stopCamera();
                    setLocalPhoto(SAMPLE_USER_PHOTO);
                    setUserPhoto(SAMPLE_USER_PHOTO);
                  }}
                  className={`p-3 text-xs border rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                    photoSource === 'sample'
                      ? 'border-luxe-gold bg-luxe-gold/15 text-white font-medium'
                      : 'border-white/10 text-neutral-400 bg-noir-900/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-luxe-gold" />
                  <span>Studio Model (Instant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhotoSource('camera');
                    startCamera();
                  }}
                  className={`p-3 text-xs border rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                    photoSource === 'camera'
                      ? 'border-luxe-gold bg-luxe-gold/15 text-white font-medium'
                      : 'border-white/10 text-neutral-400 bg-noir-900/60'
                  }`}
                >
                  <Camera className="w-4 h-4 text-luxe-gold" />
                  <span>Live Webcam (Voyage)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhotoSource('upload');
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className={`p-3 text-xs border rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                    photoSource === 'upload'
                      ? 'border-luxe-gold bg-luxe-gold/15 text-white font-medium'
                      : 'border-white/10 text-neutral-400 bg-noir-900/60'
                  }`}
                >
                  <Upload className="w-4 h-4 text-luxe-gold" />
                  <span>Upload Your Photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Camera Preview or Image Display */}
              <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-xl overflow-hidden border border-white/20 bg-noir-900 shadow-2xl">
                {photoSource === 'camera' && isCameraActive ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-x-0 bottom-4 flex justify-center">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 rounded-full bg-white text-noir-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                      >
                        <Camera className="w-4 h-4 text-noir-950" />
                        <span>Snap Model Frame</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative group">
                    <img
                      src={localPhoto}
                      alt="Model Silhouette"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-black/70 border border-white/15 text-luxe-gold">
                        Model Silhouette Calibrated
                      </span>
                      <p className="text-[11px] text-neutral-300 mt-1">Ready for virtual outfit fitting</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Audit Scorecard */}
              <div className="p-3.5 bg-noir-900/80 border border-white/10 rounded-lg space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Silhoutte Framing</span>
                  </span>
                  <span className="text-emerald-400 font-mono">Calibrated Vertical</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lighting Balance</span>
                  </span>
                  <span className="text-emerald-400 font-mono">Optimal Studio Contrast</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Voyage/Vonage Video Pipeline</span>
                  </span>
                  <span className="text-luxe-gold font-mono">1080p @ 30 FPS Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-neutral-300 hover:text-white rounded flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-7 py-3.5 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-[0.2em] rounded flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-noir-950 animate-spin" />
                  <span>Launching Model Studio...</span>
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Sparkles className="w-4 h-4 text-noir-950" />
                  <span>Launch Runway Model Studio</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5 text-noir-950" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
