import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

interface SimulationDisclaimerProps {
  compact?: boolean;
}

export const SimulationDisclaimer: React.FC<SimulationDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-neutral-400 bg-noir-900/90 border border-white/10 px-2.5 py-1 rounded">
        <Info className="w-3 h-3 text-luxe-gold shrink-0" />
        <span>Aesthetic preview only · Not an alteration or exact fit guarantee</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-noir-900/80 border border-white/10 rounded flex items-start gap-2.5 text-xs text-neutral-300">
      <AlertCircle className="w-4 h-4 text-luxe-gold shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <span className="text-[10px] uppercase tracking-widest text-luxe-gold font-semibold block">
          FTC & NIST AI RMF Simulation Transparency Notice
        </span>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Virtual try-on results are neural visual simulations. They provide aesthetic styling guidance and do not guarantee physical garment drape, exact dyed fabric color across device displays, or personal alteration requirements. Always cross-reference the retailer's official size chart before checkout.
        </p>
      </div>
    </div>
  );
};
