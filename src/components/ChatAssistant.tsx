import { useState, useRef, useEffect } from 'react';
import { ChatMessage, StartupProfile } from '../types';
import { Send, Bot, User, Sparkles, Terminal, Volume2, Square, Mic, MicOff } from 'lucide-react';
import { TRANSLATIONS } from '../locales/translations';

interface ChatAssistantProps {
  startupProfile: StartupProfile;
  onSelectGrantFromChat: (grantName: string) => void;
  currentLanguage?: string;
}

function parseMarkdownToHtml(markdown: string) {
  if (!markdown) return '';
  const lines = markdown.split('\n');
  let inList = false;
  let inCodeBlock = false;
  
  const htmlLines = lines.map(line => {
    let trimmed = line.trim();
    
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return inCodeBlock ? '<pre class="bg-[#F5F5F0] text-[#4A4A30] p-3 rounded-xl border border-[#DEDCCF] font-mono text-[11px] overflow-x-auto my-2">' : '</pre>';
    }
    if (inCodeBlock) return trimmed;

    if (trimmed.startsWith('#### ')) return `<h5 class="font-display font-semibold text-[#4A4A30] text-xs uppercase tracking-wider mt-4 mb-2">${trimmed.replace('#### ', '')}</h5>`;
    if (trimmed.startsWith('### ')) return `<h4 class="font-display font-semibold text-[#5A5A40] text-sm mt-5 mb-2">${trimmed.replace('### ', '')}</h4>`;
    if (trimmed.startsWith('## ')) return `<h3 class="font-display font-bold text-[#1A1A1A] text-base mt-6 mb-3 border-b border-[#DEDCCF] pb-1">${trimmed.replace('## ', '')}</h3>`;
    if (trimmed.startsWith('# ')) return `<h2 class="font-display font-bold text-[#1A1A1A] text-lg mt-6 mb-3">${trimmed.replace('# ', '')}</h2>`;

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      let content = trimmed.substring(2);
      let listPrefix = '';
      if (!inList) { inList = true; listPrefix = '<ul class="list-disc pl-5 space-y-1.5 my-2 text-xs text-slate-800">'; }
      return `${listPrefix}<li class="leading-normal">${parseInlineMarkdown(content)}</li>`;
    } else {
      let listSuffix = '';
      if (inList) { inList = false; listSuffix = '</ul>'; }
      if (trimmed === '') return listSuffix + '<div class="h-2"></div>';
      return listSuffix + `<p class="leading-relaxed text-xs text-slate-800 mb-3">${parseInlineMarkdown(line)}</p>`;
    }
  });

  return htmlLines.join('\n');
}

