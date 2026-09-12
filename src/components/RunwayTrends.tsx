import React from 'react';
import { TrendingUp, ArrowUpRight, Palette } from 'lucide-react';
import { TrendItem } from '../types/fashion';

interface RunwayTrendsProps {
  trends: TrendItem[];
  onSelectTrendPiece: (trendTitle: string) => void;
}

export const RunwayTrends: React.FC<RunwayTrendsProps> = ({
  trends,
  onSelectTrendPiece
}) => {
  return (
    <section id="trends" className="w-full py-24 bg-noir-950 text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-luxe-gold/30 bg-noir-900 rounded-full text-[10px] tracking-[0.3em] uppercase text-luxe-gold">
              <TrendingUp className="w-3 h-3 text-luxe-gold" />
              <span>Couture Radar · Season 2026/2027</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-widest uppercase text-white font-normal">
              Runway Trends
            </h2>
          </div>
          <p className="text-xs text-neutral-400 tracking-[0.2em] uppercase max-w-md leading-relaxed">
            The defining silhouettes, textiles, and chromatic statements dominating international fashion houses this season.
          </p>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="glass-panel group overflow-hidden border border-white/10 hover:border-luxe-gold/40 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image & Season Badge */}
              <div className="relative aspect-[3/4] overflow-hidden bg-noir-900">
                <img
                  src={trend.imageUrl}
                  alt={trend.title}
                  className="w-full h-full object-cover object-center filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent opacity-90" />
                
                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-white">
                    {trend.season}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-luxe-gold/90 text-black font-semibold">
                    {trend.tag}
                  </span>
                </div>

                {/* Runway origin tag at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-mono">
                    {trend.runwayReference}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-base text-white group-hover:text-luxe-champagne transition-colors mb-2">
                    {trend.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3">
                    {trend.description}
                  </p>
                </div>

                {/* Palette Swatches */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-luxe-gold" />
                      <span>Palette</span>
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono">3 Shades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {trend.palette.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-1.5" title={`${p.name} (${p.hex})`}>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="text-[8px] text-neutral-400 truncate max-w-[65px] hidden xl:inline">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Elements tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {trend.keyElements.map((el, i) => (
                    <span
                      key={i}
                      className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-noir-900 border border-white/5 text-neutral-400"
                    >
                      {el}
                    </span>
                  ))}
                </div>

                {/* Explore Action */}
                <button
                  onClick={() => onSelectTrendPiece(trend.title)}
                  className="w-full mt-2 py-2 text-[10px] uppercase tracking-widest border border-white/10 group-hover:border-luxe-gold hover:bg-luxe-gold hover:text-black transition-all flex items-center justify-center gap-1.5 text-neutral-300"
                >
                  <span>Explore Trend in Try-On</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
