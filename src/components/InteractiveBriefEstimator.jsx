import React, { useState } from 'react';

export default function InteractiveBriefEstimator({ isModal = false, onClose }) {
  const [sector, setSector] = useState('High-Rise & Towers');
  const [areaSqFt, setAreaSqFt] = useState(250000);
  const [location, setLocation] = useState('Dubai, UAE');
  const [selectedServices, setSelectedServices] = useState([
    'Structural Engineering & Design',
    'Authority AoR Permitting',
  ]);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const servicesList = [
    'Structural Engineering & Design',
    'Value Engineering & Optimization',
    'Authority AoR Permitting',
    'BIM Level 3 Modeling',
    'Independent Peer Review',
    'MEP Coordination',
  ];

  const toggleService = (s) => {
    if (selectedServices.includes(s)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((item) => item !== s));
      }
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  // Approximate design timeline calculation
  const baseWeeks = sector === 'Aviation Hangars' ? 8 : sector === 'High-Rise & Towers' ? 14 : sector === 'Luxury Villas' ? 6 : 10;
  const areaMultiplier = areaSqFt > 1000000 ? 1.5 : areaSqFt > 400000 ? 1.2 : 1.0;
  const estimatedDesignWeeks = Math.round(baseWeeks * areaMultiplier);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onClose) onClose();
    }, 4000);
  };

  const generateWhatsAppLink = () => {
    const text = `Hello Bureau of Engineering Studies (BEST), I would like to request an engineering proposal:
Sector: ${sector}
Built-up Area: ${areaSqFt.toLocaleString()} sq.ft
Location: ${location}
Services: ${selectedServices.join(', ')}
Client: ${clientName || 'Developer'}
Contact: ${clientContact || 'N/A'}`;
    return `https://wa.me/97144567890?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`relative ${isModal ? 'p-6 md:p-10 max-w-4xl w-full mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full glass-badge text-[11px] font-sans font-semibold tracking-wider uppercase text-[#08184E] inline-flex">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span>Interactive Project Scope & Proposal Builder</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#08184E] tracking-tight mt-1">
            Plan Your <span className="italic text-gradient-gold">Landmark Development</span>
          </h2>
          <p className="text-sm text-steel-600 mt-1.5 max-w-xl font-sans">
            Specify your sector, built-up area, and required engineering scope for an instant timeline estimate and priority consultation.
          </p>
        </div>

        {isModal && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl glass-badge hover:bg-white/60 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sector Selector */}
          <div>
            <label className="block font-sans text-xs text-[#08184E] font-semibold uppercase tracking-wider mb-2.5">
              1. Project Sector / Typology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: 'High-Rise & Towers', icon: 'domain' },
                { name: 'Aviation Hangars', icon: 'flight' },
                { name: 'Luxury Villas', icon: 'villa' },
                { name: 'Hotels & Resorts', icon: 'hotel' },
                { name: 'Commercial Offices', icon: 'corporate_fare' },
                { name: 'Schools & Universities', icon: 'school' },
              ].map((item) => {
                const isSelected = sector === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSector(item.name)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-150 ${
                      isSelected
                        ? 'border-[#08184E] bg-[#08184E] text-white shadow-md font-bold'
                        : 'glass-card text-steel-700 hover:text-[#08184E]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-lg block mb-1 ${isSelected ? 'text-gold-400' : 'text-gold-700'}`}>
                      {item.icon}
                    </span>
                    <div className={`text-xs font-sans font-bold truncate ${isSelected ? 'text-white' : 'text-[#08184E]'}`}>{item.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Built-Up Area Slider */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="area-slider" className="font-sans text-xs text-[#08184E] font-semibold uppercase tracking-wider">
                2. Approximate Built-up Area
              </label>
              <span className="font-serif text-lg font-bold text-[#08184E]">
                {areaSqFt.toLocaleString()} sq. ft
              </span>
            </div>

            <input
              id="area-slider"
              type="range"
              min="15000"
              max="2000000"
              step="15000"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full h-2 bg-white/60 rounded-lg appearance-none cursor-pointer accent-[#08184E]"
            />

            <div className="flex justify-between text-[10px] font-sans text-steel-500">
              <span>15,000 sq ft (Boutique)</span>
              <span>500,000 sq ft</span>
              <span>2,000,000+ sq ft (Mega)</span>
            </div>
          </div>

          {/* Services Checklist */}
          <div>
            <label className="block font-sans text-xs text-[#08184E] font-semibold uppercase tracking-wider mb-2.5">
              3. Scope of Services Required
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {servicesList.map((s) => {
                const active = selectedServices.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`p-3 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                      active
                        ? 'bg-[#08184E] border-[#08184E] text-white font-semibold shadow-sm'
                        : 'glass-card text-steel-700 hover:text-[#08184E]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-base ${active ? 'text-gold-400 font-bold' : 'text-steel-400'}`}>
                      {active ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="text-xs font-sans font-medium truncate">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output HUD */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
          <div className="space-y-5">
            <div>
              <span className="font-sans text-[11px] tracking-wider text-steel-500 uppercase block mb-1 font-semibold">
                Estimated Engineering Design Turnaround
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E]">
                {estimatedDesignWeeks} – {estimatedDesignWeeks + 4} Weeks
              </div>
              <span className="text-[11px] font-sans text-steel-500 block mt-1">
                Concept Modeling to Authority Approval Set
              </span>
            </div>

            <div className="p-4 rounded-xl glass-panel-subtle space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-steel-600">Target Location:</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-[#08184E] font-bold focus:outline-none text-right cursor-pointer"
                >
                  <option value="Dubai, UAE">Dubai, UAE</option>
                  <option value="Abu Dhabi, UAE">Abu Dhabi, UAE</option>
                  <option value="Sharjah, UAE">Sharjah, UAE</option>
                  <option value="Muscat, Oman">Muscat, Oman</option>
                  <option value="Lusail, Qatar">Lusail, Qatar</option>
                  <option value="India (NCR)">India (Delhi NCR)</option>
                </select>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-600">Selected Services:</span>
                <span className="text-[#08184E] font-bold">{selectedServices.length} Disciplines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-600">Authority Jurisdiction:</span>
                <span className="text-emerald-700 font-bold">G+Unlimited Registered</span>
              </div>
            </div>

            {/* Client Input fields */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Your Name / Company"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-3 glass-input rounded-xl text-xs placeholder-steel-400 font-sans"
              />
              <input
                type="text"
                placeholder="Phone or Email Address"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                className="w-full p-3 glass-input rounded-xl text-xs placeholder-steel-400 font-sans"
              />

              {submitted ? (
                <div className="p-3 text-center bg-emerald-50/90 border border-emerald-500/30 rounded-xl text-emerald-800 text-xs font-sans font-bold">
                  ✓ Consultation request transmitted! Our directors will contact you within 24 hours.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#08184E] hover:bg-[#0c226b] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-base text-gold-400">send</span>
                  <span>Request Engineering Proposal</span>
                </button>
              )}
            </form>
          </div>

          <div className="pt-2 border-t border-white/50">
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-xl glass-card text-[#08184E] font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
              <span>Connect Instantly via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