function parseInlineMarkdown(text: string) {
  let formatted = text;
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#4A4A30]">$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>');
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-[#F0F0E8] text-[#5A5A40] px-1.5 py-0.5 rounded font-mono text-[11px]">$1</code>');
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#5A5A40] hover:underline font-semibold inline-flex items-center gap-0.5">$1 <span class="text-[9px]">↗</span></a>');
  return formatted;
}

export default function ChatAssistant({ startupProfile, onSelectGrantFromChat, currentLanguage = 'english' }: ChatAssistantProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.english;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am the **IBM Granite AI Funding Strategist**.\n\nI am connected to Watsonx.ai and equipped with detailed knowledge on 30 Indian government, institutional seed funding, and academic research/study schemes.\n\nFill out your **Startup Profile** on the left, and I can dynamically match schemes for your venture, explain your eligibility, or help you draft highly competitive proposals.\n\n**What would you like to explore today?**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reasoningLogs, setReasoningLogs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const startSpeechTextRef = useRef('');

  const [ttsMsgId, setTtsMsgId] = useState<string | null>(null);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [audioTts, setAudioTts] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.onstart = () => setIsListening(true);
        rec.onresult = (event: any) => {
          let totalFinal = '';
          let totalInterim = '';
          for (let i = 0; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) totalFinal += transcript + ' ';
            else totalInterim += transcript;
          }
          const speechPart = (totalFinal + totalInterim).trim();
          setInput(startSpeechTextRef.current + speechPart);
        };
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioTts) audioTts.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [audioTts]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const prefix = input ? input.trim() + ' ' : '';
      startSpeechTextRef.current = prefix;
      recognitionRef.current.lang = currentLanguage === 'hindi' ? 'hi-IN' : currentLanguage === 'punjabi' ? 'pa-IN' : 'en-US';
      recognitionRef.current.start();
    }
  };

  const speakMessage = async (msgId: string, text: string) => {
    if (isPlayingTts && ttsMsgId === msgId) {
      if (audioTts) audioTts.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingTts(false);
      setTtsMsgId(null);
      return;
    }
    if (audioTts) audioTts.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setTtsMsgId(msgId);
    setIsPlayingTts(true);

    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1');

    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanedText, language: currentLanguage })
      });
      const data = await response.json();
      if (data.success && data.audioContent) {
        const newAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        newAudio.onended = () => { setIsPlayingTts(false); setTtsMsgId(null); };
        newAudio.onerror = () => fallbackWebSpeechChat(cleanedText, msgId);
        setAudioTts(newAudio);
        newAudio.play();
      } else {
        fallbackWebSpeechChat(cleanedText, msgId);
      }
    } catch {
      fallbackWebSpeechChat(cleanedText, msgId);
    }
  };

  const fallbackWebSpeechChat = (textToSpeak: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlayingTts(false); setTtsMsgId(null); return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = currentLanguage === 'hindi' ? 'hi-IN' : currentLanguage === 'punjabi' ? 'pa-IN' : 'en-US';
    utterance.onend = () => { setIsPlayingTts(false); setTtsMsgId(null); };
    utterance.onerror = () => { setIsPlayingTts(false); setTtsMsgId(null); };
    setIsPlayingTts(true);
    setTtsMsgId(msgId);
    window.speechSynthesis.speak(utterance);
    setAudioTts({ pause: () => { window.speechSynthesis.cancel(); setIsPlayingTts(false); setTtsMsgId(null); } } as any);
  };

  useEffect(() => {
    setMessages(prev => prev.map(m => {
      if (m.id === 'welcome') {
        const welcomeText = currentLanguage === 'hindi'
          ? `नमस्ते! मैं आपका **IBM Granite एआई फंडिंग रणनीतिकार** हूँ।\n\nमैं Watsonx.ai से जुड़ा हूँ और 30 भारतीय सरकारी, संस्थागत और शैक्षणिक योजनाओं की विस्तृत जानकारी से सुसज्जित हूँ।\n\nबाईं ओर अपना **स्टार्टअप प्रोफ़ाइल** भरें और मैं आपके लिए योजनाएं खोजूंगा।\n\n**आज आप क्या तलाशना चाहेंगे?**`
          : currentLanguage === 'punjabi'
          ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ **IBM Granite AI ਫੰਡਿੰਗ ਰਣਨੀਤੀਕਾਰ** ਹਾਂ।\n\nਮੈਂ Watsonx.ai ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹਾਂ।\n\nਖੱਬੇ ਪਾਸੇ ਆਪਣਾ **ਸਟਾਰਟਅੱਪ ਪ੍ਰੋਫਾਈਲ** ਭਰੋ।\n\n**ਅੱਜ ਤੁਸੀਂ ਕੀ ਖੋਜਣਾ ਚਾਹੋਗੇ?**`
          : `Hello! I am the **IBM Granite AI Funding Strategist**.\n\nI am connected to Watsonx.ai and equipped with detailed knowledge on 30 Indian government, institutional seed funding, and academic research/study schemes.\n\nFill out your **Startup Profile** on the left, and I can dynamically match schemes for your venture, explain your eligibility, or help you draft highly competitive proposals.\n\n**What would you like to explore today?**`;
        return { ...m, content: welcomeText };
      }
      return m;
    }));
  }, [currentLanguage]);

  // 10 useful quick prompts
  const quickPrompts = [
    { text: "Match grants for my profile", icon: "✨" },
    { text: "Find women entrepreneur grants", icon: "👩" },
    { text: "Deep tech & Biotech grants", icon: "🧬" },
    { text: currentLanguage === 'hindi' ? "₹25L+ सीमा के साथ सीड फंड" : currentLanguage === 'punjabi' ? "₹25L+ ਸੀਮਾ ਦੇ ਨਾਲ ਸੀਡ ਫੰਡ" : "Seed funds with ₹25L+ limits", icon: "💰" },
    { text: currentLanguage === 'hindi' ? "SISFS के लिए पात्रता जांचें" : currentLanguage === 'punjabi' ? "SISFS ਲਈ ਯੋਗਤਾ ਜਾਂਚੋ" : "Check my SISFS eligibility", icon: "🏛️" },
    { text: currentLanguage === 'hindi' ? "BIRAC के लिए कैसे आवेदन करें?" : currentLanguage === 'punjabi' ? "BIRAC ਲਈ ਕਿਵੇਂ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ?" : "How to apply for BIRAC grants?", icon: "🔬" },
    { text: currentLanguage === 'hindi' ? "AI स्टार्टअप के लिए शीर्ष अनुदान" : currentLanguage === 'punjabi' ? "AI ਸਟਾਰਟਅੱਪ ਲਈ ਚੋਟੀ ਦੀਆਂ ਗ੍ਰਾਂਟਾਂ" : "Top grants for AI startups", icon: "🤖" },
    { text: currentLanguage === 'hindi' ? "DPIIT मान्यता कैसे प्राप्त करें?" : currentLanguage === 'punjabi' ? "DPIIT ਮਾਨਤਾ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ?" : "How to get DPIIT recognition?", icon: "📋" },
    { text: currentLanguage === 'hindi' ? "मेरे स्टार्टअप के लिए प्रस्ताव बनाएं" : currentLanguage === 'punjabi' ? "ਮੇਰੇ ਸਟਾਰਟਅੱਪ ਲਈ ਪ੍ਰਸਤਾਵ ਬਣਾਓ" : "Draft a grant proposal for my startup", icon: "📝" },
    { text: currentLanguage === 'hindi' ? "राज्य-स्तरीय फंडिंग योजनाएं" : currentLanguage === 'punjabi' ? "ਰਾਜ-ਪੱਧਰੀ ਫੰਡਿੰਗ ਯੋਜਨਾਵਾਂ" : "State-level startup funding schemes", icon: "🗺️" },
  ];

  const scrollBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollBottom(); }, [messages, loading, reasoningLogs]);

  const simulateReasoning = async () => {
    const logs = currentLanguage === 'hindi' ? [
      "🔄 Watsonx.ai IBM ग्रेनाइट इन्फरेंस कंटेनर प्रारंभ किया जा रहा है...",
      "📂 भारतीय स्टार्टअप फंडिंग ज्ञानकोश (30 सक्रिय योजनाएं) लोड किया जा रहा है...",
      `🏢 प्रसंग लॉक: '${startupProfile.name || 'अनाम'}' '${startupProfile.domain}' क्षेत्र में स्टार्टअप...`,
      "🧠 DPIIT मान्यता, आयु प्रतिबंध और वित्तीय सीमाओं का विश्लेषण...",
      "⚖️ समानता के माध्यम से अनुकूल योजनाओं की रैंकिंग...",
      "📝 प्रासंगिक, उच्च-प्रभाव रणनीतिक फीडबैक उत्पन्न किया जा रहा है..."
    ] : currentLanguage === 'punjabi' ? [
      "🔄 Watsonx.ai IBM ਗ੍ਰੇਨਾਈਟ ਇਨਫਰੈਂਸ ਕੰਟੇਨਰ ਚਾਲੂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      "📂 ਭਾਰਤੀ ਸਟਾਰਟਅੱਪ ਫੰਡਿੰਗ ਗਿਆਨਕੋਸ਼ (30 ਸਰਗਰਮ ਯੋਜਨਾਵਾਂ) ਲੋਡ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      `🏢 ਪ੍ਰਸੰਗ ਲਾਕ: '${startupProfile.name || 'ਅਨਾਮ'}' '${startupProfile.domain}' ਖੇਤਰ ਵਿੱਚ ਸਟਾਰਟਅੱਪ...`,
      "🧠 DPIIT ਮਾਨਤਾ, ਉਮਰ ਦੀਆਂ ਪਾਬੰਦੀਆਂ ਅਤੇ ਵਿੱਤੀ ਸੀਮਾਵਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...",
      "⚖️ ਸਮਾਨਤਾ ਰਾਹੀਂ ਅਨੁਕੂਲ ਯੋਜਨਾਵਾਂ ਦੀ ਰੈਂਕਿੰਗ...",
      "📝 ਪ੍ਰਸੰਗਿਕ, ਉੱਚ-ਪ੍ਰਭਾਵ ਰਣਨੀਤਕ ਫੀਡਬੈਕ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ..."
    ] : [
      "🔄 Initializing Watsonx.ai IBM Granite inference container...",
      "📂 Loading Indian Startup Funding Knowledge Base (30 active schemes)...",
      `🏢 Context locked: Startup '${startupProfile.name || 'Anonymous'}' in '${startupProfile.domain}' domain...`,
      "🧠 Analysing DPIIT recognition, age constraints, and funding thresholds...",
      "⚖️ Ranking matching schemes via cosine semantic embedding similarity...",
      "📝 Generating contextualized, high-impact strategical feedback..."
    ];

    setReasoningLogs([]);
    for (let i = 0; i < logs.length; i++) {
      setReasoningLogs(prev => [...prev, logs[i]]);
      await new Promise(res => setTimeout(res, 400));
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    await simulateReasoning();

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
          startupProfile,
          language: currentLanguage
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          id: `agent-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **System Error**: ${err.message || "Watsonx agent unavailable. Please check credentials."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
      setReasoningLogs([]);
    }
  };

  return (
    <div className="bg-white border border-[#DEDCCF] rounded-2xl shadow-sm flex flex-col h-[780px] relative overflow-hidden">

      {/* Header */}
      <div className="bg-[#F0F0E8] border-b border-[#DEDCCF] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ECEBE4] border border-[#DEDCCF] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-[#4A4A30] text-xs uppercase tracking-wider">
              {t.copilotTitle || "IBM Granite Watsonx.ai Co-Pilot"}
            </h3>
            <p className="text-[10px] text-[#10B981] font-mono flex items-center gap-1 mt-0.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
              {currentLanguage === 'hindi' ? 'ऑनलाइन' : currentLanguage === 'punjabi' ? 'ਔਨਲਾਈਨ' : 'Online'} &bull; granite-4-h-small
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ECEBE4] px-2.5 py-1 rounded-full text-[10px] font-mono text-[#4A4A30] border border-[#DEDCCF]">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{currentLanguage === 'hindi' ? 'कॉग्निटिव कोर' : currentLanguage === 'punjabi' ? 'ਕੋਗਨਿਟਿਵ ਕੋਰ' : 'Watsonx Cognitive Core'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[#F5F5F0]/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border text-xs font-mono font-bold ${msg.role === 'user' ? 'bg-[#5A5A40] border-transparent text-white' : 'bg-[#F0F0E8] border-[#DEDCCF] text-[#5A5A40]'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="space-y-1">
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#5A5A40] text-white rounded-tr-none border border-[#4A4A30]/15 shadow-sm' : 'bg-white text-slate-800 rounded-tl-none border border-[#DEDCCF] shadow-sm'}`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-xs leading-normal text-slate-800" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(msg.content) }} />
                )}
              </div>
              <div className="flex items-center justify-between gap-4 mt-1.5 min-w-[120px]">
                {msg.role === 'assistant' ? (
                  <button type="button" onClick={() => speakMessage(msg.id, msg.content)} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-[#5A5A40] hover:text-[#4A4A30] hover:bg-[#ECEBE4]/50 font-mono font-bold transition cursor-pointer">
                    {isPlayingTts && ttsMsgId === msg.id ? (
                      <><Square className="w-2.5 h-2.5 fill-[#5A5A40] text-[#5A5A40]" /><span>{currentLanguage === 'hindi' ? 'रोकें' : currentLanguage === 'punjabi' ? 'ਰੋਕੋ' : 'Stop'}</span></>
                    ) : (
                      <><Volume2 className="w-3.5 h-3.5" /><span>{currentLanguage === 'hindi' ? 'सुनें' : currentLanguage === 'punjabi' ? 'ਸੁਣੋ' : 'Listen'}</span></>
                    )}
                  </button>
                ) : <div />}
                <span className="block text-[9px] text-[#8E8E80] font-mono shrink-0 ml-auto">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Reasoning Logs */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-[#F0F0E8] border border-[#DEDCCF] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#5A5A40] animate-bounce" />
            </div>
            <div className="space-y-2 bg-[#F5F5F0] border border-[#DEDCCF] p-4 rounded-2xl rounded-tl-none w-full max-w-md shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#5A5A40] border-b border-[#DEDCCF] pb-2 mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>{currentLanguage === 'hindi' ? 'IBM ग्रेनाइट रीजनिंग मॉनिटर' : currentLanguage === 'punjabi' ? 'IBM ਗ੍ਰੇਨਾਈਟ ਰੀਜ਼ਨਿੰਗ ਮਾਨੀਟਰ' : 'IBM Granite Reasoning Monitor'}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[9px] text-slate-600">
                {reasoningLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 animate-fade-in">
                    <span className="text-[#10B981] font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-[#5A5A40] animate-pulse">
                  <span>&gt;</span>
                  <span>{currentLanguage === 'hindi' ? 'संरचनात्मक रणनीतिक आउटपुट का विश्लेषण...' : currentLanguage === 'punjabi' ? 'ਸੰਰਚਨਾਤਮਕ ਰਣਨੀਤਕ ਆਉਟਪੁੱਟ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...' : 'Synthesizing structural strategic outputs...'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts - show until user sends 2 messages */}
      {messages.length <= 2 && (
        <div className="px-5 py-3 border-t border-[#DEDCCF] bg-[#F5F5F0]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E80] mb-2">
            {currentLanguage === 'hindi' ? 'सुझाए गए प्रश्न' : currentLanguage === 'punjabi' ? 'ਸੁਝਾਏ ਗਏ ਪ੍ਰਸ਼ਨ' : 'Suggested Queries'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button key={idx} onClick={() => handleSend(qp.text)} className="bg-white border border-[#DEDCCF] text-slate-700 hover:text-[#5A5A40] hover:border-[#5A5A40] text-[11px] px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                <span>{qp.icon}</span>
                <span>{qp.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-[#F0F0E8] border-t border-[#DEDCCF] flex items-center gap-2">
        <button type="button" onClick={toggleListening} disabled={loading} className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition cursor-pointer ${isListening ? 'bg-rose-500 border-rose-600 text-white animate-pulse' : 'bg-white border-[#DEDCCF] text-[#5A5A40] hover:bg-[#ECEBE4]'}`}>
          {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
        </button>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="flex-1 bg-white text-[#1A1A1A] text-xs px-4 py-3 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition pr-16"
            placeholder={isListening ? (currentLanguage === 'hindi' ? "सुन रहा हूँ... बोलें" : currentLanguage === 'punjabi' ? "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ" : "Listening... Speak now") : (t.chatPlaceholder || "Query Watsonx about grants, eligibility, milestones...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading} className="absolute right-2 top-1.5 bottom-1.5 bg-[#5A5A40] hover:bg-[#4A4A30] disabled:opacity-50 disabled:pointer-events-none text-white px-3.5 rounded-lg flex items-center justify-center transition cursor-pointer">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
