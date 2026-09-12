import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shirt, Shield } from 'lucide-react';
import { useStyleLens } from '../context/StyleLensContext';
import { PrivacyDataDrawer } from './PrivacyDataDrawer';

export const Header: React.FC = () => {
  const {
    quiz,
    savedLooks,
    removeSavedLook,
    resetApp,
    currentStudioStep,
    setCurrentStudioStep,
    bodyTypeAnalysis
  } = useStyleLens();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [privacyDrawerOpen, setPrivacyDrawerOpen] = useState(false);

  const retailerName =
    quiz.budget === 'low'
      ? 'Zara'
      : quiz.budget === 'medium'
      ? 'Calvin Klein'
      : 'Michael Kors';

  const steps = [
    { num: 1, label: 'Style & Budget' },
    { num: 2, label: 'Photo & Pose' },
    { num: 3, label: 'Body Type Scan' },
    { num: 4, label: 'Try-On Studio' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-noir-950/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" onClick={() => setCurrentStudioStep(1)} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-luxe-gold to-white flex items-center justify-center text-noir-950 font-bold text-base shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              SL
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg font-bold text-white group-hover:text-luxe-champagne transition-colors">
                STYLELENS
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                AI BODY & VIRTUAL TRY-ON STUDIO
              </span>
            </div>
          </Link>

          {/* Streamlined Step Indicator replacing tabs */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-noir-900/80 px-3 py-1.5 rounded-full border border-white/10">
            {steps.map((step, idx) => {
              const isActive = currentStudioStep === step.num;
              const isPassed = currentStudioStep > step.num;
              return (
                <React.Fragment key={step.num}>
                  {idx > 0 && (
                    <span className={`w-3 sm:w-5 h-[1px] ${isPassed ? 'bg-luxe-gold' : 'bg-white/15'}`} />
                  )}
                  <button
                    onClick={() => setCurrentStudioStep(step.num)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-medium transition-all ${
                      isActive
                        ? 'bg-luxe-gold text-noir-950 font-bold shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                        : isPassed
                        ? 'text-luxe-champagne hover:text-white'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-noir-950 text-luxe-gold'
                          : isPassed
                          ? 'bg-luxe-gold/20 text-luxe-champagne'
                          : 'bg-white/10 text-neutral-500'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span>{step.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Quick Status / Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Retailer Tag */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-900 border border-white/10 text-[10px] uppercase tracking-wider text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-luxe-gold animate-pulse" />
              <span>Budget:</span>
              <span className="text-white font-semibold">{retailerName}</span>
            </div>

            {/* Body Type Pill if detected */}
            {bodyTypeAnalysis && (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-luxe-gold/10 border border-luxe-gold/30 text-[10px] uppercase tracking-wider text-luxe-champagne">
                <span>Body:</span>
                <span className="font-semibold text-white">{bodyTypeAnalysis.label.split('/')[0]}</span>
              </div>
            )}

            {/* Privacy & Compliance Trigger */}
            <button
              onClick={() => setPrivacyDrawerOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-900 border border-white/10 hover:border-luxe-gold/50 text-[10px] uppercase tracking-wider text-neutral-300 transition-colors"
              title="AI Checklist & Privacy Governance"
            >
              <Shield className="w-3.5 h-3.5 text-luxe-gold" />
              <span className="hidden xl:inline">AI Checklist</span>
            </button>

            {/* Reset / New Fitting */}
            <button
              onClick={() => {
                if (window.confirm('Start a fresh style session?')) {
                  resetApp();
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-900 border border-white/10 hover:border-white/30 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              title="Start a new style session"
            >
              Reset
            </button>

            {/* Saved Looks Drawer Button */}
            <button
              onClick={() => setSavedDrawerOpen(true)}
              className="relative p-2 rounded-lg bg-noir-900 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all"
              title="Saved Looks"
            >
              <ShoppingBag className="w-4 h-4" />
              {savedLooks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxe-gold text-noir-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedLooks.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-noir-900 border border-white/10 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2 bg-noir-950">
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => {
                  setCurrentStudioStep(step.num);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs uppercase tracking-widest flex items-center justify-between border-b border-white/5 ${
                  currentStudioStep === step.num
                    ? 'text-luxe-gold font-bold bg-white/5'
                    : 'text-neutral-300'
                }`}
              >
                <span>Step {step.num}: {step.label}</span>
                {currentStudioStep === step.num && <span className="text-[10px] text-luxe-gold">Active</span>}
              </button>
            ))}
            <div className="pt-2 flex items-center justify-between px-3 text-[10px] text-neutral-400">
              <span>Budget: {retailerName}</span>
              <button
                onClick={() => {
                  resetApp();
                  setMobileMenuOpen(false);
                }}
                className="text-neutral-400 hover:text-white underline"
              >
                Reset Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Looks Drawer */}
      {savedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-noir-950 border-l border-white/15 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxe-gold">StyleLens Wardrobe</span>
                  <h3 className="font-serif text-lg text-white font-medium">Saved Try-On Looks ({savedLooks.length})</h3>
                </div>
                <button
                  onClick={() => setSavedDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {savedLooks.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 text-xs">
                  <Shirt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No looks saved yet. Try on garments to save favorites!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedLooks.map((look) => (
                    <div
                      key={look.id}
                      className="p-3 bg-noir-900 border border-white/10 rounded flex items-center justify-between gap-3"
                    >
                      <img
                        src={look.garment.imageUrl}
                        alt={look.garment.name}
                        className="w-14 h-18 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">{look.garment.name}</p>
                        <p className="text-[10px] text-luxe-gold">{look.garment.brand} · ${look.garment.price}</p>
                        <span className="text-[9px] text-neutral-500">Saved {look.savedAt}</span>
                      </div>
                      <button
                        onClick={() => removeSavedLook(look.id)}
                        className="text-[10px] text-neutral-500 hover:text-red-400 p-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSavedDrawerOpen(false)}
              className="w-full py-3 bg-white hover:bg-luxe-champagne text-black text-xs font-semibold uppercase tracking-widest transition-colors mt-6"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* AI Checklist & Privacy Governance Drawer */}
      <PrivacyDataDrawer
        isOpen={privacyDrawerOpen}
        onClose={() => setPrivacyDrawerOpen(false)}
      />
    </header>
  );
};
