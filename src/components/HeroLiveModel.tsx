import React, { useState } from 'react';
import { Sparkles, ArrowDown, ChevronRight, Tag } from 'lucide-react';
import { Garment } from '../types/fashion';

interface HeroLiveModelProps {
  garments: Garment[];
  onSelectGarmentForTryOn: (garment: Garment) => void;
  onExploreAdvisor: () => void;
}

interface HeroScene {
  id: string;
  name: string;
  season: string;
  collection: string;
  videoUrl?: string;
  posterUrl: string;
  modelName: string;
  spotlights: {
    garmentId: string;
    label: string;
    price: string;
    x: number; // percentage
    y: number; // percentage
    category: string;
  }[];
}

const HERO_SCENES: HeroScene[] = [
  {
    id: 'scene-runway-noir',
    name: 'Paris Trocadéro Runway',
    season: 'WINTER NOCTURNE 2026',
    collection: 'LE SMOKING & SILK REIMAGINED',
    posterUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90',
    modelName: 'Anouk V. · Look 01',
    spotlights: [
      {
        garmentId: 'garment-1',
        label: 'Le Smoking Grain de Poudre Jacket',
        price: '$3,890',
        x: 48,
        y: 35,
        category: 'Tailoring'
      },
      {
        garmentId: 'garment-4',
        label: 'Lavallière Sheer Silk Blouse',
        price: '$1,950',
        x: 52,
        y: 28,
        category: 'Silk Mousseline'
      },
      {
        garmentId: 'garment-6',
        label: 'Velvet Flaneur High-Waist Trousers',
        price: '$2,150',
        x: 49,
        y: 68,
        category: 'Bottoms'
      }
    ]
  },
  {
    id: 'scene-chiffon-drape',
    name: 'Palais Royal Studio',
    season: 'HAUTE COUTURE EXCLUSIVE',
    collection: 'TRANSLUCENT SILHOUETTES',
    posterUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=90',
    modelName: 'Solange M. · Look 04',
    spotlights: [
      {
        garmentId: 'garment-2',
        label: 'Backless Draped Silk Mousseline Gown',
        price: '$5,200',
        x: 50,
        y: 48,
        category: 'Couture Evening'
      },
      {
        garmentId: 'garment-7',
        label: 'Cassandre Pointed Stiletto Booties',
        price: '$1,850',
        x: 50,
        y: 88,
        category: 'Footwear'
      }
    ]
  },
  {
    id: 'scene-leather-trench',
    name: 'Pont Alexandre III Nocturne',
    season: 'FALL/WINTER RUNWAY',
    collection: 'GLAZED CALFSKIN ARCHITECTURE',
    posterUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1600&q=90',
    modelName: 'Soren K. · Look 09',
    spotlights: [
      {
        garmentId: 'garment-3',
        label: 'Double-Breasted Sculptural Leather Trench',
        price: '$6,900',
        x: 50,
        y: 42,
        category: 'Outerwear'
      }
    ]
  }
];

