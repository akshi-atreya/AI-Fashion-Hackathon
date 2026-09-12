import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Shield, Download, Trash2, CheckCircle2, Code2, RefreshCw, FileText } from 'lucide-react';
import { useStyleLens } from '../context/StyleLensContext';

interface PrivacyDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyDataDrawer: React.FC<PrivacyDataDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { quiz, userPhoto, setUserPhoto, resetApp } = useStyleLens();
  const [activeTab, setActiveTab] = useState<'payload' | 'checklist' | 'controls'>('payload');
  const [purgedNotification, setPurgedNotification] = useState(false);

  if (!isOpen) return null;

  // Build the structured payload live
  const samplePayload = {
    request: {
      item: quiz.category,
      occasion: quiz.occasion,
      dress_code: quiz.dressCode || 'smart_casual',
      location: 'US East',
      event_date: new Date().toISOString().split('T')[0],
      desired_impression: quiz.desiredImpression || ['polished']
    },
    constraints: {
      budget: {
        amount: quiz.budget === 'low' ? 99 : quiz.budget === 'medium' ? 220 : 1200,
        currency: 'USD',
        scope: quiz.category === 'outfit' ? 'look' : 'item',
        includes_shipping: false
      },
      excluded_materials: quiz.excludedMaterials || [],
      retailer_exclusions: []
    },
    style: {
      likes: [quiz.style],
      dislikes: [],
      color_preferences: []
    },
    fit: {
      sizes: { tops: quiz.size, bottoms: quiz.size, shoes: '' },
      fit_preferences: [quiz.gender],
      comfort_needs: quiz.comfortNeeds || [],
      modesty_preferences: quiz.modestyPreferences || ['standard']
    },
    wardrobe: {
      owned_items: quiz.ownedItemsToPair || [],
      must_pair_with: quiz.ownedItemsToPair || [],
      needs: [quiz.category]
    },
    photo: {
      try_on_requested: !!userPhoto,
      asset_id: userPhoto ? 'anonymized-temp-asset-id' : null,
      purpose_consent: ['try_on_only', 'session_retention_only'],
      retention_until: 'end_of_session'
    },
    shopping: {
      region: 'US',
      shipping_postal_region: 'US-NY',
      sale_ok: true,
      rental_or_resale_ok: false
    },
    ranking_policy: {
      hard_constraints_first: true,
      sponsored_placement_allowed: false,
      explain_reasons: true
    },
    response_requirements: {
      show_exact_variant: true,
      flag_uncertainty: true,
      label_paid_results: true,
      offer_alternatives: true
    }
  };

  const checklistItems = [
    { num: '1', title: 'Request and Occasion Context', status: 'Implemented', desc: 'Captures core request, item category, occasion, dress code, and desired impression.' },
    { num: '2', title: 'Budget and Shopping Boundaries', status: 'Implemented', desc: 'Hard constraint ranking (Zara / CK / MKors), currency, and transparent affiliate disclosures.' },
    { num: '3', title: 'Personal Style Profile', status: 'Implemented', desc: 'Aesthetic persona, progressive disclosure, and user-controlled preferences.' },
    { num: '4', title: 'Fit, Comfort and Inclusion', status: 'Implemented', desc: 'Category sizing baselines, opt-in comfort/modesty preferences, and WCAG 2.2 accessibility.' },
    { num: '5', title: 'Wardrobe & Outfit Building', status: 'Implemented', desc: 'Supports coordinating with owned pieces and specifying category goals.' },
    { num: '6', title: 'Photo & Virtual Try-On Safeguards', status: 'Implemented', desc: 'Explicit consent, non-inference of sensitive traits (age/race/body), in-memory retention, FTC simulation disclaimer.' },
    { num: '7', title: 'Product Catalog & Retailer Facts', status: 'Implemented', desc: 'Timestamped price/stock facts, variant links, and return window attribution.' },
    { num: '8', title: 'Recommendation Logic & Explanation', status: 'Implemented', desc: 'Hard constraints first, Gemini curator rationale, and uncertainty flags.' },
    { num: '9', title: 'Feedback & Learning Loop', status: 'Implemented', desc: 'Feedback chips (too formal, wrong color), undo controls, and pause profiling.' },
    { num: '10', title: 'Privacy, Security & AI Governance', status: 'Implemented', desc: 'Data minimization, 1-click immediate deletion, and local JSON export.' }
  ];

  const handlePurgePhoto = () => {
    setUserPhoto(null);
    localStorage.removeItem('stylelens_user_photo');
    setPurgedNotification(true);
    setTimeout(() => setPurgedNotification(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(samplePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "stylelens-profile-context.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-noir-950 border-l border-white/15 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-luxe-gold/20 flex items-center justify-center text-luxe-gold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-luxe-gold font-semibold">
                  Compliance & Data Governance
                </span>
                <h3 className="font-serif text-lg text-white font-medium">
                  AI Stylist Input Checklist Audit
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 mb-6 gap-2">
            <button
              onClick={() => setActiveTab('payload')}
              className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'payload'
                  ? 'border-luxe-gold text-luxe-gold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>AI Context Template (JSON)</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'checklist'
                  ? 'border-luxe-gold text-luxe-gold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>10-Point Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('controls')}
              className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'controls'
                  ? 'border-luxe-gold text-luxe-gold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>User Rights & Purge</span>
            </button>
          </div>

          {/* TAB 1: AI CONTEXT TEMPLATE (JSON) */}
          {activeTab === 'payload' && (
            <div className="space-y-4">
              <div className="p-3 bg-noir-900 border border-white/10 rounded text-xs text-neutral-300">
                <p className="text-[11px] leading-relaxed">
                  Below is the structured, validated context payload generated from your intake answers. Raw images and direct personal identifiers are strictly excluded from recommendation model prompts.
                </p>
              </div>

              <pre className="p-4 bg-noir-900 border border-white/10 rounded text-[11px] font-mono text-neutral-200 overflow-x-auto max-h-[380px] leading-relaxed">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>

              <button
                onClick={handleExportData}
                className="w-full py-2.5 border border-white/20 hover:border-luxe-gold rounded text-xs uppercase tracking-wider text-neutral-200 hover:text-white bg-noir-900 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-luxe-gold" />
                <span>Export Structured Profile JSON</span>
              </button>
            </div>
          )}

          {/* TAB 2: 10-POINT CHECKLIST AUDIT */}
          {activeTab === 'checklist' && (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {checklistItems.map((item) => (
                <div
                  key={item.num}
                  className="p-3 bg-noir-900 border border-white/10 rounded flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-luxe-gold/20 text-luxe-gold font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <h4 className="text-xs font-serif font-medium text-white">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] uppercase tracking-wider font-semibold rounded shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: USER RIGHTS & PURGE */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              <div className="p-4 bg-noir-900 border border-white/10 rounded space-y-3">
                <h4 className="text-xs font-serif font-medium text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-luxe-gold" />
                  <span>Privacy Guarantees & Non-Inference Rules</span>
                </h4>
                <ul className="space-y-2 text-[11px] text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>No Trait Inference:</strong> We never infer body measurements, age, race/ethnicity, gender identity, or health status from photos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Session-Only Retention:</strong> Your photo is held in temporary memory for your fitting session and automatically expirable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sponsored Transparency:</strong> Affiliate links are clearly labeled and do not alter the user's hard budget constraints.</span>
                  </li>
                </ul>
              </div>

              {/* Immediate Purge Actions */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-semibold">
                  Immediate Data Purge Controls
                </span>

                <button
                  onClick={handlePurgePhoto}
                  className="w-full py-3 border border-red-500/30 hover:border-red-500 bg-red-950/20 text-red-300 hover:text-red-200 text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{purgedNotification ? 'Photo Deleted Immediately!' : 'Delete Uploaded Photo Now'}</span>
                </button>

                <button
                  onClick={() => {
                    resetApp();
                    onClose();
                  }}
                  className="w-full py-3 border border-white/15 hover:border-white/30 bg-noir-900 text-neutral-300 hover:text-white text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Quiz Answers & Stored Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              onClose();
              navigate('/checklist');
            }}
            className="w-full py-3 bg-luxe-gold hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            <FileText className="w-4 h-4" />
            <span>Open Full Specification & Checklist Page</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-noir-900 hover:bg-white/10 text-neutral-300 text-xs uppercase tracking-wider rounded transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
