import { useState } from 'react';
import { StartupProfile } from '../types';
import { Target, HelpCircle, Sparkles, RefreshCw, Lightbulb } from 'lucide-react';
import { TRANSLATIONS } from '../locales/translations';

interface StartupProfileFormProps {
  profile: StartupProfile;
  onChange: (profile: StartupProfile) => void;
  currentLanguage?: string;
}

const sectorPresets: Record<string, string[]> = {
  any: [
    "Developing next-generation vertical farming stacks combining modular IoT and circular hydroponics for zero-pesticide urban crops.",
    "Building a cloud-based automated supply chain platform optimizing cross-border logistics using smart contract verification."
  ],
  ai: [
    "Developing self-optimizing LLM agents that automate code generation and security audits for enterprise applications.",
    "Building computer-vision models to identify micro-fractures in industrial machinery before catastrophic failures."
  ],
  deeptech: [
    "Creating room-temperature semiconductor layers for high-efficiency quantum computing processors.",
    "Developing high-precision carbon-fiber robotic manipulators for space-grade micro-satellite integration."
  ],
  biotech: [
    "Synthesizing high-purity recombinant proteins for rapid, low-cost vaccine formulation.",
    "Developing organic enzyme catalysts that double the biodegradation rate of single-use industrial polymers."
  ],
  healthtech: [
    "Building wearable photothermal bands for real-time non-invasive blood glucose screening.",
    "Developing a smart diagnostic app that analyzes respiratory audio patterns to detect early pneumonia."
  ],
  agritech: [
    "Manufacturing autonomous weeding drones powered by solar cells and edge-AI weed classification models.",
    "Deploying subterranean multi-spectrum moisture probes to predict regional harvest outputs."
  ],
  fintech: [
    "Pioneering encrypted multi-party computation protocols to prevent fraudulent online transactions.",
    "Creating automated micro-pension distribution architectures tailored for gig economy workers."
  ],
  cleantech: [
    "Developing graphene-stabilized sodium-ion battery cells for low-cost grid energy storage.",
    "Formulating non-toxic bio-solvents to recycle cobalt and lithium from discarded electric vehicles."
  ],
  hardware: [
    "Manufacturing modular IoT telemetry nodes with 10-year battery lifetimes for marine climate research.",
    "Designing smart optical sorting belts that automatically separate recyclable plastics by grade."
  ],
  manufacturing: [
    "Pioneering laser-assisted metal deposition printers to build lightweight aerospace turbine brackets.",
    "Deploying cyber-physical digital twin systems that reduce production line changeover times by 40%."
  ]
};

