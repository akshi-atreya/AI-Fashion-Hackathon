import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, Menu, X, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  savedLooksCount: number;
  onOpenSavedLooks: () => void;
  onOpenQuickTryOn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ savedLooksCount, onOpenSavedLooks, onOpenQuickTryOn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio ambient runway synth drone generator for high-fashion ambiance
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 600);
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Ambient atmospheric low drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 subtle overtone

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        oscillatorRef.current = osc1;
        gainRef.current = gain;

        setIsPlayingAudio(true);
      } catch (err) {
        console.warn('AudioContext not permitted or supported:', err);
      }
    }
  };

  const navLinks = [
    { label: 'LIVE RUNWAY', href: '#hero' },
    { label: 'VIRTUAL TRY-ON', href: '#tryon' },
    { label: 'STYLE ADVISOR', href: '#advisor' },
    { label: 'RUNWAY TRENDS', href: '#trends' },
    { label: 'VOGUE DISPATCH', href: '#vogue' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-noir-950/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-noir-950/90 to-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand / Logo inspired by Saint Laurent Paris */}
          <a href="#" className="flex flex-col group cursor-pointer">
            <span className="font-serif tracking-luxury text-sm md:text-base font-bold text-white group-hover:text-luxe-champagne transition-colors">
              ATELIER NOIR
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-sans">
              PARIS · HAUTE COUTURE AI
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.25em] text-neutral-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-luxe-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Ambient Sound, Try-On Action, Lookbook */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Audio ambiance button */}
            <button
              onClick={toggleAmbientSound}
              title={isPlayingAudio ? 'Mute Runway Ambiance' : 'Play Runway Ambiance'}
              className="p-2 text-neutral-400 hover:text-luxe-gold transition-colors rounded-full border border-white/5 hover:border-luxe-gold/30 bg-noir-900/50"
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-luxe-gold animate-pulse-subtle" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Quick Virtual Fitting Button */}
            <button
              onClick={onOpenQuickTryOn}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase border border-white/20 hover:border-luxe-gold bg-noir-900/80 hover:bg-luxe-gold/10 text-neutral-200 hover:text-luxe-gold transition-all duration-300"
            >
              <Sparkles className="w-3 h-3 text-luxe-gold" />
              <span>Instant Try-On</span>
            </button>

            {/* Saved Looks Counter */}
            <button
              onClick={onOpenSavedLooks}
              className="relative p-2 text-neutral-300 hover:text-white transition-colors border border-white/5 hover:border-white/20 rounded-full bg-noir-900/50"
              title="Saved Wardrobe Looks"
            >
              <ShoppingBag className="w-4 h-4" />
              {savedLooksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxe-gold text-noir-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedLooksCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 pt-2 border-t border-white/10 flex flex-col space-y-3 bg-noir-950/95 backdrop-blur-xl px-4 rounded-b-xl">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium tracking-[0.25em] text-neutral-300 hover:text-luxe-gold py-2 transition-colors border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleAmbientSound();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs tracking-wider text-neutral-400"
              >
                {isPlayingAudio ? <Volume2 className="w-4 h-4 text-luxe-gold" /> : <VolumeX className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Sound On' : 'Enable Runway Sound'}</span>
              </button>
              <button
                onClick={() => {
                  onOpenQuickTryOn();
                  setMobileMenuOpen(false);
                }}
                className="text-xs tracking-wider uppercase text-luxe-gold underline"
              >
                Try On Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
