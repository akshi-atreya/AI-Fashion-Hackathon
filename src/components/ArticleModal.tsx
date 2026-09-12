import React, { useEffect } from 'react';
import { X, ExternalLink, Clock, Calendar, User } from 'lucide-react';
import { VogueArticle } from '../types/fashion';

interface ArticleModalProps {
  article: VogueArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-noir-950 border border-white/20 shadow-2xl overflow-y-auto rounded-none text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-noir-950/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black tracking-widest text-white text-base">VOGUE</span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">/ FASHION DISPATCH</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-luxe-gold hover:text-white transition-colors"
            >
              <span>Vogue.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-noir-900 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest bg-luxe-gold text-noir-950 font-bold">
              {article.category}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 bg-black/60 px-2 py-1">
              Source: Vogue Editorial
            </span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="px-6 sm:px-10 py-8 space-y-6">
          {/* Metadata Byline */}
          <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-4">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-luxe-gold" />
              <span>{article.author}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-500" />
              <span>{article.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans tracking-wide leading-relaxed italic">
              {article.subtitle}
            </p>
          </div>

          {/* Key Pull Quote */}
          {article.keyQuotes && article.keyQuotes.length > 0 && (
            <div className="my-6 p-6 border-y border-luxe-gold/30 bg-noir-900/50 text-center">
              <blockquote className="font-serif text-base sm:text-lg text-luxe-champagne italic">
                {article.keyQuotes[0]}
              </blockquote>
            </div>
          )}

          {/* Full Content Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed tracking-wide">
            {article.fullContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Direct External Link Section */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs text-white font-medium">Continue Reading on Vogue</p>
              <p className="text-[10px] text-neutral-400">
                Access full slideshows, video commentary, and archival coverage.
              </p>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-luxe-champagne text-black text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <span>Read Full Article on Vogue.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
