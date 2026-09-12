import React, { useState } from 'react';
import { Newspaper, ExternalLink, ArrowRight, Clock, User, Filter } from 'lucide-react';
import { VogueArticle } from '../types/fashion';

interface VogueNewsProps {
  articles: VogueArticle[];
  onOpenArticle: (article: VogueArticle) => void;
}

export const VogueNews: React.FC<VogueNewsProps> = ({ articles, onOpenArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Runway', 'Celebrity', 'Trends', 'Culture'];

  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="vogue" className="w-full py-24 bg-noir-950 text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-white/15 bg-noir-900 rounded-full text-[10px] tracking-[0.3em] uppercase text-neutral-300">
              <Newspaper className="w-3 h-3 text-luxe-gold" />
              <span>Editorial Journal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-widest uppercase text-white font-normal flex items-center gap-3">
              <span>VOGUE</span>
              <span className="text-neutral-500 font-sans text-xl font-light tracking-normal">/</span>
              <span className="text-xl sm:text-2xl text-luxe-champagne font-sans font-light tracking-widest">
                LATEST FASHION DISPATCH
              </span>
            </h2>
          </div>

          {/* Direct link to Vogue.com */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="https://www.vogue.com/fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-luxe-gold transition-colors py-2 px-4 border border-white/10 hover:border-luxe-gold/50 bg-noir-900/60"
            >
              <span>Explore Vogue.com/Fashion</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider transition-all shrink-0 border ${
                selectedCategory === cat
                  ? 'border-luxe-gold bg-luxe-gold/10 text-white font-medium'
                  : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30 bg-noir-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onOpenArticle(article)}
              className="glass-panel group overflow-hidden border border-white/10 hover:border-luxe-gold/40 transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-noir-900">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent opacity-80" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] uppercase tracking-widest px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-white font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Text Card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-neutral-500 mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-luxe-gold" />
                      <span>{article.author}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg text-white group-hover:text-luxe-champagne transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                {/* Read Link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-300 group-hover:text-luxe-gold transition-colors">
                  <span>Read Full Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
