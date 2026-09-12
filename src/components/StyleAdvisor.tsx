import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  Shirt,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Garment, RecommendationResult, StyleQuestionnaire } from '../types/fashion';

interface StyleAdvisorProps {
  garments: Garment[];
  onApplyRecommendationToTryOn: (garment: Garment) => void;
}

const DEFAULT_QUESTIONNAIRE: StyleQuestionnaire = {
  archetype: 'Le Smoking Tailored Noir',
  occasion: 'Paris Fashion Week Runway Vernissage',
  silhouette: 'Sharp Architectural Tailoring',
  colorPalette: 'Obsidian Noir & Duchess Silk Satin',
  customNotes: ''
};

export const StyleAdvisor: React.FC<StyleAdvisorProps> = ({
  garments,
  onApplyRecommendationToTryOn
}) => {
  const [formData, setFormData] = useState<StyleQuestionnaire>(DEFAULT_QUESTIONNAIRE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const archetypeOptions = [
    'Le Smoking Tailored Noir',
    'Midnight Chiffon & Fluid Gown',
    'Oversized Leather & Trench Architecture',
    'Parisian Bohemian & Lavallière',
    'Cyber Quiet Luxury & Velvet'
  ];

  const occasionOptions = [
    'Paris Fashion Week Runway Vernissage',
    'Black Tie Gala / Red Carpet Premiere',
    'Private Midnight Rooftop Soirée',
    'Contemporary Art Biennial Opening',
    'Intimate Dining at L\'Ambroisie Paris'
  ];

  const silhouetteOptions = [
    'Sharp Architectural Tailoring',
    'Liquid Fluid & Draped',
    'Voluminous Oversized & Imposing',
    'Sculptural Hourglass Contoured'
  ];

  const paletteOptions = [
    'Obsidian Noir & Duchess Silk Satin',
    'Smoked Suede & Rich Espresso',
    'Velvet Chiffon & Gunmetal Chrome',
    'High-Gloss Glazed Calfskin'
  ];

  const samplePrompts = [
    'Le Smoking with sheer bow blouse for an art vernissage',
    'Dramatic floor-sweeping noir gown for Venice red carpet',
    'Glazed leather trench coat for midnight downtown Paris'
  ];

  const handleQuickPrompt = (promptText: string) => {
    setFormData((prev) => ({
      ...prev,
      customNotes: promptText
    }));
  };

  const handleGenerateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // Intelligently pick matched hero piece based on archetype or custom notes
      let matchedGarment: Garment;
      const combinedQuery = `${formData.archetype} ${formData.silhouette} ${formData.customNotes}`.toLowerCase();

      if (combinedQuery.includes('gown') || combinedQuery.includes('dress') || combinedQuery.includes('chiffon')) {
        matchedGarment = garments.find((g) => g.id === 'garment-2') || garments[1];
      } else if (combinedQuery.includes('leather') || combinedQuery.includes('trench')) {
        matchedGarment = garments.find((g) => g.id === 'garment-3') || garments[2];
      } else if (combinedQuery.includes('blouse') || combinedQuery.includes('lavallière') || combinedQuery.includes('bow')) {
        matchedGarment = garments.find((g) => g.id === 'garment-4') || garments[3];
      } else if (combinedQuery.includes('suede')) {
        matchedGarment = garments.find((g) => g.id === 'garment-5') || garments[4];
      } else {
        matchedGarment = garments.find((g) => g.id === 'garment-1') || garments[0];
      }

      const newRec: RecommendationResult = {
        id: `rec-${Date.now()}`,
        collectionName: `NOCTURNE EDITORIAL: ${formData.archetype.toUpperCase()}`,
        styleVerdict: `For ${formData.occasion}, a juxtaposition of ${formData.colorPalette.toLowerCase()} with a ${formData.silhouette.toLowerCase()} provides an aura of commanding, understated Parisian mystery.`,
        heroPiece: matchedGarment,
        pairingNotes: [
          'Unbuttoned collar line to lengthen the throat and display architectural collarbones',
          'Tonal texture friction: matte wool juxtaposed against high-gloss satin accents',
          'Minimal hardware in brushed gunmetal to maintain chromatic purity'
        ],
        shoes: 'Cassandre 110mm Pointed Patent Stiletto Booties',
        accessories: [
          'Chunky sculpted silver ear cuffs',
          'Smoked acetate rectangular sunglasses',
          'Micro leather envelope clutch in grain de poudre'
        ],
        fragrance: 'YSL Libre L\'Absolu Platine (Lavender, White Orange Blossom & Ambergris)',
        curatorInsight: `In alignment with Vogue's Autumn Runway analysis, monochromatic discipline combined with structural shoulders commands effortless authority. ${
          formData.customNotes ? `Your personal note ("${formData.customNotes}") has been synthesized into the fluid drape architecture.` : ''
        }`,
        vogueTrendAffiliation: 'The Neo-Smoking & Architectural Noir Movement',
        matchScore: 98
      };

      setRecommendation(newRec);
      setIsGenerating(false);
    }, 900);
  };

  const handleSendToTryOn = () => {
    if (recommendation) {
      onApplyRecommendationToTryOn(recommendation.heroPiece);
      const tryOnEl = document.getElementById('tryon');
      tryOnEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="advisor" className="w-full py-24 bg-noir-900/60 text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-luxe-gold/30 bg-noir-950/80 rounded-full text-[10px] tracking-[0.3em] uppercase text-luxe-gold">
            <Compass className="w-3 h-3 text-luxe-gold" />
            <span>Haute Couture AI Consultant</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-widest uppercase mb-4 text-white font-normal">
            Bespoke Style Advisor
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 tracking-[0.2em] uppercase max-w-xl mx-auto leading-relaxed">
            Answer our couture questionnaire or describe your aesthetic vision to generate a curated runway ensemble.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Questionnaire Form (6 cols) */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-luxe-gold" />
                <span>Couture Questionnaire</span>
              </h3>
              <button
                type="button"
                onClick={() => setFormData(DEFAULT_QUESTIONNAIRE)}
                className="text-[9px] uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handleGenerateRecommendation} className="space-y-5">
              {/* Question 1: Style Archetype */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-300 mb-2">
                  1. Style Archetype & Persona
                </label>
                <select
                  value={formData.archetype}
                  onChange={(e) => setFormData({ ...formData, archetype: e.target.value })}
                  className="w-full bg-noir-950/90 border border-white/15 focus:border-luxe-gold text-xs text-white px-3.5 py-3 outline-none transition-colors"
                >
                  {archetypeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-noir-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question 2: Occasion */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-300 mb-2">
                  2. Evening Occasion / Setting
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="w-full bg-noir-950/90 border border-white/15 focus:border-luxe-gold text-xs text-white px-3.5 py-3 outline-none transition-colors"
                >
                  {occasionOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-noir-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question 3: Silhouette & Cut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-300 mb-2">
                    3. Silhouette
                  </label>
                  <select
                    value={formData.silhouette}
                    onChange={(e) => setFormData({ ...formData, silhouette: e.target.value })}
                    className="w-full bg-noir-950/90 border border-white/15 focus:border-luxe-gold text-xs text-white px-3.5 py-3 outline-none transition-colors"
                  >
                    {silhouetteOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-noir-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question 4: Palette & Material */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-300 mb-2">
                    4. Palette & Texture
                  </label>
                  <select
                    value={formData.colorPalette}
                    onChange={(e) => setFormData({ ...formData, colorPalette: e.target.value })}
                    className="w-full bg-noir-950/90 border border-white/15 focus:border-luxe-gold text-xs text-white px-3.5 py-3 outline-none transition-colors"
                  >
                    {paletteOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-noir-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question 5: Bespoke Custom Text Prompt */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-300 mb-2 flex items-center justify-between">
                  <span>5. Custom Styling Notes (Text Prompt)</span>
                  <span className="text-[9px] text-luxe-gold lowercase font-mono">optional bespoke details</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.customNotes}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="e.g. Looking for an edgy tailored tuxedo with satin lapels and pointed heels for a gallery opening in Paris..."
                  className="w-full bg-noir-950/90 border border-white/15 focus:border-luxe-gold text-xs text-white p-3.5 outline-none transition-colors resize-none placeholder:text-neutral-600"
                />

                {/* Quick Prompts Suggestions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 mr-1">Inspirations:</span>
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickPrompt(p)}
                      className="text-[9px] tracking-wider px-2 py-1 bg-noir-950 border border-white/10 hover:border-luxe-gold/50 text-neutral-400 hover:text-white transition-colors"
                    >
                      {p.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-white hover:bg-luxe-champagne text-black text-xs font-semibold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Runway Look...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate Tailored Recommendation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: AI Recommendation Output Card (6 cols) */}
          <div className="lg:col-span-6">
            {recommendation ? (
              <div className="glass-panel p-6 sm:p-8 border border-luxe-gold/30 bg-noir-950/80 space-y-6 shadow-2xl relative overflow-hidden">
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxe-gold to-transparent" />

                {/* Recommendation Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-luxe-gold font-semibold">
                      Curated Recommendation
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium mt-1">
                      {recommendation.collectionName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-luxe-gold/10 border border-luxe-gold/30 text-luxe-gold text-[10px] tracking-wider uppercase font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{recommendation.matchScore}% Match</span>
                  </div>
                </div>

                {/* Style Verdict */}
                <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-luxe-gold pl-3">
                  "{recommendation.styleVerdict}"
                </p>

                {/* Hero Piece Preview Box */}
                <div className="p-4 bg-noir-900 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={recommendation.heroPiece.imageUrl}
                    alt={recommendation.heroPiece.name}
                    className="w-24 h-32 object-cover object-center border border-white/10 shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-luxe-gold">Recommended Hero Piece</span>
                    <h4 className="font-serif text-sm font-medium text-white mt-0.5">
                      {recommendation.heroPiece.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                      {recommendation.heroPiece.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs font-serif text-luxe-champagne">{recommendation.heroPiece.price}</span>
                      <button
                        onClick={handleSendToTryOn}
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white hover:text-luxe-gold font-semibold underline"
                      >
                        <Shirt className="w-3 h-3" />
                        <span>Send to Virtual Try-On</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Styling Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-neutral-300">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">Footwear Pairing</span>
                    <p className="font-medium text-white">{recommendation.shoes}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">Olfactory Signature</span>
                    <p className="font-medium text-white">{recommendation.fragrance}</p>
                  </div>
                </div>

                {/* Curated Accessories */}
                <div className="pt-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2">
                    Harmonized Accessories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.accessories.map((acc, i) => (
                      <span
                        key={i}
                        className="text-[10px] tracking-wider px-2.5 py-1 bg-noir-900 border border-white/10 text-neutral-300"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleSendToTryOn}
                    className="w-full py-3.5 px-4 bg-white hover:bg-luxe-gold text-black text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Try On This Complete Look in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state placeholder before first run */
              <div className="glass-panel p-12 border border-white/10 text-center flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-noir-900/50">
                  <Sparkles className="w-6 h-6 text-luxe-gold" />
                </div>
                <h4 className="font-serif text-base uppercase tracking-widest text-white mb-2">
                  Awaiting Atelier Input
                </h4>
                <p className="text-xs text-neutral-400 tracking-wider max-w-sm leading-relaxed mb-6">
                  Select your desired archetype and occasion on the left to generate an intelligent runway styling consultation.
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-neutral-500 border border-white/5 px-3 py-1.5 bg-black/40">
                  <span>Powered by Atelier AI Heuristics</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
