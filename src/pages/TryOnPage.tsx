import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ExternalLink,
  Sliders,
  Bookmark,
  ArrowLeft,
  Check,
  Camera,
  Columns2,
  Info,
  Video,
  SunMedium,
  Layers,
  UserCheck
} from 'lucide-react';
import { useStyleLens, SAMPLE_USER_PHOTO } from '../context/StyleLensContext';
import { Product, TryOnResult } from '../types/stylelens';
import { fetchProductById, fetchProducts, submitTryOn } from '../services/api';
import { SimulationDisclaimer } from '../components/SimulationDisclaimer';
import { voyageVideoProvider, VideoSessionStats } from '../services/voyageVideoProvider';

type RunwayBackdrop = 'paris' | 'atelier' | 'milan' | 'soho';

export const TryOnPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { userPhoto, quiz, saveLook, savedLooks } = useStyleLens();

  const [garment, setGarment] = useState<Product | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [allOutfits, setAllOutfits] = useState<Product[]>([]);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<'all' | 'Zara' | 'Calvin Klein' | 'Michael Kors'>('all');
  const [error, setError] = useState<string | null>(null);

  // Model Studio Presentation States
  const [viewMode, setViewMode] = useState<'runway' | 'slider' | 'sideBySide' | 'liveVideo'>('runway');
  const [backdrop, setBackdrop] = useState<RunwayBackdrop>('atelier');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTransitioningOutfit, setIsTransitioningOutfit] = useState(false);

  // Voyage / Vonage Video API Live Session States
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [videoStats, setVideoStats] = useState<VideoSessionStats>(voyageVideoProvider.stats);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const containerRef = useRef<HTMLDivElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null);

  // Progressive loading animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

  // Load all available outfits for multi-outfit switching
  useEffect(() => {
    fetchProducts({}).then((res) => {
      if (res.products && res.products.length > 0) {
        setAllOutfits(res.products);
      }
    });
  }, []);

  // Listen to Voyage Video stats
  useEffect(() => {
    voyageVideoProvider.onStatsUpdate((updatedStats) => {
      setVideoStats(updatedStats);
    });
  }, []);

  // Fetch product and compute Try-On fit
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setLoadingStage(0);
    setError(null);

    fetchProductById(productId)
      .then(async (prod) => {
        if (!prod) {
          setError('Garment could not be located.');
          setLoading(false);
          return;
        }
        setGarment(prod);

        const photoToUse = userPhoto || SAMPLE_USER_PHOTO;
        try {
          const result = await submitTryOn(photoToUse, prod.id);
          setTryOnResult(result);
        } catch (err) {
          console.error('Try-on render failed:', err);
          setError('Virtual fitting failed. Please select another piece.');
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Product fetch failed:', err);
        setError('Failed to retrieve garment details.');
        setLoading(false);
      });
  }, [productId, userPhoto]);

  // Start Voyage / Vonage Video live session when switching to liveVideo viewMode
  useEffect(() => {
    if (viewMode === 'liveVideo') {
      startLiveVideoSession();
    } else {
      stopLiveVideoSession();
    }
    return () => {
      stopLiveVideoSession();
    };
  }, [viewMode, garment, facingMode]);

  const startLiveVideoSession = async () => {
    try {
      await voyageVideoProvider.initSession({ resolution: '1080p', frameRate: 30 });
      if (liveVideoRef.current && liveCanvasRef.current) {
        await voyageVideoProvider.startLiveStream(liveVideoRef.current, liveCanvasRef.current, facingMode);
        voyageVideoProvider.renderGarmentOverlay(
          liveVideoRef.current,
          liveCanvasRef.current,
          garment,
          true
        );
        setIsLiveStreaming(true);
      }
    } catch (err) {
      console.error('Voyage Video API live stream error:', err);
      setIsLiveStreaming(false);
    }
  };

  const stopLiveVideoSession = () => {
    voyageVideoProvider.stopLiveStream();
    setIsLiveStreaming(false);
  };

  const handleCaptureFromLiveStream = () => {
    if (liveVideoRef.current) {
      const snapshot = voyageVideoProvider.captureRunwaySnapshot(liveVideoRef.current);
      // Switch back to runway presentation mode
      setViewMode('runway');
      // Trigger new try-on composite with this live snapshot
      if (garment) {
        setLoading(true);
        submitTryOn(snapshot, garment.id)
          .then((res) => {
            setTryOnResult(res);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }
  };

  // Instant Outfit Switching Handler
  const handleSwitchOutfit = (newProduct: Product) => {
    if (newProduct.id === garment?.id) return;
    setIsTransitioningOutfit(true);
    navigate(`/try-on/${newProduct.id}`);
    setTimeout(() => {
      setIsTransitioningOutfit(false);
    }, 450);
  };

  // Dragging slider
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const isCurrentSaved = garment ? savedLooks.some((l) => l.garment.id === garment.id) : false;

  const handleSave = () => {
    if (garment) {
      const photoToUse = userPhoto || SAMPLE_USER_PHOTO;
      saveLook(garment, photoToUse);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const baseUserPhoto = userPhoto || SAMPLE_USER_PHOTO;

  // Filter outfits in lookbook
  const filteredOutfits = allOutfits.filter((p) => {
    if (selectedBrandFilter === 'all') return true;
    return p.brand === selectedBrandFilter;
  });

  // Backdrop style configurations
  const backdropStyles: Record<RunwayBackdrop, { name: string; bg: string; glow: string }> = {
    paris: {
      name: 'Grand Palais Runway',
      bg: 'bg-gradient-to-b from-noir-900 via-amber-950/20 to-noir-950',
      glow: 'rgba(212, 175, 55, 0.25)'
    },
    atelier: {
      name: 'Atelier Minimalist Studio',
      bg: 'bg-gradient-to-b from-neutral-900 via-zinc-950 to-noir-950',
      glow: 'rgba(255, 255, 255, 0.15)'
    },
    milan: {
      name: 'Milan Penthouse Loft',
      bg: 'bg-gradient-to-b from-stone-900 via-noir-900 to-noir-950',
      glow: 'rgba(245, 158, 11, 0.2)'
    },
    soho: {
      name: 'SoHo Editorial Street',
      bg: 'bg-gradient-to-b from-slate-900 via-neutral-950 to-noir-950',
      glow: 'rgba(14, 165, 233, 0.2)'
    }
  };

  return (
    <div className={`min-h-screen ${backdropStyles[backdrop].bg} text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-700`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR: Back Link, Model Info & Studio Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Catalog</span>
            </Link>
            <span className="text-white/20">|</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold font-bold">
                  HAUTE RUNWAY MODEL STUDIO
                </span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                  Model: Calibrated Silhouette
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Fit Size: <span className="text-white font-mono">{quiz.size || 'M'}</span> · Proportions: <span className="text-white capitalize">{quiz.silhouettePreference?.replace('_', ' ') || 'Relaxed Oversized'}</span>
              </p>
            </div>
          </div>

          {/* STUDIO CONTROLS: Atmosphere & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Atmosphere Selector */}
            <div className="flex items-center gap-1 bg-noir-900/90 border border-white/15 rounded-lg p-1">
              <SunMedium className="w-3.5 h-3.5 text-luxe-gold ml-1.5 mr-1" />
              {(['atelier', 'paris', 'milan', 'soho'] as RunwayBackdrop[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBackdrop(mode)}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded transition-all ${
                    backdrop === mode
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-noir-900/90 border border-white/15 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('runway')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'runway'
                    ? 'bg-luxe-gold text-noir-950 font-bold shadow'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>Runway Model</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'slider'
                    ? 'bg-luxe-gold text-noir-950 font-bold shadow'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3 rotate-90" />
                <span>Split Slider</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'sideBySide'
                    ? 'bg-luxe-gold text-noir-950 font-bold shadow'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>Dual</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('liveVideo')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'liveVideo'
                    ? 'bg-emerald-400 text-noir-950 font-bold shadow'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Voyage Video Live</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOADING ANIMATION */}
        {loading && (
          <div className="py-24 text-center max-w-md mx-auto space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-luxe-gold/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-2 border-luxe-gold border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-luxe-gold" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
                Fitting Model on Runway
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Calibrating physical garment physics, drape lighting, and silhouette contours...
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-noir-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-luxe-gold to-white h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((loadingStage + 1) / 4) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] uppercase tracking-wider text-neutral-500 text-center">
                <span className={loadingStage >= 0 ? 'text-luxe-gold font-bold' : ''}>1. Framing</span>
                <span className={loadingStage >= 1 ? 'text-luxe-gold font-bold' : ''}>2. Drape</span>
                <span className={loadingStage >= 2 ? 'text-luxe-gold font-bold' : ''}>3. Lighting</span>
                <span className={loadingStage >= 3 ? 'text-luxe-gold font-bold' : ''}>4. Render</span>
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="py-16 text-center glass-panel p-8 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 mb-4">{error}</p>
            <Link
              to="/recommendations"
              className="px-5 py-2.5 bg-white text-noir-950 text-xs uppercase tracking-widest font-semibold rounded"
            >
              Return to Catalog
            </Link>
          </div>
        )}

        {/* MAIN WORKSPACE */}
        {!loading && garment && tryOnResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* MODEL VIEWPORT CANVAS (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                {/* 1. RUNWAY MODEL VIEW (Editorial Hero) */}
                {viewMode === 'runway' && (
                  <div className="relative w-full aspect-[3/4] max-h-[640px] bg-noir-900 border border-white/20 rounded-xl overflow-hidden shadow-2xl group select-none">
                    {/* Model Image */}
                    <img
                      src={tryOnResult.tryOnImage}
                      alt="Runway Model Preview"
                      className="w-full h-full object-cover object-top filter contrast-[1.03] transition-transform duration-700 group-hover:scale-[1.01]"
                    />

                    {/* Editorial Runway Watermark & Lighting Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-transparent to-noir-950/40 pointer-events-none" />

                    {/* Top Runway Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
                      <div className="bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1 rounded flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest text-luxe-gold uppercase">
                          CAMPAIGN 2026 · {garment.brand.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded text-[10px] font-mono text-white">
                        CONFIDENCE {tryOnResult.confidenceScore}%
                      </div>
                    </div>

                    {/* Bottom Model Card Callouts */}
                    <div className="absolute bottom-4 inset-x-4 z-10 flex items-end justify-between">
                      <div className="bg-black/85 backdrop-blur-md p-3 rounded-lg border border-white/15 max-w-sm">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-luxe-gold block font-semibold">
                          Runway Fitting
                        </span>
                        <h4 className="font-serif text-sm sm:text-base text-white">{garment.name}</h4>
                        <p className="text-[10px] text-neutral-300 mt-0.5 line-clamp-1">
                          {garment.materialComposition || 'Engineered tailored fabric with dynamic drape contours.'}
                        </p>
                      </div>

                      <div className="bg-luxe-gold text-noir-950 font-mono text-xs font-bold px-3 py-1.5 rounded shadow">
                        ${garment.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SPLIT SLIDER VIEW */}
                {viewMode === 'slider' && (
                  <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchMove={handleTouchMove}
                    className="relative w-full aspect-[3/4] max-h-[640px] bg-noir-900 border border-white/20 rounded-xl overflow-hidden select-none cursor-ew-resize shadow-2xl"
                  >
                    {/* Layer A: Base User Photo */}
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={baseUserPhoto}
                        alt="Original Silhouette"
                        className="w-full h-full object-cover object-top filter brightness-95"
                      />
                      <div className="absolute bottom-4 left-4 z-10 bg-black/75 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-neutral-300 rounded border border-white/10">
                        Original Posture
                      </div>
                    </div>

                    {/* Layer B: Composited Model (Clipped) */}
                    <div
                      style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
                      className="absolute inset-0 w-full h-full z-10 overflow-hidden"
                    >
                      <img
                        src={tryOnResult.tryOnImage}
                        alt="Model Fitted"
                        className="w-full h-full object-cover object-top filter contrast-105"
                      />
                      <div className="absolute bottom-4 right-4 z-10 bg-luxe-gold/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-noir-950 font-bold rounded">
                        Model: {garment.brand}
                      </div>
                    </div>

                    {/* Draggable Divider Handle */}
                    <div
                      style={{ left: `${sliderPos}%` }}
                      className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none transform -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-white text-noir-950 flex items-center justify-center shadow-xl border border-black/20">
                        <Sliders className="w-3.5 h-3.5 text-noir-950 rotate-90" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SIDE-BY-SIDE DUAL VIEW */}
                {viewMode === 'sideBySide' && (
                  <div className="grid grid-cols-2 gap-3 w-full aspect-[3/4] max-h-[640px]">
                    <div className="relative rounded-xl overflow-hidden border border-white/20 bg-noir-900">
                      <img
                        src={baseUserPhoto}
                        alt="Original"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-3 left-3 bg-black/80 px-2.5 py-1 text-[9px] uppercase tracking-widest text-neutral-300 rounded">
                        Original Posture
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-luxe-gold/50 bg-noir-900">
                      <img
                        src={tryOnResult.tryOnImage}
                        alt="Model Fitting"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-3 right-3 bg-luxe-gold px-2.5 py-1 text-[9px] uppercase tracking-widest text-noir-950 font-bold rounded">
                        Runway Fitted
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. VOYAGE / VONAGE VIDEO API LIVE STREAM */}
                {viewMode === 'liveVideo' && (
                  <div className="relative w-full aspect-[3/4] max-h-[640px] bg-noir-900 border border-emerald-400/40 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                    {/* Live Hidden Video element used by provider */}
                    <video
                      ref={liveVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="hidden"
                    />

                    {/* Processed Live AR Canvas */}
                    <canvas
                      ref={liveCanvasRef}
                      className="w-full h-full object-cover"
                    />

                    {/* Top Stream Status HUD */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                      <div className="bg-black/85 backdrop-blur-md border border-emerald-400/30 px-3 py-1 rounded-lg flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          {isLiveStreaming ? 'VOYAGE VIDEO LIVE' : 'INITIALIZING'}
                        </span>
                      </div>
                      <div className="bg-black/85 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-lg text-[10px] font-mono text-neutral-300">
                        {videoStats.resolution} · {videoStats.fps} FPS · {videoStats.latencyMs}ms
                      </div>
                    </div>

                    {/* Live Stream Controls Overlay */}
                    <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                          className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/20 text-[10px] uppercase tracking-wider text-neutral-200 hover:text-white"
                        >
                          Flip Camera
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleCaptureFromLiveStream}
                        className="px-5 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-noir-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl"
                      >
                        <Camera className="w-4 h-4 text-noir-950" />
                        <span>Snap Model Pose</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* View instruction */}
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-3 mb-2">
                  {viewMode === 'runway' && 'Editorial Runway Model View · Click outfits below to try on instantly'}
                  {viewMode === 'slider' && 'Drag horizontal slider to compare original posture vs model fitting'}
                  {viewMode === 'sideBySide' && 'Direct dual comparison between user image and neural fitting'}
                  {viewMode === 'liveVideo' && 'Voyage / Vonage Video API Live Stream active · 1080p @ 30 FPS with real-time AR clothing'}
                </p>

                {/* Simulation Disclaimers */}
                <div className="w-full mt-2">
                  <SimulationDisclaimer />
                </div>
              </div>

              {/* PRODUCT DETAILS & BUY ACTIONS (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="glass-panel p-6 sm:p-7 border border-white/10 rounded-xl space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold font-bold">
                          {garment.brand}
                        </span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-black/60 border border-white/15 text-neutral-300">
                          {garment.budgetTier} tier
                        </span>
                      </div>
                      <span className="font-mono text-lg text-white font-bold">
                        ${garment.price.toFixed(2)}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
                      {garment.name}
                    </h2>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {garment.description}
                  </p>

                  {/* AI Drape & Fit Intelligence Notes */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-semibold">
                      AI Drape & Fit Intelligence:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-neutral-300">
                      {tryOnResult.stylingNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-luxe-gold shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sizing Available */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1.5">
                      Available Sizes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {garment.sizes.map((s) => (
                        <span
                          key={s}
                          className={`text-xs px-2.5 py-1 rounded border ${
                            s === quiz.size
                              ? 'border-luxe-gold bg-luxe-gold/20 text-white font-bold'
                              : 'border-white/10 text-neutral-300 bg-noir-900'
                          }`}
                        >
                          {s} {s === quiz.size && '(Your Size)'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PRIMARY ACTION BUTTONS */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <a
                      href={garment.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      <span>Purchase on {garment.brand}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={handleSave}
                      className={`w-full py-3 border text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        isCurrentSaved || savedSuccess
                          ? 'border-luxe-gold bg-luxe-gold/10 text-luxe-gold'
                          : 'border-white/20 hover:border-white/40 bg-noir-900 text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>
                        {savedSuccess
                          ? 'Look Saved to Wardrobe!'
                          : isCurrentSaved
                          ? 'Saved in Wardrobe'
                          : 'Save Look to Wardrobe'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Guardrails Info */}
                <div className="p-3.5 bg-noir-900/80 border border-white/10 rounded-lg text-[10px] text-neutral-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-luxe-gold font-semibold uppercase tracking-wider">
                    <Info className="w-3 h-3" />
                    <span>Neural Simulation Guardrails (NIST AI RMF):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                    {tryOnResult.uncertaintyFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* INSTANT MULTI-OUTFIT LOOKBOOK DOCK: SWITCH BETWEEN DIFFERENT OUTFITS */}
            <div className="glass-panel p-5 border border-white/15 rounded-xl shadow-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-luxe-gold" />
                  <span className="font-serif text-sm uppercase tracking-wider text-white">
                    Instant Multi-Outfit Switcher
                  </span>
                  {isTransitioningOutfit ? (
                    <span className="text-[10px] text-luxe-gold font-mono animate-pulse">
                      Draping new silhouette...
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-400">
                      (Click any outfit to preview how it looks on your model)
                    </span>
                  )}
                </div>

                {/* Brand Filter */}
                <div className="flex items-center gap-1">
                  {(['all', 'Zara', 'Calvin Klein', 'Michael Kors'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBrandFilter(b)}
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded border transition-all ${
                        selectedBrandFilter === b
                          ? 'border-luxe-gold bg-luxe-gold/20 text-white font-bold'
                          : 'border-white/10 text-neutral-400 hover:text-white bg-noir-900'
                      }`}
                    >
                      {b === 'all' ? 'All Brands' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Outfit Thumbnails Carousel */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {filteredOutfits.map((item) => {
                  const isActive = item.id === garment.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSwitchOutfit(item)}
                      className={`shrink-0 w-32 p-2 rounded-lg border text-left transition-all group ${
                        isActive
                          ? 'border-luxe-gold bg-luxe-gold/15 shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-luxe-gold'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/80'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full rounded overflow-hidden mb-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isActive && (
                          <div className="absolute top-1 right-1 bg-luxe-gold text-noir-950 p-1 rounded-full">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-neutral-300 rounded">
                          {item.brand}
                        </span>
                      </div>
                      <p className="text-[11px] text-white font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-luxe-gold font-mono">${item.price}</span>
                        <span className="text-[8px] uppercase text-neutral-400">{item.budgetTier}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
