import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Layers,
  Sliders,
  Check,
  Bookmark,
  RefreshCw,
  Sun,
  Moon,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Garment, ModelPreset } from '../types/fashion';

interface TryOnStudioProps {
  garments: Garment[];
  models: ModelPreset[];
  selectedGarment: Garment;
  onSelectGarment: (garment: Garment) => void;
  onSaveLook: (garment: Garment, model: ModelPreset) => void;
  isLookSaved: boolean;
}

export const TryOnStudio: React.FC<TryOnStudioProps> = ({
  garments,
  models,
  selectedGarment,
  onSelectGarment,
  onSaveLook,
  isLookSaved
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(models[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lightingPreset, setLightingPreset] = useState<'runway' | 'nocturne' | 'warm'>('runway');
  const [drapeTension, setDrapeTension] = useState<number>(85);
  const [customUserPhoto, setCustomUserPhoto] = useState<string | null>(null);
  const [customGarmentPhoto, setCustomGarmentPhoto] = useState<string | null>(null);
  const [isSimulatingFitting, setIsSimulatingFitting] = useState<boolean>(false);
  const [fitScore, setFitScore] = useState<number>(97);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputModelRef = useRef<HTMLInputElement>(null);
  const fileInputGarmentRef = useRef<HTMLInputElement>(null);

  // Trigger fitting simulation effect whenever garment or model changes
  useEffect(() => {
    setIsSimulatingFitting(true);
    const score = Math.floor(92 + Math.random() * 7);
    setFitScore(score);
    const timer = setTimeout(() => {
      setIsSimulatingFitting(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedGarment.id, selectedModel.id, customUserPhoto, customGarmentPhoto]);

  // Handle Dragging Before/After Slider
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomUserPhoto(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomGarmentPhoto(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAction = () => {
    onSaveLook(selectedGarment, selectedModel);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  // Lighting classes based on preset
  const getLightingFilter = () => {
    switch (lightingPreset) {
      case 'nocturne':
        return 'brightness-90 contrast-125 saturate-75 hue-rotate-15';
      case 'warm':
        return 'brightness-105 contrast-110 sepia-[0.15] saturate-110';
      case 'runway':
      default:
        return 'brightness-100 contrast-115 saturate-100';
    }
  };

  const activeModelImage = customUserPhoto || selectedModel.imageUrl;
  const activeGarmentImage = customGarmentPhoto || selectedGarment.imageUrl;

  return (
    <section id="tryon" className="w-full py-24 bg-noir-950 text-white relative overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-luxe-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-luxe-gold/30 bg-noir-900/80 rounded-full text-[10px] tracking-[0.3em] uppercase text-luxe-gold">
            <Sparkles className="w-3 h-3 text-luxe-gold" />
            <span>Virtual Fitting Atelier</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-widest uppercase mb-4 text-white font-normal">
            AI Virtual Try-On
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 tracking-[0.2em] uppercase max-w-xl mx-auto leading-relaxed">
            Experience photorealistic silhouette draping and neural fabric simulation in real time.
          </p>
        </div>

        {/* Studio Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Garment Selection Atelier (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-luxe-gold" />
                  <span>1. Select Haute Piece</span>
                </h3>
                <span className="text-[10px] tracking-wider text-neutral-400">{garments.length} Pieces</span>
              </div>

              {/* Garments Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {garments.map((g) => {
                  const isSelected = g.id === selectedGarment.id && !customGarmentPhoto;
                  return (
                    <button
                      key={g.id}
                      onClick={() => {
                        setCustomGarmentPhoto(null);
                        onSelectGarment(g);
                      }}
                      className={`group relative text-left p-2 border transition-all duration-300 ${
                        isSelected
                          ? 'border-luxe-gold bg-luxe-gold/10'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/60'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-noir-800 mb-2 relative">
                        <img
                          src={g.imageUrl}
                          alt={g.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-luxe-gold text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] tracking-wider font-medium text-white truncate">{g.name}</p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 mt-0.5">
                        <span>{g.category}</span>
                        <span className="text-luxe-champagne">{g.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Garment Upload */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <input
                  type="file"
                  ref={fileInputGarmentRef}
                  onChange={handleCustomGarmentUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputGarmentRef.current?.click()}
                  className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-luxe-gold text-[10px] tracking-widest uppercase text-neutral-300 hover:text-white bg-noir-900/40 hover:bg-noir-900/90 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-luxe-gold" />
                  <span>{customGarmentPhoto ? 'Custom Piece Active (Replace)' : 'Upload Custom Clothing'}</span>
                </button>
              </div>
            </div>

            {/* Garment Details Card */}
            <div className="glass-panel p-6 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-luxe-gold">Selected Silhouette</span>
                  <h4 className="font-serif text-sm text-white font-medium mt-0.5">
                    {customGarmentPhoto ? 'Custom Bespoke Upload' : selectedGarment.name}
                  </h4>
                </div>
                <span className="text-xs font-serif text-white">
                  {customGarmentPhoto ? 'Bespoke' : selectedGarment.price}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
                {customGarmentPhoto
                  ? 'Custom garment uploaded by user. AI neural engine automatically segments texture, seam topology, and drape geometry.'
                  : selectedGarment.description}
              </p>
              <div className="space-y-1.5 text-[10px] text-neutral-300 border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Material Composition:</span>
                  <span className="font-medium text-right text-neutral-200">
                    {customGarmentPhoto ? 'Custom Textile' : selectedGarment.material}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fit Architecture:</span>
                  <span className="font-medium text-right text-luxe-gold">
                    {customGarmentPhoto ? 'User Specified' : selectedGarment.silhouette}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Interactive Virtual Try-On Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Live Visualizer Stage */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[3/4] max-h-[640px] bg-noir-900 border border-white/20 select-none overflow-hidden group shadow-2xl cursor-ew-resize"
            >
              {/* Fitting Simulator Loading Pulse */}
              {isSimulatingFitting && (
                <div className="absolute inset-0 z-30 bg-noir-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                  <div className="relative w-12 h-12">
                    <span className="absolute inset-0 rounded-full border-2 border-luxe-gold border-t-transparent animate-spin" />
                    <Sparkles className="w-5 h-5 text-luxe-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-300">
                    Synthesizing Silhouette & Drape...
                  </span>
                </div>
              )}

              {/* Layer A: Base Model (Original / Naked Baseline) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={activeModelImage}
                  alt="Original Model"
                  className={`w-full h-full object-cover object-top transition-all duration-300 ${getLightingFilter()}`}
                />
                <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-widest text-neutral-400 border border-white/10">
                  Model Baseline
                </div>
              </div>

              {/* Layer B: Styled Virtual Try-On Result (Clipped via Slider) */}
              <div
                style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                className="absolute inset-0 w-full h-full z-10 overflow-hidden"
              >
                {/* Simulated Try-on Layer combining Model and Garment */}
                <div className="relative w-full h-full">
                  <img
                    src={activeGarmentImage}
                    alt="Styled Look"
                    className={`w-full h-full object-cover object-top filter contrast-110 brightness-95 ${getLightingFilter()}`}
                  />
                  {/* High fashion studio vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-noir-950/30" />
                </div>
                <div className="absolute bottom-4 right-4 z-10 bg-luxe-gold/90 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-widest text-noir-950 font-bold">
                  Virtual Try-On Output
                </div>
              </div>

              {/* Draggable Divider Line & Handle */}
              <div
                style={{ left: `${sliderPosition}%` }}
                className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none transform -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl border border-black/20">
                  <Sliders className="w-3.5 h-3.5 text-black rotate-90" />
                </div>
              </div>

              {/* Top Bar on Stage: AI Fit Score */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[10px] tracking-widest text-luxe-gold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-luxe-gold" />
                  <span>AI Fit Confidence: {fitScore}%</span>
                </div>
                <div className="bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[9px] tracking-wider text-neutral-300">
                  Drag slider to compare
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Under Stage */}
            <div className="w-full mt-4 flex items-center justify-between gap-3">
              <button
                onClick={handleSaveAction}
                className={`flex-1 py-3 px-4 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 border ${
                  isLookSaved || savedNotification
                    ? 'border-luxe-gold bg-luxe-gold text-noir-950'
                    : 'border-white/20 hover:border-luxe-gold bg-noir-900/80 hover:bg-luxe-gold/10 text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedNotification ? 'Look Saved to Wardrobe!' : isLookSaved ? 'Saved in Wardrobe' : 'Save This Look'}</span>
              </button>

              <button
                onClick={() => {
                  // Reset slider to center
                  setSliderPosition(50);
                }}
                title="Reset Slider"
                className="p-3 border border-white/20 hover:border-white/40 bg-noir-900/80 text-neutral-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Model & Studio Lighting Controls (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Model Selection */}
            <div className="glass-panel p-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-white flex items-center gap-2">
                  <span>2. Runway Model</span>
                </h3>
              </div>

              {/* Models List */}
              <div className="space-y-2 mb-4">
                {models.map((m) => {
                  const isSelected = m.id === selectedModel.id && !customUserPhoto;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCustomUserPhoto(null);
                        setSelectedModel(m);
                      }}
                      className={`w-full flex items-center gap-3 p-2 text-left border transition-all ${
                        isSelected
                          ? 'border-luxe-gold bg-luxe-gold/10'
                          : 'border-white/10 hover:border-white/30 bg-noir-900/40'
                      }`}
                    >
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-10 h-10 object-cover object-top border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-white truncate">{m.name}</p>
                        <p className="text-[9px] text-neutral-400 truncate">{m.title}</p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-luxe-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Upload User Photo */}
              <input
                type="file"
                ref={fileInputModelRef}
                onChange={handleCustomPhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputModelRef.current?.click()}
                className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-luxe-gold text-[10px] tracking-widest uppercase text-neutral-300 hover:text-white bg-noir-900/40 hover:bg-noir-900/90 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-luxe-gold" />
                <span>{customUserPhoto ? 'Custom Photo Active (Replace)' : 'Upload Your Photo'}</span>
              </button>
            </div>

            {/* Lighting & Environment Controls */}
            <div className="glass-panel p-6 border border-white/10">
              <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-white mb-3">
                3. Runway Atmosphere
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <button
                  onClick={() => setLightingPreset('runway')}
                  className={`py-2 px-1 text-[9px] tracking-wider uppercase border flex flex-col items-center gap-1.5 transition-all ${
                    lightingPreset === 'runway'
                      ? 'border-luxe-gold bg-luxe-gold/10 text-white font-semibold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-luxe-gold" />
                  <span>Runway</span>
                </button>

                <button
                  onClick={() => setLightingPreset('nocturne')}
                  className={`py-2 px-1 text-[9px] tracking-wider uppercase border flex flex-col items-center gap-1.5 transition-all ${
                    lightingPreset === 'nocturne'
                      ? 'border-luxe-gold bg-luxe-gold/10 text-white font-semibold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-luxe-silver" />
                  <span>Nocturne</span>
                </button>

                <button
                  onClick={() => setLightingPreset('warm')}
                  className={`py-2 px-1 text-[9px] tracking-wider uppercase border flex flex-col items-center gap-1.5 transition-all ${
                    lightingPreset === 'warm'
                      ? 'border-luxe-gold bg-luxe-gold/10 text-white font-semibold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-luxe-champagne" />
                  <span>Studio</span>
                </button>
              </div>

              {/* Drape Simulation Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-neutral-400">
                  <span>Fabric Drape Tension</span>
                  <span className="text-white font-mono">{drapeTension}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={drapeTension}
                  onChange={(e) => setDrapeTension(Number(e.target.value))}
                  className="w-full accent-luxe-gold bg-noir-800 h-1 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-neutral-500 uppercase tracking-widest">
                  <span>Fluid / Soft</span>
                  <span>Structured / Padded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
