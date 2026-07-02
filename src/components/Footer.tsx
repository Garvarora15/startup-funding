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
    <footer id="app-footer" className="bg-[#08302A] text-[#D9F0E8] border-t border-[#23574B] mt-12">
      <div className="max-w-[1536px] mx-auto px-6 py-12 md:py-16">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0E332C] border border-[#0E332C]">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-display italic font-bold text-xl tracking-tight text-[#0E332C]">Startup Funding Hub</span>
              <span className="bg-[#0E332C] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border border-[#0E332C]">
                IBM Granite
              </span>
            </div>
            
            <p className="text-xs text-[#8FC9B6] leading-relaxed font-sans max-w-md">
              {getAboutText()}
            </p>
          </div>

          {/* Column 2: Technology & Engine */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7DB8A5] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>SYSTEM ARCHITECTURE</span>
            </h4>
            <div className="space-y-2 text-xs font-mono text-white">
              <div className="flex items-center gap-2 bg-[#0E332C] px-3 py-2 rounded-lg border border-[#0E332C]">
                <Globe className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>NLU: <strong className="text-[#14B8A6]">Watson NLU Analysed</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E332C] px-3 py-2 rounded-lg border border-[#0E332C]">
                <Cpu className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>LLM Backend: <strong className="text-[#14B8A6]">Granite-4-H-Small</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E332C] px-3 py-2 rounded-lg border border-[#0E332C]">
                <Terminal className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Agent Layer: <strong className="text-[#14B8A6]">Watsonx Orchestrate Ready</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E332C] px-3 py-2 rounded-lg border border-[#0E332C]">
                <Shield className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Guardrail: <strong className="text-[#14B8A6]">Compliance Layer Active</strong></span>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Creator */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7DB8A5]">
              {getContactText()}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-[#D9F0E8]">
                <Mail className="w-4 h-4 text-[#7DB8A5]" />
                <a href="mailto:garv26arora@gmail.com" className="hover:underline hover:text-[#0E332C] transition">
                  garv26arora@gmail.com
                </a>
              </li>
              <li className="pt-2 border-t border-[#23574B] text-[#8FC9B6] leading-relaxed font-sans">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Created by</span>
                  <strong className="text-[#0E332C] font-semibold">Garv Arora</strong>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline animate-pulse" />
                </div>
                <p className="text-[10px] text-[#7DB8A5] font-mono mt-1">
                  Full Stack Engineer & AI Innovator
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Links */}
        <div className="pt-8 border-t border-[#23574B] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-[10px] font-mono text-[#7DB8A5] tracking-wide">
            © {currentYear} STARTUP FUNDING HUB. DESIGNED & DEVELOPED BY <span className="text-[#0E332C] font-bold">GARV ARORA</span>.
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#7DB8A5]">
            <button 
              onClick={() => onOpenPolicy('privacy')} 
              className="hover:text-[#0E332C] transition cursor-pointer font-mono text-[10px] bg-transparent border-none p-0 outline-none"
            >
              PRIVACY POLICY
            </button>
            <span>●</span>
            <button 
              onClick={() => onOpenPolicy('cookies')} 
              className="hover:text-[#0E332C] transition cursor-pointer font-mono text-[10px] bg-transparent border-none p-0 outline-none"
            >
              COOKIE POLICY
            </button>
            <span>●</span>
            <button 
              onClick={() => onOpenPolicy('terms')} 
              className="hover:text-[#0E332C] transition cursor-pointer font-mono text-[10px] bg-transparent border-none p-0 outline-none"
            >
              TERMS OF SERVICE
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
