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
  ],
  edtech: [
    "Building an adaptive AI tutoring platform that personalizes K-12 curriculum pathways using real-time learning analytics.",
    "Developing offline-first vernacular e-learning modules to bring certified skill training to tier-3 and tier-4 towns."
  ],
  spacetech: [
    "Engineering low-cost miniaturized propulsion systems for nanosatellite constellations supporting rural connectivity.",
    "Building AI-powered satellite imagery analytics to forecast crop health and water stress across river basins."
  ],
  mobility: [
    "Designing swappable battery-infrastructure networks to accelerate last-mile electric two- and three-wheeler adoption.",
    "Developing predictive fleet-management software that cuts EV downtime through battery-health telemetry and routing."
  ],
  ecommerce: [
    "Building a vernacular-first D2C marketplace connecting rural artisans directly with urban consumers via social commerce.",
    "Developing AI-driven hyperlocal delivery routing to cut last-mile logistics costs for small D2C brands."
  ],
  gaming: [
    "Building a mobile-first multiplayer gaming studio blending Indian folklore IP with competitive esports mechanics.",
    "Developing AVGC tooling that lets independent animators produce broadcast-quality VFX on consumer-grade hardware."
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
      alert(t.enterNameFirstAlert);
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
    { value: 'edtech', label: t.domainEdtech },
    { value: 'spacetech', label: t.domainSpacetech },
    { value: 'mobility', label: t.domainMobility },
    { value: 'ecommerce', label: t.domainEcommerce },
    { value: 'gaming', label: t.domainGaming },
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
    { value: 'elevator', label: t.formatElevator },
    { value: 'one-pager', label: t.formatOnePager },
    { value: 'twitter', label: t.formatTwitter },
    { value: 'investor-hook', label: t.formatInvestor },
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
    { value: 'on-demand', label: t.freqManual },
    { value: 'weekly', label: t.freqWeekly },
    { value: 'monthly', label: t.monthlyComplianceCheck },
    { value: 'realtime', label: t.realtimeMatchSync },
  ];

  const currentPresets = sectorPresets[profile.domain] || sectorPresets['any'];

  const inputCls = "w-full bg-white text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition placeholder:text-slate-400";
  const selectCls = "w-full bg-white text-slate-700 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition";
  const labelCls = "block text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm relative text-slate-800 h-auto overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full opacity-60 pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-indigo-100 relative">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Target className="w-4 h-4 text-indigo-600" />
        </div>
        <h2 className="font-display font-bold text-slate-800 text-base">{t.configHeader}</h2>
      </div>

      <div className="space-y-4 relative">
        <div>
          <label className={labelCls}>{t.ventureNameLabel}</label>
          <input
            type="text"
            className={inputCls}
            placeholder={t.ventureNamePlaceholder}
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.primaryDomainLabel}</label>
            <select className={selectCls} value={profile.domain} onChange={(e) => handleChange('domain', e.target.value)}>
              {domains.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.devStageLabel}</label>
            <select className={selectCls} value={profile.stage} onChange={(e) => handleChange('stage', e.target.value)}>
              {stages.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`${labelCls} flex items-center gap-1`}>
              {t.incorporationYearLabel}
              <div className="group relative cursor-help">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-20 font-normal shadow-lg leading-relaxed">
                  {t.incorporationYearTooltip}
                </span>
              </div>
            </label>
            <select className={selectCls} value={profile.incorporationYear} onChange={(e) => handleChange('incorporationYear', parseInt(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.externalFundingLabel}</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 500000"
              value={profile.currentFunding === 0 ? '' : profile.currentFunding}
              onChange={(e) => handleChange('currentFunding', Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>{t.locationLabel}</label>
          <input
            type="text"
            className={inputCls}
            placeholder={t.locationPlaceholder}
            value={profile.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        {/* AI Pitch Settings */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>{t.aiPitchSettings}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">{t.formatLabel}</label>
              <select className="w-full bg-white text-slate-700 text-xs px-2 py-1.5 rounded-lg border border-indigo-100 focus:outline-none focus:border-indigo-400 transition" value={profile.pitchFormat || 'elevator'} onChange={(e) => handleChange('pitchFormat', e.target.value)}>
                {pitchFormats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">{t.updateFrequency}</label>
              <select className="w-full bg-white text-slate-700 text-xs px-2 py-1.5 rounded-lg border border-indigo-100 focus:outline-none focus:border-indigo-400 transition" value={profile.updateFrequency || 'on-demand'} onChange={(e) => handleChange('updateFrequency', e.target.value)}>
                {updateFrequencies.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={labelCls}>{t.pitchLabel}</label>
            <button
              type="button"
              onClick={handleGenerateAIPitch}
              disabled={generating || !profile.name}
              className="flex items-center gap-1.5 text-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-2.5 py-1 rounded-lg font-bold tracking-wide uppercase transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              title="Generate professional pitch using IBM Watsonx"
            >
              {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>{generating ? t.generatingPitchBtn : t.generatePitchBtn}</span>
            </button>
          </div>
          <textarea
            className="w-full bg-white text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition resize-none h-40 placeholder:text-slate-400"
            placeholder={t.pitchPlaceholder}
            value={profile.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          {/* Presets segment */}
          <div className="mt-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> {t.chooseSectorTemplate}
            </span>
            <div className="space-y-1.5">
              {currentPresets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange('description', preset)}
                  className="w-full text-left bg-indigo-50/60 hover:bg-indigo-50 text-[10.5px] text-indigo-800 p-2.5 rounded-xl border border-indigo-100 hover:border-indigo-300 transition cursor-pointer leading-relaxed font-mono shadow-sm"
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
