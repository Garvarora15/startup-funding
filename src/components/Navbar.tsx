import { useState, useEffect } from 'react';
import { Cpu, Wifi, Clock, Globe, Shield, Network, Zap } from 'lucide-react';

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
    <nav className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800 border-b border-indigo-900/40 py-3.5 px-6 flex justify-between items-center relative z-10 shadow-lg flex-wrap gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
          <Cpu className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-700 animate-glow" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-extrabold text-xl text-white tracking-tight">
              Startup Funding Hub
            </span>
            <span className="bg-white/20 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full tracking-widest uppercase border border-white/30 shadow-sm">
              IBM Granite
            </span>
          </div>
          <p className="text-[10px] text-indigo-200 font-sans tracking-wide flex items-center gap-1 mt-0.5">
            <Zap className="w-2.5 h-2.5" />
            Watsonx.ai Grant & Seed Funding Strategist
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-2.5 text-xs font-mono flex-wrap">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/25 text-white backdrop-blur-sm hover:bg-white/20 transition">
          <Globe className="w-3.5 h-3.5 text-indigo-200" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-xs font-sans cursor-pointer font-semibold"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="text-slate-800 bg-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-white/25 text-white backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5 text-indigo-200" />
          <span className="text-white font-semibold">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/40 text-white backdrop-blur-sm">
          <Wifi className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span className="text-emerald-100">LLM: <strong className="text-emerald-300">ACTIVE</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-400/40 text-white backdrop-blur-sm">
          <Network className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-cyan-100">Orchestrate: <strong className="text-cyan-300">READY</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-violet-500/20 px-3 py-1.5 rounded-xl border border-violet-400/40 text-white backdrop-blur-sm">
          <Shield className="w-3.5 h-3.5 text-violet-300" />
          <span className="text-violet-100">Guardrail: <strong className="text-violet-300">ON</strong></span>
        </div>
      </div>
    </nav>
  );
}
