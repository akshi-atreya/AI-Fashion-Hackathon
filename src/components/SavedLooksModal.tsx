import React from 'react';
import { X, Trash2, Shirt, Sparkles } from 'lucide-react';
import { Garment, ModelPreset } from '../types/fashion';

export interface SavedLookItem {
  id: string;
  garment: Garment;
  model: ModelPreset;
  savedAt: string;
}

interface SavedLooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLooks: SavedLookItem[];
  onRemoveLook: (id: string) => void;
  onLoadLookIntoStudio: (garment: Garment) => void;
}

export const SavedLooksModal: React.FC<SavedLooksModalProps> = ({
  isOpen,
  onClose,
  savedLooks,
  onRemoveLook,
  onLoadLookIntoStudio
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-noir-950 border border-white/20 shadow-2xl p-6 sm:p-8 text-white max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxe-gold">Couture Wardrobe</span>
            <h3 className="font-serif text-xl text-white font-normal uppercase tracking-wider">
              Saved Try-On Looks ({savedLooks.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {savedLooks.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <Shirt className="w-10 h-10 text-neutral-600 mb-3" />
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
              Your Wardrobe Is Currently Empty
            </p>
            <p className="text-[11px] text-neutral-500 max-w-xs mb-6">
              Experiment with garments and models in the Virtual Try-On studio and save your favorite silhouettes.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxe-gold transition-colors"
            >
              Start Trying On
            </button>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {savedLooks.map((look) => (
              <div
                key={look.id}
                className="flex items-center justify-between p-3.5 bg-noir-900 border border-white/10 hover:border-white/20 transition-all gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={look.garment.imageUrl}
                    alt={look.garment.name}
                    className="w-14 h-18 object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm text-white font-medium">
                      {look.garment.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Fitted on {look.model.name} · {look.garment.price}
                    </p>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      Saved {look.savedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadLookIntoStudio(look.garment);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-luxe-gold text-black text-[9px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Open in Fitting</span>
                  </button>
                  <button
                    onClick={() => onRemoveLook(look.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                    title="Remove from Wardrobe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
