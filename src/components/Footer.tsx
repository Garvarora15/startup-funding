import { Mail, Shield, ShieldAlert, Heart, Terminal, Cpu, Globe, ExternalLink } from 'lucide-react';

interface FooterProps {
  currentLanguage: string;
  onOpenPolicy: (type: 'privacy' | 'cookies' | 'terms') => void;
}

export default function Footer({ currentLanguage, onOpenPolicy }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const getAboutText = () => {
    switch (currentLanguage) {
      case 'hindi':
        return 'Startup Funding Hub भारतीय उद्यमियों और नवप्रवर्तकों के लिए बनाया गया एक उच्च-सटीकता वाला अनुदान खोज इंजन है। IBM Granite और Watsonx.ai द्वारा संचालित, यह वास्तविक समय में सरकारी योजनाओं और सीड फंडिंग का मिलान करता है।';
      case 'punjabi':
        return 'Startup Funding Hub ਭਾਰਤੀ ਉੱਦਮੀਆਂ ਅਤੇ ਨਵੀਨਤਾਕਾਰਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ ਇੱਕ ਉੱਚ-ਸ਼ੁੱਧਤਾ ਵਾਲਾ ਗ੍ਰਾਂਟ ਖੋਜ ਇੰਜਣ ਹੈ। IBM Granite ਅਤੇ Watsonx.ai ਦੁਆਰਾ ਸੰਚਾਲਿਤ, ਇਹ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸੀਡ ਫੰਡਿੰਗ ਦਾ ਮਿਲਾਨ ਕਰਦਾ ਹੈ।';
      default:
        return 'Startup Funding Hub is a high-fidelity startup grant discovery engine engineered for Indian founders and early-stage innovators. Powered by IBM Granite on Watsonx.ai, it delivers precise real-time matching and contextual alignment for government schemes and seed funding.';
    }
  };

  const getContactText = () => {
    switch (currentLanguage) {
      case 'hindi':
        return 'संपर्क और सहायता';
      case 'punjabi':
        return 'ਸੰਪਰਕ ਅਤੇ ਸਹਾਇਤਾ';
      default:
        return 'Contact & Support';
    }
  };

  return (
    <footer id="app-footer" className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 text-white border-t border-indigo-800/50 mt-12">
      <div className="max-w-[1536px] mx-auto px-6 py-12 md:py-16">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 border border-white/25 shadow-sm">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">Startup Funding Hub</span>
              <span className="bg-white/20 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-white/30">
                IBM Granite
              </span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed font-sans max-w-md">
              {getAboutText()}
            </p>
          </div>

          {/* Column 2: Technology & Engine */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>SYSTEM ARCHITECTURE</span>
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/15 transition">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-indigo-100">NLU: <strong className="text-emerald-300">Watson NLU Analysed</strong></span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/15 transition">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-indigo-100">LLM: <strong className="text-cyan-300">Granite-4-H-Small</strong></span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/15 transition">
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-indigo-100">Agent: <strong className="text-violet-300">Watsonx Orchestrate Ready</strong></span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/15 transition">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-indigo-100">Guardrail: <strong className="text-amber-300">Compliance Layer Active</strong></span>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Creator */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              {getContactText()}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-indigo-100">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-3 h-3 text-indigo-300" />
                </div>
                <a href="mailto:garv26arora@gmail.com" className="hover:text-white hover:underline transition">
                  garv26arora@gmail.com
                </a>
              </li>
              <li className="pt-2 border-t border-white/10 text-indigo-200 leading-relaxed font-sans">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Created by</span>
                  <strong className="text-white font-bold">Garv Arora</strong>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline animate-pulse" />
                </div>
                <p className="text-[10px] text-indigo-400 font-mono mt-1 tracking-wide">
                  Full Stack Engineer & AI Innovator
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-[10px] font-mono text-indigo-400 tracking-wide">
            © {currentYear} STARTUP FUNDING HUB · DESIGNED & DEVELOPED BY <span className="text-white font-bold">GARV ARORA</span>
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-indigo-400">
            {(['privacy', 'cookies', 'terms'] as const).map((type, i, arr) => (
              <span key={type} className="flex items-center gap-4">
                <button
                  onClick={() => onOpenPolicy(type)}
                  className="hover:text-white transition cursor-pointer font-mono text-[10px] bg-transparent border-none p-0 outline-none uppercase tracking-wider"
                >
                  {type === 'privacy' ? 'PRIVACY POLICY' : type === 'cookies' ? 'COOKIE POLICY' : 'TERMS OF SERVICE'}
                </button>
                {i < arr.length - 1 && <span className="text-indigo-600">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
