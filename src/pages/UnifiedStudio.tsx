import React, { useState, useEffect, useRef } from 'react';
import { useStyleLens, SAMPLE_USER_PHOTO } from '../context/StyleLensContext';
import { fetchProducts, submitTryOn } from '../services/api';
import {
  Product,
  BudgetTier,
  FashionStyle,
  GarmentCategory,
  ComfortNeed,
  TryOnResult
} from '../types/stylelens';
import { analyzeSilhouette } from '../services/bodyTypeAnalyzer';
import {
  Sparkles,
  Camera,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  ExternalLink,
  Shield,
  Sliders,
  RefreshCw,
  Info
} from 'lucide-react';

export const UnifiedStudio: React.FC = () => {
  const {
    quiz,
    setQuiz,
    userPhoto,
    setUserPhoto,
    bodyTypeAnalysis,
    setBodyTypeAnalysis,
    currentStudioStep,
    setCurrentStudioStep,
    recommendations,
    setRecommendations,
    saveLook,
    savedLooks
  } = useStyleLens();

  // Active garment for Try-On
  const [activeGarment, setActiveGarment] = useState<Product | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'runway' | 'slider' | 'sideBySide'>('runway');
  const [brandFilter, setBrandFilter] = useState<'all' | 'Zara' | 'Calvin Klein' | 'Michael Kors'>('all');

  // Camera capture state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scanning animation state for Step 3
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Stop camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Fetch products and auto-select first garment when recommendations change
  useEffect(() => {
    if (recommendations.length > 0 && !activeGarment) {
      setActiveGarment(recommendations[0]);
    }
  }, [recommendations, activeGarment]);

  // When step 3 is entered, trigger scanning animation
  useEffect(() => {
    if (currentStudioStep === 3) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsScanning(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [currentStudioStep]);

  // When step 4 is entered or activeGarment changes, generate virtual try-on
  useEffect(() => {
    if (currentStudioStep === 4 && activeGarment && userPhoto) {
      generateTryOn(activeGarment);
    }
  }, [currentStudioStep, activeGarment]);

  const generateTryOn = async (garment: Product) => {
    setIsSynthesizing(true);
    try {
      const res = await submitTryOn(userPhoto || SAMPLE_USER_PHOTO, garment.id);
      setTryOnResult(res);
    } catch (err) {
      console.warn('Try-on synthesis fallback:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Camera handlers
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please upload an image or choose our Studio Model preset.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCountdown(null);
  };

  const capturePhotoCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          snapPhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setUserPhoto(dataUrl);
      const analysis = analyzeSilhouette(dataUrl);
      setBodyTypeAnalysis(analysis);
      stopCamera();
      // Advance to body scan
      setCurrentStudioStep(3);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUserPhoto(result);
          const analysis = analyzeSilhouette(result);
          setBodyTypeAnalysis(analysis);
          setCurrentStudioStep(3);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePresetModel = () => {
    setUserPhoto(SAMPLE_USER_PHOTO);
    const analysis = analyzeSilhouette(SAMPLE_USER_PHOTO);
    setBodyTypeAnalysis(analysis);
    setCurrentStudioStep(3);
  };

  const handleCompleteIntake = async () => {
    // Refresh products matching quiz
    const { products } = await fetchProducts({
      budget: quiz.budget,
      category: quiz.category === 'outfit' ? undefined : quiz.category,
      style: quiz.style
    });
    if (products && products.length > 0) {
      setRecommendations(products);
      setActiveGarment(products[0]);
    }
    setCurrentStudioStep(2);
  };

  // Filtered recommendations for lookbook dock
  const displayedGarments = recommendations.filter((p) => {
    if (brandFilter === 'all') return true;
    return p.brand === brandFilter;
  });

  return (
    <div className="min-h-screen bg-noir-950 text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-luxe-gold/8 via-white/3 to-transparent blur-[140px] pointer-events-none" />

      {/* Main Studio Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ---------------------------------------------------- */}
        {/* STEP 1: QUICK STYLE & BUDGET INTAKE                  */}
        {/* ---------------------------------------------------- */}
        {currentStudioStep === 1 && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header / Intro */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxe-gold/30 bg-noir-900/80 text-[11px] uppercase tracking-[0.25em] text-luxe-gold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-luxe-gold" />
                <span>Step 1 · Quick Style & Budget Calibration</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide uppercase text-white mb-3">
                Curate Your <span className="text-gradient-gold font-normal">Fashion Profile</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 tracking-wider uppercase max-w-xl mx-auto">
                Answer 4 quick preferences. In the next step, upload or snap a photo for instant AI body type fitting.
              </p>
            </div>

            <div className="space-y-8 bg-noir-900/60 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-md">
              {/* Question 1: Budget Tier & Mapped Retailer */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-luxe-gold/20 text-luxe-gold text-[10px] font-bold flex items-center justify-center">1</span>
                    Budget Tier & Retailer
                  </label>
                  <span className="text-[11px] text-luxe-gold uppercase tracking-wider">
                    {quiz.budget === 'low' ? 'Zara' : quiz.budget === 'medium' ? 'Calvin Klein' : 'Michael Kors'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'low' as BudgetTier,
                      brand: 'Zara',
                      range: '$25 – $99',
                      tag: 'High-Street Silhouettes',
                      desc: 'Trend-forward cuts, sharp blazers, and urban street essentials.'
                    },
                    {
                      id: 'medium' as BudgetTier,
                      brand: 'Calvin Klein',
                      range: '$60 – $220',
                      tag: 'Modern Minimalism',
                      desc: 'Iconic Americana denim, sculpted knitwear & clean tailored lines.'
                    },
                    {
                      id: 'high' as BudgetTier,
                      brand: 'Michael Kors',
                      range: '$250 – $950',
                      tag: 'Tailored Luxury',
                      desc: 'Double-face wool trench coats, evening georgette gowns & jet-set glamour.'
                    }
                  ].map((tier) => {
                    const isSelected = quiz.budget === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setQuiz((prev) => ({ ...prev, budget: tier.id }))}
                        className={`text-left p-5 rounded-xl border transition-all relative ${
                          isSelected
                            ? 'bg-luxe-gold/10 border-luxe-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                            : 'bg-noir-950/70 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-serif text-lg font-bold text-white">{tier.brand}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-luxe-gold text-noir-950' : 'bg-white/10 text-neutral-400'
                          }`}>
                            {tier.range}
                          </span>
                        </div>
                        <p className="text-[11px] text-luxe-champagne uppercase tracking-wider mb-2 font-medium">{tier.tag}</p>
                        <p className="text-xs text-neutral-400 leading-relaxed">{tier.desc}</p>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-luxe-gold flex items-center justify-center text-noir-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Fashion Aesthetic */}
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-luxe-gold/20 text-luxe-gold text-[10px] font-bold flex items-center justify-center">2</span>
                  Aesthetic & Personal Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'streetwear' as FashionStyle, label: 'Streetwear', icon: '✦' },
                    { id: 'casual' as FashionStyle, label: 'Minimalist Luxe', icon: '◈' },
                    { id: 'business' as FashionStyle, label: 'Sharp Tailored', icon: '▲' },
                    { id: 'formal' as FashionStyle, label: 'Evening Glamour', icon: '★' },
                    { id: 'athleisure' as FashionStyle, label: 'Active Chic', icon: '●' }
                  ].map((styleItem) => {
                    const isSelected = quiz.style === styleItem.id;
                    return (
                      <button
                        key={styleItem.id}
                        type="button"
                        onClick={() => setQuiz((prev) => ({ ...prev, style: styleItem.id }))}
                        className={`p-3.5 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-white text-noir-950 border-white font-bold shadow-lg'
                            : 'bg-noir-950/70 border-white/10 text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        <span className="block text-base mb-1">{styleItem.icon}</span>
                        <span className="text-xs uppercase tracking-wider">{styleItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Comfort Level & Sensory Needs */}
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-luxe-gold/20 text-luxe-gold text-[10px] font-bold flex items-center justify-center">3</span>
                  Comfort Level & Sensory Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'high_stretch' as ComfortNeed,
                      title: 'Ultra-Soft Stretch',
                      desc: 'Zero waistband pinch, flexible 4-way modal elastane.'
                    },
                    {
                      id: 'breathable_natural' as ComfortNeed,
                      title: '100% Breathable',
                      desc: 'Airy linen, organic cotton & temperature-cooling fibers.'
                    },
                    {
                      id: 'structured_tailored' as ComfortNeed,
                      title: 'Structured Tailoring',
                      desc: 'Defined shoulders, crisp lapels & posture-enhancing weave.'
                    },
                    {
                      id: 'sensitive_skin' as ComfortNeed,
                      title: 'Sensitive-Skin Tagless',
                      desc: 'Friction-free flatlock seams & hypoallergenic lining.'
                    }
                  ].map((item) => {
                    const currentNeeds = quiz.comfortNeeds || [];
                    const isSelected = currentNeeds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQuiz((prev) => {
                            const active = prev.comfortNeeds || [];
                            const updated = active.includes(item.id)
                              ? active.filter((c) => c !== item.id)
                              : [...active, item.id];
                            return { ...prev, comfortNeeds: updated };
                          });
                        }}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-luxe-gold/15 border-luxe-gold text-white'
                            : 'bg-noir-950/70 border-white/10 text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white uppercase tracking-wider">{item.title}</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-luxe-gold text-noir-950 font-bold' : 'border border-white/20'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Kind of Clothes */}
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-luxe-gold/20 text-luxe-gold text-[10px] font-bold flex items-center justify-center">4</span>
                  Kind of Clothes Desired
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'outfit' as GarmentCategory, label: 'Complete Look' },
                    { id: 'outerwear' as GarmentCategory, label: 'Jackets & Coats' },
                    { id: 'tops' as GarmentCategory, label: 'Tops & Knits' },
                    { id: 'bottoms' as GarmentCategory, label: 'Trousers & Denim' },
                    { id: 'dresses' as GarmentCategory, label: 'Dresses & Gowns' }
                  ].map((cat) => {
                    const isSelected = quiz.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setQuiz((prev) => ({ ...prev, category: cat.id }))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-white text-noir-950 border-white font-bold'
                            : 'bg-noir-950/70 border-white/10 text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCompleteIntake}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] rounded-lg"
                >
                  <span>Continue to Photo & Silhouette</span>
                  <ArrowRight className="w-4 h-4 text-noir-950" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 2: PHOTO CAPTURE OR UPLOAD                     */}
        {/* ---------------------------------------------------- */}
        {currentStudioStep === 2 && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxe-gold/30 bg-noir-900/80 text-[11px] uppercase tracking-[0.25em] text-luxe-gold mb-3">
                <Camera className="w-3.5 h-3.5 text-luxe-gold" />
                <span>Step 2 · Photo Capture & Silhouette Framing</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide uppercase text-white mb-2">
                Capture or <span className="text-gradient-gold font-normal">Upload Your Photo</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 tracking-wider uppercase max-w-xl mx-auto">
                We analyze your proportions in the next step to detect your body type and personalize garment drape.
              </p>
            </div>

            <div className="bg-noir-900/60 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-md">
              {/* Camera Active Mode */}
              {cameraActive ? (
                <div className="relative max-w-lg mx-auto bg-black rounded-xl overflow-hidden border border-luxe-gold/40 shadow-2xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-[450px] object-cover"
                  />
                  {/* Silhouette Framing Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-luxe-gold/40 m-6 rounded-lg flex flex-col items-center justify-between p-4">
                    <span className="text-[10px] uppercase tracking-widest bg-noir-950/80 px-2 py-1 text-luxe-champagne rounded">
                      Align Full Upper Body in Frame
                    </span>
                    <span className="text-[10px] uppercase tracking-widest bg-noir-950/80 px-2 py-1 text-neutral-400 rounded">
                      Standing Center Pose
                    </span>
                  </div>

                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <span className="font-serif text-7xl font-bold text-luxe-gold animate-ping">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10 px-4">
                    <button
                      type="button"
                      onClick={capturePhotoCountdown}
                      disabled={countdown !== null}
                      className="px-6 py-2.5 bg-luxe-gold hover:bg-luxe-champagne text-noir-950 text-xs uppercase font-bold tracking-widest rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{countdown ? 'Posing...' : 'Snap Photo (3s Timer)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 bg-noir-950/80 hover:bg-noir-900 text-white text-xs uppercase tracking-wider rounded-full border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Method Selection Cards */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Option A: Live Camera */}
                  <div className="bg-noir-950/70 border border-white/10 hover:border-luxe-gold/50 rounded-xl p-6 text-center flex flex-col justify-between transition-all group">
                    <div>
                      <div className="w-14 h-14 rounded-full bg-luxe-gold/10 border border-luxe-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-luxe-gold" />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-white mb-2">Live Camera</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        Snap a photo using your webcam or phone camera with a 3-second pose guide.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full py-3 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                    >
                      Open Camera
                    </button>
                  </div>

                  {/* Option B: Upload Photo */}
                  <div className="bg-noir-950/70 border border-white/10 hover:border-luxe-gold/50 rounded-xl p-6 text-center flex flex-col justify-between transition-all group">
                    <div>
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-white mb-2">Upload Photo</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        Upload an existing portrait or full-body picture from your device.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 bg-noir-800 hover:bg-noir-700 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>

                  {/* Option C: Studio Runway Model Preset */}
                  <div className="bg-noir-950/70 border border-white/10 hover:border-luxe-gold/50 rounded-xl p-6 text-center flex flex-col justify-between transition-all group">
                    <div>
                      <div className="w-14 h-14 rounded-full bg-luxe-gold/10 border border-luxe-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-luxe-gold" />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-white mb-2">Studio Model</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        Instant 1-click test with our calibrated high-fashion runway model profile.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUsePresetModel}
                      className="w-full py-3 bg-luxe-gold/20 hover:bg-luxe-gold/30 text-luxe-champagne border border-luxe-gold/40 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                    >
                      Use Studio Model
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs mb-6 text-center">
                  {cameraError}
                </div>
              )}

              {/* Current photo preview if exists */}
              {userPhoto && !cameraActive && (
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={userPhoto}
                      alt="Calibrated Photo"
                      className="w-14 h-18 object-cover rounded-lg border border-luxe-gold/40"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold">Photo Loaded</span>
                      <p className="text-xs text-neutral-300">Ready for AI body type scanning & clothing recommendations.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStudioStep(3)}
                    className="px-6 py-3 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Body Scan</span>
                    <ArrowRight className="w-4 h-4 text-noir-950" />
                  </button>
                </div>
              )}

              {/* Back navigation */}
              <div className="mt-8 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentStudioStep(1)}
                  className="text-neutral-400 hover:text-white flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Style Intake</span>
                </button>
                <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-luxe-gold" />
                  <span>Photos are strictly ephemeral and processed locally</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: AI BODY TYPE & SILHOUETTE SCAN              */}
        {/* ---------------------------------------------------- */}
        {currentStudioStep === 3 && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxe-gold/30 bg-noir-900/80 text-[11px] uppercase tracking-[0.25em] text-luxe-gold mb-3">
                <Sliders className="w-3.5 h-3.5 text-luxe-gold" />
                <span>Step 3 · AI Body Type & Proportion Analysis</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide uppercase text-white mb-2">
                Your Silhouette <span className="text-gradient-gold font-normal">Blueprint</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 tracking-wider uppercase max-w-xl mx-auto">
                Analyzed from your photo to match optimal garment drape, shoulder width, and waistline cuts.
              </p>
            </div>

            <div className="bg-noir-900/60 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-md">
              {isScanning ? (
                /* Scanning Animation */
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="relative w-48 h-64 rounded-xl overflow-hidden border border-luxe-gold shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6">
                    <img
                      src={userPhoto || SAMPLE_USER_PHOTO}
                      alt="Scanning silhouette"
                      className="w-full h-full object-cover filter brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxe-gold/40 to-transparent h-12 w-full animate-bounce pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-2 text-luxe-gold font-serif text-lg tracking-widest uppercase mb-1">
                    <RefreshCw className="w-4 h-4 animate-spin text-luxe-gold" />
                    <span>Mapping Shoulder & Torso Proportions...</span>
                  </div>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest">
                    Detecting balance curves according to fashion drape geometry
                  </p>
                </div>
              ) : bodyTypeAnalysis ? (
                /* Detected Body Type Results */
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* User Silhouette Avatar */}
                    <div className="relative rounded-xl overflow-hidden border border-luxe-gold/40 shadow-2xl h-80">
                      <img
                        src={userPhoto || SAMPLE_USER_PHOTO}
                        alt="Analyzed Pose"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold">
                          Silhouette Calibrated
                        </span>
                        <p className="text-sm font-serif font-bold text-white">{bodyTypeAnalysis.label}</p>
                        <p className="text-[10px] text-neutral-400">{bodyTypeAnalysis.confidence}% drape match confidence</p>
                      </div>
                    </div>

                    {/* Proportions Breakdown */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-luxe-gold/15 border border-luxe-gold/30 text-luxe-champagne text-[10px] uppercase tracking-widest font-bold mb-2">
                          <span>Detected Silhouette Type</span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                          {bodyTypeAnalysis.label}
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          {bodyTypeAnalysis.summary}
                        </p>
                      </div>

                      {/* Metric Callouts */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 bg-noir-950/80 border border-white/10 rounded-lg">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Shoulder Line</span>
                          <span className="text-xs font-semibold text-white">{bodyTypeAnalysis.proportions.shoulderToWaist}</span>
                        </div>
                        <div className="p-3 bg-noir-950/80 border border-white/10 rounded-lg">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Waist to Hip</span>
                          <span className="text-xs font-semibold text-white">{bodyTypeAnalysis.proportions.waistToHip}</span>
                        </div>
                        <div className="p-3 bg-noir-950/80 border border-white/10 rounded-lg">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Vertical Ratio</span>
                          <span className="text-xs font-semibold text-white">{bodyTypeAnalysis.proportions.verticalBalance}</span>
                        </div>
                      </div>

                      {/* Best Silhouettes */}
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold block mb-2">
                          Recommended Cuts & Hemlines:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {bodyTypeAnalysis.bestSilhouettes.map((sil, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[11px] text-neutral-200"
                            >
                              ✓ {sil}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Styling Tips Banner */}
                  <div className="p-4 rounded-xl bg-luxe-gold/10 border border-luxe-gold/30">
                    <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold block mb-2">
                      Personalized Silhouette Drape Guidelines:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
                      {bodyTypeAnalysis.stylingAdvice.map((advice, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-luxe-gold mt-0.5">✦</span>
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advance to Virtual Try-On */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStudioStep(2)}
                      className="text-neutral-400 hover:text-white text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Retake / Change Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStudioStep(4)}
                      className="w-full sm:w-auto px-8 py-4 bg-luxe-gold hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
                    >
                      <span>Reveal Recommended Clothes & Try On</span>
                      <ArrowRight className="w-4 h-4 text-noir-950" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 4: RECOMMENDATIONS & RUNWAY VIRTUAL TRY-ON      */}
        {/* ---------------------------------------------------- */}
        {currentStudioStep === 4 && activeGarment && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar with Retailer Info and View Mode Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold font-bold">
                    Virtual Try-On Runway
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                    Body Type: {bodyTypeAnalysis?.label || 'Calibrated'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-light uppercase tracking-wide">
                  {activeGarment.name}
                </h2>
                <p className="text-xs text-neutral-400">
                  By <span className="text-white font-semibold">{activeGarment.brand}</span> · ${activeGarment.price.toFixed(2)} USD
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-2 bg-noir-900 border border-white/10 p-1.5 rounded-lg">
                {[
                  { id: 'runway', label: 'Runway Model' },
                  { id: 'slider', label: 'Split Slider' },
                  { id: 'sideBySide', label: 'Side-by-Side' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-semibold transition-all ${
                      viewMode === mode.id
                        ? 'bg-white text-noir-950 font-bold shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stage Grid: Large Fitting Canvas + Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Try-On Canvas (8 Cols) */}
              <div className="lg:col-span-8 bg-black rounded-2xl border border-white/15 overflow-hidden shadow-2xl relative min-h-[520px] flex items-center justify-center">

                {/* Loading / Neural Synthesis state */}
                {isSynthesizing && (
                  <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in">
                    <RefreshCw className="w-8 h-8 text-luxe-gold animate-spin mb-3" />
                    <p className="font-serif text-sm tracking-widest text-luxe-champagne uppercase">
                      Fitting Garment to Your Body Silhouette...
                    </p>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                      Calibrating fabric drape, lighting & texture
                    </span>
                  </div>
                )}

                {/* VIEW MODE 1: Runway Model Canvas */}
                {viewMode === 'runway' && (
                  <div className="relative w-full h-[580px] bg-gradient-to-b from-noir-900 via-noir-950 to-black overflow-hidden flex items-center justify-center">
                    <img
                      src={tryOnResult?.tryOnImage || userPhoto || SAMPLE_USER_PHOTO}
                      alt="Runway Model Fitting"
                      className="w-full h-full object-contain filter contrast-105"
                    />

                    {/* Editorial Runway Badges */}
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5">
                      <div className="px-3 py-1 bg-noir-950/80 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-[0.25em] text-white font-bold rounded">
                        STYLELENS CAMPAIGN 2026
                      </div>
                      <div className="px-3 py-1 bg-luxe-gold text-noir-950 text-[9px] uppercase tracking-[0.2em] font-bold rounded shadow-md">
                        {activeGarment.brand} · ${activeGarment.price}
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-1.5">
                      <div className="px-2.5 py-1 bg-noir-950/80 border border-luxe-gold/40 text-[9px] uppercase tracking-wider text-luxe-champagne rounded">
                        {tryOnResult?.confidenceScore || 94}% Fit Precision
                      </div>
                      <span className="text-[9px] text-neutral-400 bg-noir-950/80 px-2 py-0.5 rounded">
                        Body: {bodyTypeAnalysis?.label.split('/')[0] || 'Proportional'}
                      </span>
                    </div>

                    {/* Bottom editorial watermark */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest bg-noir-950/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                      <span>{activeGarment.name}</span>
                      <span>Fabric: {activeGarment.color}</span>
                      <span className="text-luxe-gold">Verified Silhouette Match</span>
                    </div>
                  </div>
                )}

                {/* VIEW MODE 2: Draggable Split Slider */}
                {viewMode === 'slider' && (
                  <div
                    className="relative w-full h-[580px] select-none overflow-hidden cursor-ew-resize bg-black"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                      setSliderPosition((x / rect.width) * 100);
                    }}
                    onTouchMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const touch = e.touches[0];
                      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                      setSliderPosition((x / rect.width) * 100);
                    }}
                  >
                    {/* Underlying Styled Garment */}
                    <img
                      src={tryOnResult?.tryOnImage || userPhoto || SAMPLE_USER_PHOTO}
                      alt="Styled Model"
                      className="absolute inset-0 w-full h-full object-contain"
                    />

                    {/* Clip original user photo */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        src={userPhoto || SAMPLE_USER_PHOTO}
                        alt="Original Photo"
                        className="w-full h-full object-contain filter grayscale-[30%]"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 text-[9px] uppercase tracking-widest text-neutral-300 rounded border border-white/10">
                        Original Photo
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-luxe-gold text-noir-950 font-bold px-2.5 py-1 text-[9px] uppercase tracking-widest rounded shadow">
                      Styled with {activeGarment.brand}
                    </div>

                    {/* Draggable Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-noir-950 font-bold text-[10px] flex items-center justify-center shadow-2xl">
                        ↔
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW MODE 3: Side-by-Side Dual View */}
                {viewMode === 'sideBySide' && (
                  <div className="w-full h-[580px] grid grid-cols-2 divide-x divide-white/15 bg-black">
                    <div className="relative h-full flex items-center justify-center p-2">
                      <img
                        src={userPhoto || SAMPLE_USER_PHOTO}
                        alt="Original Pose"
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute bottom-4 left-4 bg-noir-950/80 px-2.5 py-1 text-[9px] uppercase tracking-widest text-neutral-300 rounded border border-white/10">
                        Original Stance
                      </span>
                    </div>

                    <div className="relative h-full flex items-center justify-center p-2">
                      <img
                        src={tryOnResult?.tryOnImage || userPhoto || SAMPLE_USER_PHOTO}
                        alt="Fitted Garment"
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute bottom-4 left-4 bg-luxe-gold text-noir-950 font-bold px-2.5 py-1 text-[9px] uppercase tracking-widest rounded shadow">
                        Fitted: {activeGarment.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Garment Details & Actions Panel (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-noir-900/80 border border-white/10 backdrop-blur-md space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-bold block mb-1">
                      Official Retailer
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">{activeGarment.brand}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{activeGarment.description}</p>
                  </div>

                  <div className="p-3 bg-noir-950 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">Retail Price</span>
                      <span className="text-xl font-bold text-white font-serif">${activeGarment.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">Available Sizes</span>
                      <span className="text-xs font-semibold text-luxe-champagne">{activeGarment.sizes.join(' · ')}</span>
                    </div>
                  </div>

                  {/* Body Type Recommendation Badge */}
                  {bodyTypeAnalysis && (
                    <div className="p-3 rounded-lg bg-luxe-gold/10 border border-luxe-gold/30">
                      <span className="text-[9px] uppercase tracking-widest text-luxe-gold font-bold block mb-1">
                        Silhouette Drape Assessment
                      </span>
                      <p className="text-xs text-neutral-200 leading-snug">
                        Flattering for your <span className="font-semibold text-white">{bodyTypeAnalysis.label}</span> proportions. Enhances posture alignment and balance.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={activeGarment.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-white hover:bg-luxe-champagne text-noir-950 font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      <span>Buy on {activeGarment.brand}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-noir-950" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        saveLook(activeGarment, tryOnResult?.tryOnImage || userPhoto || SAMPLE_USER_PHOTO);
                        alert(`Saved "${activeGarment.name}" to your StyleLens Wardrobe!`);
                      }}
                      className="w-full py-3 bg-noir-950 hover:bg-noir-800 text-white text-xs uppercase tracking-wider font-semibold rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-luxe-gold" />
                      <span>Save to Wardrobe ({savedLooks.length})</span>
                    </button>
                  </div>
                </div>

                {/* FTC Disclosure */}
                <div className="p-4 rounded-xl bg-noir-950/60 border border-white/10 text-[10px] text-neutral-500 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-semibold mb-1">
                    <Info className="w-3.5 h-3.5 text-luxe-gold" />
                    <span>FTC & Simulation Compliance</span>
                  </div>
                  Virtual try-on preview is an AI-generated digital simulation for fit & drape approximation. Fabric stretch and lighting may vary in physical wear.
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* MULTI-OUTFIT LOOKBOOK SWITCHER DOCK                  */}
            {/* ---------------------------------------------------- */}
            <div className="p-6 rounded-2xl bg-noir-900/90 border border-white/15 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                    <span>Curated Outfits for Your Body Type</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-sans">
                      {displayedGarments.length} Pieces
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Click any garment below to immediately preview it on your model silhouette.
                  </p>
                </div>

                {/* Retailer Filter */}
                <div className="flex items-center gap-1.5 bg-noir-950 p-1 rounded-lg border border-white/10">
                  {(['all', 'Zara', 'Calvin Klein', 'Michael Kors'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrandFilter(b)}
                      className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-semibold transition-all ${
                        brandFilter === b
                          ? 'bg-luxe-gold text-noir-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {b === 'all' ? 'All Brands' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Cards Carousel */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-2">
                {displayedGarments.map((garment) => {
                  const isCurrent = activeGarment.id === garment.id;
                  return (
                    <button
                      key={garment.id}
                      type="button"
                      onClick={() => setActiveGarment(garment)}
                      className={`text-left rounded-xl overflow-hidden border transition-all p-2 relative group flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-luxe-gold/15 border-luxe-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]'
                          : 'bg-noir-950 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-2 bg-neutral-900">
                        <img
                          src={garment.imageUrl}
                          alt={garment.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-noir-950/80 text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded text-white">
                          {garment.brand}
                        </span>
                        {isCurrent && (
                          <span className="absolute bottom-1.5 right-1.5 bg-luxe-gold text-noir-950 font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                            Active Fit
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-[11px] font-medium text-white truncate">{garment.name}</h4>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-0.5">
                          <span>${garment.price}</span>
                          <span className="text-[9px] uppercase text-luxe-champagne">{garment.category}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-xs pt-4">
              <button
                type="button"
                onClick={() => setCurrentStudioStep(1)}
                className="text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Adjust Style & Budget Filters</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStudioStep(2)}
                className="text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-luxe-gold" />
                <span>Change / Retake Photo</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
