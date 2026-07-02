import { useState, useEffect } from 'react';
import { Cpu, Wifi, Clock, Globe, Shield, Network } from 'lucide-react';

interface NavbarProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function Navbar({ currentLanguage, onLanguageChange }: NavbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिंदी)' },
    { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { value: 'spanish', label: 'Spanish (Español)' },
    { value: 'french', label: 'French (Français)' },
    { value: 'german', label: 'German (Deutsch)' },
    { value: 'japanese', label: 'Japanese (日本語)' }
  ];

  return (
    <nav className="bg-[#4535D0] border-b border-white/15 py-3.5 px-6 flex justify-between items-center relative z-10 flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#000054] border border-[#000054] shadow-sm transition-transform duration-300 hover:scale-110 hover:rotate-3">
          <Cpu className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#14B8A6] rounded-full border-2 border-[#4535D0] animate-ping" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#14B8A6] rounded-full border-2 border-[#4535D0]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display italic font-bold text-xl text-white tracking-tight">Startup Funding Hub</span>
            <span className="bg-[#000054] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-[#000054]">
              IBM Granite
            </span>
          </div>
          <p className="text-[10px] text-white/70 font-sans tracking-wide">
            Watsonx.ai Grant & Seed Funding Strategist
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-[#000054] px-2 py-1 rounded-lg border border-[#000054] text-white transition-colors duration-200 hover:bg-[#3D3DAD]">
          <Globe className="w-3.5 h-3.5 text-white/90" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-xs font-sans cursor-pointer font-medium"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="text-slate-100 bg-[#000054]">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#000054] px-3 py-1.5 rounded-lg border border-[#000054] text-white transition-colors duration-200 hover:bg-[#3D3DAD]">
          <Clock className="w-3.5 h-3.5 text-white/90" />
          <span>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#000054] px-3 py-1.5 rounded-lg border border-[#000054] text-white transition-colors duration-200 hover:bg-[#3D3DAD]">
          <Wifi className="w-3.5 h-3.5 text-[#14B8A6] animate-pulse" />
          <span>Watsonx LLM: <strong className="text-[#14B8A6]">ACTIVE</strong></span>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-[#000054] px-3 py-1.5 rounded-lg border border-[#000054] text-white transition-colors duration-200 hover:bg-[#3D3DAD]">
          <Network className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Orchestrate: <strong className="text-[#14B8A6]">READY</strong></span>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-[#000054] px-3 py-1.5 rounded-lg border border-[#000054] text-white transition-colors duration-200 hover:bg-[#3D3DAD]">
          <Shield className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Guardrail: <strong className="text-[#14B8A6]">ACTIVE</strong></span>
        </div>
      </div>
    </nav>
  );
}