export default function StartupProfileForm({ profile, onChange, currentLanguage = 'english' }: StartupProfileFormProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.english;
  const [generating, setGenerating] = useState(false);

  const handleChange = (key: keyof StartupProfile, value: any) => {
    onChange({ ...profile, [key]: value });
  };

  const handleGenerateAIPitch = async () => {
    if (!profile.name) {
      alert(
        currentLanguage === 'hindi' 
          ? "कृपया अपनी एआई पिच उत्पन्न करने के लिए पहले अपना स्टार्टअप उद्यम नाम दर्ज करें!" 
          : currentLanguage === 'punjabi'
          ? "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਏਆਈ ਪਿੱਚ ਬਣਾਉਣ ਲਈ ਪਹਿਲਾਂ ਆਪਣੇ ਸਟਾਰਟਅੱਪ ਉੱਦਮ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ!"
          : "Please enter your Startup Venture Name first to generate a custom pitch!"
      );
      return;
    }
    setGenerating(true);
    try {
      const response = await fetch('/api/profile/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          domain: profile.domain,
          stage: profile.stage,
          format: profile.pitchFormat || 'elevator',
          language: profile.pitchLanguage || 'english',
          frequency: profile.updateFrequency || 'on-demand'
        })
      });
      const data = await response.json();
      if (data.success && data.pitch) {
        handleChange('description', data.pitch);
      }
    } catch (err) {
      console.error("Error generating pitch:", err);
    } finally {
      setGenerating(false);
    }
  };

  const domains = [
    { value: 'any', label: t.domainAny },
    { value: 'ai', label: t.domainAi },
    { value: 'deeptech', label: t.domainDeeptech },
    { value: 'biotech', label: t.domainBiotech },
    { value: 'healthtech', label: t.domainHealthtech },
    { value: 'agritech', label: t.domainAgritech },
    { value: 'fintech', label: t.domainFintech },
    { value: 'cleantech', label: t.domainCleantech },
    { value: 'hardware', label: t.domainHardware },
    { value: 'manufacturing', label: t.domainManufacturing },
  ];

  const stages = [
    { value: 'idea', label: t.stageIdea },
    { value: 'prototype', label: t.stageProto },
    { value: 'seed', label: t.stageSeed },
    { value: 'early', label: t.stageEarly },
    { value: 'growth', label: t.stageGrowth },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const pitchFormats = [
    { value: 'elevator', label: currentLanguage === 'hindi' ? 'एलिवेटर पिच (2-वाक्य)' : currentLanguage === 'punjabi' ? 'ਐਲੀਵੇਟਰ ਪਿੱਚ (2-ਵਾਕ)' : 'Elevator Pitch (2-sentence)' },
    { value: 'one-pager', label: currentLanguage === 'hindi' ? 'वन-पेजर सारांश (बुलेट बिंदु)' : currentLanguage === 'punjabi' ? 'ਵਨ-ਪੇਜਰ ਸੰਖੇਪ (ਬੁਲੇਟ ਪੁਆਇੰਟ)' : 'One-Pager Summary (Bullet points)' },
    { value: 'twitter', label: currentLanguage === 'hindi' ? 'ट्विटर/एक्स पोस्ट शैली' : currentLanguage === 'punjabi' ? 'ਟਵਿੱਟਰ/ਐਕਸ ਪੋਸਟ ਸਟਾਈਲ' : 'Twitter/X Post Style' },
    { value: 'investor-hook', label: currentLanguage === 'hindi' ? 'इन्वेस्टर डेक हुक' : currentLanguage === 'punjabi' ? 'ਇਨਵੈਸਟਰ ਡੈੱਕ ਹੁੱਕ' : 'Investor Deck Hook' },
  ];

  const pitchLanguages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिंदी)' },
    { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { value: 'spanish', label: 'Spanish (Español)' },
    { value: 'french', label: 'French (Français)' },
    { value: 'german', label: 'German (Deutsch)' },
    { value: 'japanese', label: 'Japanese (日本語)' },
  ];

  const updateFrequencies = [
    { value: 'on-demand', label: currentLanguage === 'hindi' ? 'मैन्युअल (मांग पर)' : currentLanguage === 'punjabi' ? 'ਮੈਨੂਅਲ (ਮੰਗ ਤੇ)' : 'Manual (On-Demand)' },
    { value: 'weekly', label: currentLanguage === 'hindi' ? 'साप्ताहिक ऑटो-रिफाइन' : currentLanguage === 'punjabi' ? 'ਹਫ਼ਤਾਵਾਰੀ ਆਟੋ-ਰਿਫਾਈਨ' : 'Weekly Auto-Refine' },
    { value: 'monthly', label: currentLanguage === 'hindi' ? 'मासिक अनुपालन जांच' : currentLanguage === 'punjabi' ? 'ਮਾਸਿਕ ਪਾਲਣਾ ਜਾਂਚ' : 'Monthly Compliance Check' },
    { value: 'realtime', label: currentLanguage === 'hindi' ? 'वास्तविक समय मिलान सिंक' : currentLanguage === 'punjabi' ? 'ਰੀਅਲ-ਟਾਈਮ ਮੈਚ ਸਿੰਕ' : 'Real-time Match Sync' },
  ];

  const currentPresets = sectorPresets[profile.domain] || sectorPresets['any'];

  return (
    <div className="bg-[#ECEBE4] border border-[#DEDCCF] rounded-[24px] p-6 shadow-sm relative text-[#1A1A1A] h-auto">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#DEDCCF]">
        <Target className="w-5 h-5 text-[#5A5A40]" />
        <h2 className="font-display font-semibold text-[#4A4A30] text-base">{t.configHeader}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2">
            {t.ventureNameLabel}
          </label>
          <input
            type="text"
            className="w-full bg-white text-[#1A1A1A] text-sm px-4 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition placeholder:text-stone-400/60 placeholder:font-normal"
            placeholder={t.ventureNamePlaceholder}
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2">
              {t.primaryDomainLabel}
            </label>
            <select
              className="w-full bg-white text-[#1A1A1A] text-sm px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition appearance-none"
              value={profile.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
            >
              {domains.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2">
              {t.devStageLabel}
            </label>
            <select
              className="w-full bg-white text-[#1A1A1A] text-sm px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition"
              value={profile.stage}
              onChange={(e) => handleChange('stage', e.target.value)}
            >
              {stages.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2 flex items-center gap-1">
              {t.incorporationYearLabel}
              <div className="group relative cursor-help">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 bg-white text-slate-700 text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-20 border border-[#DEDCCF] font-normal shadow-md">
                  {currentLanguage === 'hindi' 
                    ? 'DPIIT प्रमाणन और < 10 वर्ष की कानूनी उम्र की आवश्यकता।' 
                    : currentLanguage === 'punjabi'
                    ? 'DPIIT ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ < 10 ਸਾਲ ਦੀ ਕਾਨੂੰਨੀ ਉਮਰ ਦੀ ਲੋੜ।'
                    : 'Requires DPIIT recognition and < 10 years of operational history.'}
                </span>
              </div>
            </label>
            <select
              className="w-full bg-white text-[#1A1A1A] text-sm px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition"
              value={profile.incorporationYear}
              onChange={(e) => handleChange('incorporationYear', parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2">
              {t.externalFundingLabel}
            </label>
            <input
              type="number"
              className="w-full bg-white text-[#1A1A1A] text-sm px-4 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition placeholder:text-stone-400/60 placeholder:font-normal"
              placeholder="e.g. 500000"
              value={profile.currentFunding === 0 ? '' : profile.currentFunding}
              onChange={(e) => handleChange('currentFunding', Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider mb-2">
            {t.locationLabel}
          </label>
          <input
            type="text"
            className="w-full bg-white text-[#1A1A1A] text-sm px-4 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition placeholder:text-stone-400/60 placeholder:font-normal"
            placeholder={t.locationPlaceholder}
            value={profile.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        {/* Pitch Customization Options */}
        <div className="bg-[#FAF9F5] border border-[#DEDCCF] rounded-xl p-3 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#5A5A40]" />
            <span>
              {currentLanguage === 'hindi' ? 'एआई पिच सेटिंग्स' : currentLanguage === 'punjabi' ? 'ਏਆਈ ਪਿੱਚ ਸੈਟਿੰਗਜ਼' : 'AI Pitch Settings'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-semibold text-[#5A5A40] uppercase tracking-wider mb-1">
                {currentLanguage === 'hindi' ? 'प्रारूप' : currentLanguage === 'punjabi' ? 'ਫਾਰਮੈਟ' : 'Format'}
              </label>
              <select
                className="w-full bg-white text-[#1A1A1A] text-xs px-2 py-1.5 rounded-lg border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition"
                value={profile.pitchFormat || 'elevator'}
                onChange={(e) => handleChange('pitchFormat', e.target.value)}
              >
                {pitchFormats.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-semibold text-[#5A5A40] uppercase tracking-wider mb-1">
                {currentLanguage === 'hindi' ? 'अपडेट आवृत्ति' : currentLanguage === 'punjabi' ? 'ਅੱਪਡੇਟ ਬਾਰੰਬਾਰਤਾ' : 'Update Frequency'}
              </label>
              <select
                className="w-full bg-white text-[#1A1A1A] text-xs px-2 py-1.5 rounded-lg border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition"
                value={profile.updateFrequency || 'on-demand'}
                onChange={(e) => handleChange('updateFrequency', e.target.value)}
              >
                {updateFrequencies.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-[#5A5A40] uppercase tracking-wider">
              {t.pitchLabel}
            </label>
            <button
              type="button"
              onClick={handleGenerateAIPitch}
              disabled={generating || !profile.name}
              className="flex items-center gap-1.5 text-[10px] bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-2 py-1 rounded-lg font-bold tracking-wide uppercase transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Generate professional pitch using IBM Watsonx"
            >
              {generating ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>{generating ? t.generatingPitchBtn : t.generatePitchBtn}</span>
            </button>
          </div>
          <textarea
            className="w-full bg-white text-[#1A1A1A] text-sm px-4 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition resize-none h-40 placeholder:text-stone-400/60 placeholder:font-normal"
            placeholder={t.pitchPlaceholder}
            value={profile.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          {/* Presets segment */}
          <div className="mt-3">
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> {currentLanguage === 'hindi' ? 'सेक्टर टेम्पलेट चुनें:' : currentLanguage === 'punjabi' ? 'ਸੈਕਟਰ ਟੈਂਪਲੇਟ ਚੁਣੋ:' : 'Choose sector template:'}
            </span>
            <div className="space-y-1.5">
              {currentPresets.map((preset, index) => (
                <button
                   key={index}
                  type="button"
                  onClick={() => handleChange('description', preset)}
                  className="w-full text-left bg-white/75 hover:bg-white text-[10.5px] text-[#4A4A30] p-2 rounded-lg border border-[#DEDCCF] hover:border-[#5A5A40] transition cursor-pointer leading-relaxed font-mono shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
