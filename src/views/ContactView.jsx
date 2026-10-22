import React, { useState, useEffect } from 'react';

export default function ContactView({ onOpenEstimator }) {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    serviceRequired: 'Structural Engineering & Design',
    projectSector: 'High-Rise & Towers',
    projectLocation: 'Dubai, UAE',
    estimatedArea: '100,000 - 250,000 sq.ft',
    timeline: 'Within 30 Days (Fast-Track)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [rfpCode, setRfpCode] = useState('');
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);
  const [dubaiTime, setDubaiTime] = useState('');

  // Check Gulf Standard Time (GST Dubai)
  useEffect(() => {
    const checkDubaiTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dubai',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setDubaiTime(new Intl.DateTimeFormat('en-US', options).format(now));

      const hourOptions = { timeZone: 'Asia/Dubai', hour12: false, hour: 'numeric', minute: 'numeric', weekday: 'short' };
      const formatter = new Intl.DateTimeFormat('en-US', hourOptions);
      const parts = formatter.formatToParts(now);
      const hourPart = parts.find((p) => p.type === 'hour');
      const minutePart = parts.find((p) => p.type === 'minute');
      const weekdayPart = parts.find((p) => p.type === 'weekday');

      const hour = hourPart ? parseInt(hourPart.value, 10) : 12;
      const minute = minutePart ? parseInt(minutePart.value, 10) : 0;
      const weekday = weekdayPart ? weekdayPart.value : 'Mon';

      // Monday to Friday 8:30 AM (510 min) to 6:30 PM (1110 min) GST
      const isWeekday = !['Sat', 'Sun'].includes(weekday);
      const currentMinutes = hour * 60 + minute;
      const startMinutes = 8 * 60 + 30; // 08:30 AM
      const endMinutes = 18 * 60 + 30;  // 06:30 PM
      const isWorkHours = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      setIsOfficeOpen(isWeekday && isWorkHours);
    };

    checkDubaiTime();
    const interval = setInterval(checkDubaiTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const offices = [
    {
      city: 'Dubai (Global Headquarters)',
      badge: 'HEADQUARTERS',
      address: '101 Detroit House, Motor City, Dubai, United Arab Emirates',
      pobox: '123606',
      phone: '+971 4 457 2075',
      phoneSecondary: '+971 4 514 8067',
      fax: '+971 4 457 2076',
      email: 'info@bureauofengineering.com',
      hours: 'Mon – Fri: 08:30 AM – 06:30 PM GST',
      mapUrl: 'https://maps.google.com/?q=Detroit+House+Motor+City+Dubai+United+Arab+Emirates',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = `BEST-RFP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRfpCode(code);
    setSubmitted(true);
  };

  return (
    <div className="view-enter pt-24 pb-24 px-6 md:px-12 max-w-container mx-auto">
      {/* Header */}
      <div className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
          Project Inquiries & Global Headquarters
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#08184E] tracking-tight">
              Start Your <span className="italic text-gradient-gold">Project Inquiry</span>
            </h1>
            <p className="text-[#4A443C] text-sm sm:text-base max-w-2xl font-sans font-normal mt-2 leading-relaxed">
              Connect directly with our senior structural directors in Dubai for architectural consultancy, structural engineering, value engineering, or authority permitting.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-tab-bar font-sans text-xs self-start lg:self-auto shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOfficeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gold-500'
              }`}
            />
            <span className="text-[#6E665B]">Dubai HQ (GST):</span>
            <span className="text-[#08184E] font-bold">{dubaiTime || '09:00:00 AM'}</span>
            <span className="text-[#6E665B] text-[10px]">
              ({isOfficeOpen ? 'Desk Open' : 'After Hours'})
            </span>
          </div>
        </div>
      </div>

      {/* Global Headquarters Office Card */}
      <div className="max-w-4xl mx-auto mb-16">
        {offices.map((office, idx) => (
          <div
            key={idx}
            className="p-7 sm:p-9 rounded-3xl glass-card shadow-xl hover:border-[#08184E]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              {/* Header inside card */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#08184E] text-white flex items-center justify-center shadow-md shrink-0">
                    <span className="material-symbols-outlined text-2xl text-gold-300">location_on</span>
                  </div>
                  <span className="font-sans text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full glass-badge text-[#08184E] font-bold shadow-xs">
                    {office.badge}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#08184E]/10 font-sans text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOfficeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gold-500'}`} />
                  <span className="text-[#08184E] font-semibold">
                    {isOfficeOpen ? 'Office Open Now' : 'Closed • Reopens 08:30 AM GST'}
                  </span>
                </div>
              </div>

              {/* Office Title & Address */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">{office.city}</h3>
                <p className="text-sm text-[#4A443C] font-sans mt-2 leading-relaxed font-medium">
                  {office.address}
                </p>
                {office.pobox && (
                  <p className="text-xs text-[#6E665B] font-sans mt-1 font-semibold">
                    P.O. Box: {office.pobox} • Dubai, United Arab Emirates
                  </p>
                )}
              </div>

              {/* Modern 2x2 Grid: Zero overlap, generous width, crystal clear hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-sans">
                {/* Tile 1: Telephone */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#08184E]/10 shadow-2xs backdrop-blur-xs flex items-start gap-3.5 hover:bg-white/90 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#08184E]/5 text-[#08184E] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl text-gold-600">call</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#6E665B] font-bold block mb-1">
                      Direct Telephone
                    </span>
                    <div className="flex flex-col gap-1 text-xs text-[#1A1815]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="hover:text-gold-700 font-semibold transition-colors">
                          {office.phone}
                        </a>
                        {office.phoneSecondary && (
                          <>
                            <span className="text-[#6E665B] text-[11px] font-bold">&</span>
                            <a href={`tel:${office.phoneSecondary.replace(/\s+/g, '')}`} className="hover:text-gold-700 font-semibold transition-colors">
                              {office.phoneSecondary}
                            </a>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-[#6E665B]">
                        Central engineering switchboard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tile 2: Fax */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#08184E]/10 shadow-2xs backdrop-blur-xs flex items-start gap-3.5 hover:bg-white/90 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#08184E]/5 text-[#08184E] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl text-gold-600">print</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#6E665B] font-bold block mb-1">
                      Facsimile (Fax)
                    </span>
                    <a
                      href={`tel:${office.fax.replace(/\s+/g, '')}`}
                      className="text-xs font-semibold text-[#1A1815] hover:text-gold-700 transition-colors block"
                    >
                      {office.fax}
                    </a>
                    <span className="text-[11px] text-[#6E665B] block mt-0.5">
                      Direct corporate transmission
                    </span>
                  </div>
                </div>

                {/* Tile 3: Email Inquiries */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#08184E]/10 shadow-2xs backdrop-blur-xs flex items-start gap-3.5 hover:bg-white/90 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#08184E]/5 text-[#08184E] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl text-gold-600">mail</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#6E665B] font-bold block mb-1">
                      Email Inquiries
                    </span>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-xs font-semibold text-[#08184E] hover:text-gold-700 transition-colors block break-all"
                    >
                      {office.email}
                    </a>
                    <span className="text-[11px] text-[#6E665B] block mt-0.5">
                      RFP tenders &amp; client consultations
                    </span>
                  </div>
                </div>

                {/* Tile 4: Working Hours */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#08184E]/10 shadow-2xs backdrop-blur-xs flex items-start gap-3.5 hover:bg-white/90 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#08184E]/5 text-[#08184E] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl text-gold-600">schedule</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#6E665B] font-bold block mb-1">
                      Working Hours
                    </span>
                    <div className="text-xs font-semibold text-[#1A1815]">
                      {office.hours}
                    </div>
                    <span className="text-[11px] text-[#6E665B] block mt-0.5">
                      Monday to Friday (GST • UTC+4)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Bar */}
            <div className="pt-4 border-t border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#6E665B] font-sans">
                Official Bureau of Engineering Studies Consulting Engineers L.L.C Headquarters
              </span>
              <a
                href={office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#08184E]/10 text-xs font-sans font-bold text-[#08184E] hover:text-gold-700 hover:border-gold-500/40 transition-all shadow-2xs self-start sm:self-auto"
              >
                <span>View on Google Maps</span>
                <span className="material-symbols-outlined text-sm">north_east</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Main RFP Consultation Form & Fast Connect */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 p-8 sm:p-12 rounded-3xl glass-panel shadow-2xl">
          <div className="mb-8 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">
              Request a Project Proposal / RFP
            </h2>
            <p className="text-xs sm:text-sm text-[#4A443C] font-sans">
              Submit your project parameters. A registered structural director will review and respond within 24 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-3xl glass-panel text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center text-gold-700 mx-auto">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#08184E]">
                RFP Inquiry Transmitted Successfully
              </h3>
              <p className="text-xs sm:text-sm text-[#4A443C] max-w-lg mx-auto font-sans">
                Thank you, <strong className="text-[#08184E]">{formData.fullName}</strong>. Your inquiry has been registered in the Bureau of Engineering Studies Consulting Engineers L.L.C registry under tracking reference:
              </p>
              <div className="font-sans text-base sm:text-lg font-bold text-[#08184E] px-4 py-2 glass-badge rounded-xl inline-block shadow-sm">
                {rfpCode}
              </div>
              <p className="text-[11px] font-sans text-[#6E665B]">
                A formal consultation document has been dispatched to {formData.email || 'your email'}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl glass-card hover:bg-white text-[#08184E] font-sans text-xs font-bold transition-colors shadow-xs"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Eng. Tariq Al Mansoori"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Company / Developer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Emaar Properties / Private Office"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. tariq@domain.com"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Primary Service
                  </label>
                  <select
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs cursor-pointer font-medium"
                  >
                    <option className="bg-white text-[#08184E]">Structural Engineering & Design</option>
                    <option className="bg-white text-[#08184E]">Aviation Hangars & Large-Span Steel</option>
                    <option className="bg-white text-[#08184E]">Luxury Residential & Villa Design</option>
                    <option className="bg-white text-[#08184E]">Value Engineering & Peer Review</option>
                    <option className="bg-white text-[#08184E]">Architect of Record & Permitting</option>
                    <option className="bg-white text-[#08184E]">BIM Level 3 Digital Twin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Project Sector
                  </label>
                  <select
                    value={formData.projectSector}
                    onChange={(e) => setFormData({ ...formData, projectSector: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs cursor-pointer font-medium"
                  >
                    <option className="bg-white text-[#08184E]">High-Rise & Towers</option>
                    <option className="bg-white text-[#08184E]">Aviation & Hangars</option>
                    <option className="bg-white text-[#08184E]">Luxury Residential & Villas</option>
                    <option className="bg-white text-[#08184E]">Hospitality & Hotels</option>
                    <option className="bg-white text-[#08184E]">Commercial & Corporate</option>
                    <option className="bg-white text-[#08184E]">Industrial & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                    Built-Up Area Range
                  </label>
                  <select
                    value={formData.estimatedArea}
                    onChange={(e) => setFormData({ ...formData, estimatedArea: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs cursor-pointer font-medium"
                  >
                    <option className="bg-white text-[#08184E]">Under 25,000 sq.ft (Villa / Boutique)</option>
                    <option className="bg-white text-[#08184E]">25,000 - 100,000 sq.ft</option>
                    <option className="bg-white text-[#08184E]">100,000 - 250,000 sq.ft</option>
                    <option className="bg-white text-[#08184E]">250,000 - 500,000 sq.ft</option>
                    <option className="bg-white text-[#08184E]">500,000+ sq.ft (Mega-Development)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#08184E] font-bold mb-1.5">
                  Project Brief & Technical Specifications
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline plot location, number of basements/storeys, structural constraints, expected tender deadline, or specific authority requirements..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-[11px] font-sans text-[#6E665B]">
                  🔒 Strictly confidential. Non-disclosure protected.
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-base text-gold-400">send</span>
                  <span>Transmit Engineering RFP</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Channels & Interactive Estimator CTA */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Connect Box */}
          <div className="p-8 rounded-3xl glass-card shadow-xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#08184E]">
              Instant Direct Channels
            </h3>
            <p className="text-xs text-[#4A443C] font-sans leading-relaxed">
              Require immediate engineering feedback or urgent authority consultation? Connect with our duty engineer on WhatsApp.
            </p>

            <div className="space-y-3">
              <a
                href="https://wa.me/97144572075?text=Hello%20BEST%20Consulting%20Engineers,%20I%20would%20like%20to%20discuss%20an%20engineering%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-[#08184E] flex items-center justify-between transition-all group backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-emerald-700">chat</span>
                  <div>
                    <div className="text-xs font-bold font-sans text-emerald-900">WhatsApp Live Chat</div>
                    <div className="text-[10px] text-[#4A443C] font-sans">+971 4 457 2075</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-emerald-700 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>

              <button
                onClick={onOpenEstimator}
                className="w-full p-4 rounded-2xl glass-card hover:bg-white text-[#08184E] flex items-center justify-between transition-all group text-left shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-gold-600">calculate</span>
                  <div>
                    <div className="text-xs font-bold font-sans text-[#08184E]">Interactive Scope Builder</div>
                    <div className="text-[10px] text-[#6E665B] font-sans">Calculate Built-Up Area & Timeline</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-gold-600 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Licensing & Registration Box */}
          <div className="p-8 rounded-3xl glass-card shadow-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
              STATUTORY CLEARANCES
            </div>
            <h4 className="font-serif text-lg font-bold text-[#08184E]">Authority Registrations</h4>
            <ul className="space-y-2.5 text-xs text-[#4A443C] font-sans">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600 text-sm">verified</span>
                <span>Dubai Municipality G+4 Structural License</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600 text-sm">verified</span>
                <span>Trakhees & DWC Aviation Special Structures</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600 text-sm">verified</span>
                <span>Dubai Development Authority (DDA) Registered</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-600 text-sm">verified</span>
                <span>Muscat Municipality Grade 1 Classification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
