import React, { useState } from 'react';

const PERMIT_DATA = [
  {
    id: 'a-permit',
    code: 'CLASS_A',
    name: 'Class A Permit (Minor Works)',
    desc: 'Curb cuts, driveway aprons, residential sidewalk replacement, and tree-well reconstruction.',
    baseFee: 295,
    ratePercent: 0.012,
    standardDays: '5–8 Business Days',
    expeditedDays: '2–3 Business Days',
    checklist: [
      'Property Plot Plan / Dimensioned Sketch',
      'Proof of Legal Ownership or Authorization',
      'Licensed Contractor Verification (Class A or C-8)',
    ],
  },
  {
    id: 'b-permit',
    code: 'CLASS_B',
    name: 'Class B Permit (Major Capital Infrastructure)',
    desc: 'Public right-of-way street improvements, traffic signals, street widening, storm drains, and subdivisions.',
    baseFee: 2650,
    ratePercent: 0.038,
    standardDays: '28–40 Business Days',
    expeditedDays: '14–18 Business Days',
    checklist: [
      'Civil CAD Engineering Plan Set (Signed PE)',
      'Surety Performance & Payment Bond',
      'Traffic Management & Control Plan (LADOT)',
      'Environmental CEQA Exemption or Determination',
    ],
  },
  {
    id: 's-permit',
    code: 'CLASS_S',
    name: 'Sewer & Storm Connection Permit',
    desc: 'New sewer lateral installations, mainline sewer taps, manhole construction, and storm connections.',
    baseFee: 620,
    ratePercent: 0.018,
    standardDays: '10–14 Business Days',
    expeditedDays: '4–6 Business Days',
    checklist: [
      'Plumbing Riser & Profile Schematic',
      'Industrial Waste Pre-Treatment Review (if applicable)',
      'NavigateLA Utility Alignment Verification',
    ],
  },
  {
    id: 'r-permit',
    code: 'CLASS_R',
    name: 'Revocable Encroachment Permit (R-Permit)',
    desc: 'Outdoor dining parklets, decorative canopies, street furniture, subterranean vaults, and public right-of-way use.',
    baseFee: 950,
    ratePercent: 0.015,
    standardDays: '20–25 Business Days',
    expeditedDays: '10–12 Business Days',
    checklist: [
      'Right-of-Way Land Survey & Encroachment Limits',
      'Certificate of General Liability Insurance ($1M+)',
      'Structural Anchoring & Dismantling Plan',
    ],
  },
  {
    id: 'e-permit',
    code: 'CLASS_E',
    name: 'Excavation & Utility Trenching Permit',
    desc: 'Telecommunication conduit boring, gas lines, electric conduits, and asphalt pavement restoration.',
    baseFee: 780,
    ratePercent: 0.024,
    standardDays: '12–16 Business Days',
    expeditedDays: '6–8 Business Days',
    checklist: [
      'Underground Service Alert (DigAlert) Ticket #',
      'Caltrans / City Pavement Resurfacing Plan',
      'Trench Safety & Shoring Certification',
    ],
  },
];