export const HeroLiveModel: React.FC<HeroLiveModelProps> = ({
  garments,
  onSelectGarmentForTryOn,
  onExploreAdvisor
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeSpotlight, setActiveSpotlight] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);

  const scene = HERO_SCENES[activeSceneIndex];

  const handleHotspotClick = (garmentId: string) => {
    const matchedGarment = garments.find((g) => g.id === garmentId);
    if (matchedGarment) {
      onSelectGarmentForTryOn(matchedGarment);
      // Smooth scroll to try on studio
      const tryOnEl = document.getElementById('tryon');
      tryOnEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen bg-noir-950 flex flex-col justify-between overflow-hidden pt-20">
      {/* Background Visual Layer with Vignette and Cinematic Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={scene.posterUrl}
          alt={scene.name}
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] transition-all duration-1000 transform scale-100 group-hover:scale-105"
        />
        {/* Deep YSL Noir Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/40 to-noir-950/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-noir-950/50 to-noir-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />
      </div>

      {/* Live Model Interactive Hotspots Overlay */}
      {showHotspots && (
        <div className="absolute inset-0 z-10 pointer-events-none max-w-4xl mx-auto">
          {scene.spotlights.map((spot) => {
            const isHovered = activeSpotlight === spot.garmentId;
            return (
              <div
                key={spot.garmentId}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/spot"
              >
                {/* Pulsing Target Marker */}
                <button
                  onClick={() => handleHotspotClick(spot.garmentId)}
                  onMouseEnter={() => setActiveSpotlight(spot.garmentId)}
                  onMouseLeave={() => setActiveSpotlight(null)}
                  className="relative flex items-center justify-center p-2 group focus:outline-none"
                  aria-label={`Inspect ${spot.label}`}
                >
                  <span className="absolute w-7 h-7 rounded-full bg-white/20 animate-ping" />
                  <span className="relative w-3.5 h-3.5 rounded-full bg-white border border-black shadow-lg flex items-center justify-center group-hover:bg-luxe-gold group-hover:scale-125 transition-all">
                    <span className="w-1 h-1 rounded-full bg-black" />
                  </span>
                </button>

                {/* Floating Product Tag Card */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3.5 bg-noir-900/95 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 pointer-events-auto ${
                    isHovered ? 'opacity-100 translate-y-0 scale-100 z-30' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                    <span>{spot.category}</span>
                    <span className="text-luxe-gold font-semibold">{spot.price}</span>
                  </div>
                  <h4 className="text-xs font-serif font-medium text-white line-clamp-1 mb-2">
                    {spot.label}
                  </h4>
                  <button
                    onClick={() => handleHotspotClick(spot.garmentId)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[9px] uppercase tracking-widest bg-white hover:bg-luxe-gold text-black font-semibold transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Try On Live Model</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-white font-medium">LIVE RUNWAY STAGE</span>
          <span className="text-neutral-500 hidden sm:inline">· {scene.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Tag className="w-3 h-3 text-luxe-gold" />
            <span>{showHotspots ? 'Hide Tags' : 'Show Garment Tags'}</span>
          </button>
          <span className="text-neutral-500">{scene.modelName}</span>
        </div>
      </div>

      {/* Center Grand Typography & Live Hero Presentation */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center my-auto py-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/15 bg-black/40 backdrop-blur-md rounded-full text-[10px] tracking-[0.3em] uppercase text-neutral-300">
          <Sparkles className="w-3 h-3 text-luxe-gold" />
          <span>{scene.season}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-widest font-normal text-white uppercase leading-none mb-6">
          ATELIER NOIR
        </h1>

        <p className="font-sans text-xs sm:text-sm tracking-[0.35em] text-neutral-300 uppercase max-w-2xl mx-auto mb-10 leading-relaxed">
          {scene.collection} · VIRTUAL TRY-ON & COUTURE INTELLIGENCE
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#tryon"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-luxe-champagne text-black text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Enter Virtual Fitting</span>
          </a>

          <button
            onClick={onExploreAdvisor}
            className="w-full sm:w-auto px-8 py-4 bg-noir-900/80 hover:bg-noir-800 text-white border border-white/20 hover:border-luxe-gold text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span>Curate My Style</span>
            <ChevronRight className="w-4 h-4 text-luxe-gold" />
          </button>
        </div>
      </div>

      {/* Bottom Runway Scene Switcher & Scroll Cue */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
        {/* Runway Stage Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-2 shrink-0">
            Select Runway View:
          </span>
          {HERO_SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setActiveSpotlight(null);
              }}
              className={`px-3 py-1.5 text-[10px] tracking-wider uppercase transition-all shrink-0 border ${
                activeSceneIndex === idx
                  ? 'border-luxe-gold bg-luxe-gold/10 text-white font-medium'
                  : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white bg-black/40'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Scroll down indicator */}
        <a
          href="#tryon"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-luxe-gold transition-colors"
        >
          <span>Explore Fitting & Trends</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