export default function InteractivePermitEstimator({ isModal = false, onClose }) {
  const [selectedPermitId, setSelectedPermitId] = useState('b-permit');
  const [valuation, setValuation] = useState(250000);
  const [isExpedited, setIsExpedited] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);

  const currentPermit = PERMIT_DATA.find((p) => p.id === selectedPermitId) || PERMIT_DATA[1];

  const baseFee = currentPermit.baseFee;
  const surchargeFee = Math.round(valuation * currentPermit.ratePercent);
  const expeditedSurcharge = isExpedited ? Math.round((baseFee + surchargeFee) * 0.5) : 0;
  const totalEstimatedFee = baseFee + surchargeFee + expeditedSurcharge;

  const targetTimeline = isExpedited ? currentPermit.expeditedDays : currentPermit.standardDays;

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopySummary = () => {
    const summaryText = `City of Los Angeles BOE Permit Estimate:
Classification: ${currentPermit.name} (${currentPermit.code})
Project Valuation: $${valuation.toLocaleString()}
Estimated Total Fee: $${totalEstimatedFee.toLocaleString()} (Base: $${baseFee}, Engineering Review: $${surchargeFee}${isExpedited ? ', Expedited: $' + expeditedSurcharge : ''})
Target Review Timeline: ${targetTimeline}
Generated via Bureau of Engineering Online Portal`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`relative ${isModal ? 'p-6 md:p-10 max-w-4xl w-full mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.25em] uppercase text-cobalt-400">
            <span className="w-2 h-2 rounded-full bg-cobalt-400 animate-pulse" />
            <span>MUNICIPAL CODE SEC 62.106 FEE ENGINE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
            Interactive Permit <span className="text-gradient-cobalt">Fee & Timeline Estimator</span>
          </h2>
          <p className="text-sm text-steel-400 mt-1.5 max-w-xl font-light leading-relaxed">
            Calculate estimated plan check fees, inspection surcharges, and municipal review turnaround for construction in the public right-of-way.
          </p>
        </div>

        {isModal && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-brand-850 border border-white/10 text-steel-400 hover:text-white hover:border-white/20 transition-colors"
            aria-label="Close Estimator"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Permit Selector */}
          <div>
            <label className="block font-mono text-xs text-steel-300 uppercase tracking-wider mb-2.5">
              1. Select Permit Classification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMIT_DATA.map((permit) => {
                const isSelected = selectedPermitId === permit.id;
                return (
                  <button
                    key={permit.id}
                    type="button"
                    onClick={() => {
                      setSelectedPermitId(permit.id);
                      setCheckedItems({});
                    }}
                    className={`p-3 rounded-xl text-left border transition-all duration-150 ${
                      isSelected
                        ? 'border-cobalt-500 bg-cobalt-600/15 text-white shadow-cobalt-glow'
                        : 'border-white/[0.08] bg-brand-850/70 text-steel-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="font-mono text-[10px] font-bold text-cobalt-400 tracking-wider">
                      {permit.code}
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5 truncate">{permit.name}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-steel-400 mt-2.5 font-light italic">
              {currentPermit.desc}
            </p>
          </div>

          {/* Project Valuation Slider */}
          <div className="bg-brand-850/90 p-5 rounded-xl border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="valuation-input" className="font-mono text-xs text-steel-300 uppercase tracking-wider">
                2. Estimated Construction Valuation
              </label>
              <span className="font-display text-lg font-bold text-cobalt-400">
                ${valuation.toLocaleString()}
              </span>
            </div>

            <input
              id="valuation-input"
              type="range"
              min="10000"
              max="2500000"
              step="10000"
              value={valuation}
              onChange={(e) => setValuation(Number(e.target.value))}
              className="w-full h-2 bg-brand-950 rounded-lg appearance-none cursor-pointer accent-cobalt-500"
            />

            {/* Valuation Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { label: '$50K (Minor)', val: 50000 },
                { label: '$250K (Standard)', val: 250000 },
                { label: '$1M (Major)', val: 1000000 },
                { label: '$2.5M (Subdivision)', val: 2500000 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setValuation(preset.val)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors ${
                    valuation === preset.val
                      ? 'bg-cobalt-600 text-white font-semibold'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-steel-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expedited Review Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-brand-850/70 border border-white/[0.08]">
            <div className="pr-4">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Expedited Plan Check Review</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-cobalt-500/20 text-cobalt-300 border border-cobalt-400/30">
                  Priority Queue
                </span>
              </div>
              <div className="text-[11px] text-steel-400 font-light mt-0.5">
                Direct senior engineer assignment with 50% accelerated timeline (+50% surcharge).
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpedited(!isExpedited)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                isExpedited ? 'bg-cobalt-600' : 'bg-brand-950 border border-white/20'
              }`}
              aria-label="Toggle Expedited Review"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  isExpedited ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Output HUD */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-brand-850 to-brand-900 border border-white/[0.12] shadow-glass-2 relative overflow-hidden">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-steel-400 uppercase block mb-1">
                Estimated Municipal Total
              </span>
              <div className="font-display text-4xl font-extrabold text-gradient-cobalt">
                ${totalEstimatedFee.toLocaleString()}
              </div>
              <div className="mt-3 space-y-1.5 pt-3 border-t border-white/[0.08] text-xs font-mono">
                <div className="flex justify-between text-steel-400">
                  <span>Base Filing Fee:</span>
                  <span className="text-white">${baseFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-steel-400">
                  <span>Engineering Plan Check:</span>
                  <span className="text-white">${surchargeFee.toLocaleString()}</span>
                </div>
                {isExpedited && (
                  <div className="flex justify-between text-cobalt-400">
                    <span>Expedited Surcharge (50%):</span>
                    <span>+${expeditedSurcharge.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Turnaround Time Metric Box */}
            <div className="p-4 rounded-xl bg-brand-950/80 border border-white/[0.08] space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-steel-400 font-mono">Target Turnaround:</span>
                <span className="font-bold text-cobalt-300 font-mono">{targetTimeline}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-steel-400 font-mono">Review Priority:</span>
                <span className="text-white font-mono">{isExpedited ? 'EXPEDITED TIER 1' : 'STANDARD TIER 2'}</span>
              </div>
            </div>

            {/* Checklist of Submittals */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-steel-300 uppercase block mb-2 font-semibold">
                Required Submittal Documents:
              </span>
              <ul className="space-y-2 text-xs">
                {currentPermit.checklist.map((item, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked ? 'bg-cobalt-500/10 text-white' : 'text-steel-400 hover:text-steel-200'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-base mt-0.5 ${isChecked ? 'text-cobalt-400' : 'text-steel-600'}`}>
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-white/[0.08] mt-6 space-y-2.5">
            <a
              href="https://engpermits.lacity.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cobalt-600 hover:bg-cobalt-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-cobalt-glow transition-all"
            >
              <span>Submit on LA Online Portal</span>
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </a>

            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full py-2.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-steel-300 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Estimate Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
