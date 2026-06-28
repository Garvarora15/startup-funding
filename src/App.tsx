import { useState, useEffect } from 'react';
import { StartupProfile, Grant } from './types';
import Navbar from './components/Navbar';
import StartupProfileForm from './components/StartupProfileForm';
import GrantCard from './components/GrantCard';
import ChatAssistant from './components/ChatAssistant';
import ProposalGenerator from './components/ProposalGenerator';
import Footer from './components/Footer';
import PolicyModal from './components/PolicyModal';
import CollapsibleFAQ from './components/CollapsibleFAQ';
import { Search, Cpu, Sparkles, Database, FileText, Bot, HelpCircle, RefreshCw, Save, Star } from 'lucide-react';
import { TRANSLATIONS } from './locales/translations';

export default function App() {
  // 1. Core States
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.english;

  const [activeTab, setActiveTab] = useState<'assistant' | 'browse' | 'proposal'>('assistant');
  
  const [profile, setProfile] = useState<StartupProfile>({
    name: "",
    stage: "idea",
    domain: "any",
    incorporationYear: new Date().getFullYear(),
    location: "",
    description: "",
    currentFunding: 0,
    pitchFormat: "elevator",
    pitchLanguage: "english",
    updateFrequency: "on-demand"
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  
  // Real-time calculated match scores
  const [matchScores, setMatchScores] = useState<Record<string, { score: number; reasons: string[] }>>({});
  
  // Filter states
  const [q, setQ] = useState('');
  const [stageFilter, setStageFilter] = useState('any');
  const [domainFilter, setDomainFilter] = useState('any');
  const [minAmountFilter, setMinAmountFilter] = useState(0);
  
  // Favorites / Bookmarks states
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sh_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handleToggleFavorite = (grantId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(grantId)
        ? prev.filter(id => id !== grantId)
        : [...prev, grantId];
      localStorage.setItem('sh_favorites', JSON.stringify(updated));
      return updated;
    });
  };
  
  const [loadingGrants, setLoadingGrants] = useState(false);
  const [nluMetadata, setNluMetadata] = useState<any>(null);

  // Policy Modal States
  const [policyType, setPolicyType] = useState<'privacy' | 'cookies' | 'terms' | null>(null);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const handleOpenPolicy = (type: 'privacy' | 'cookies' | 'terms') => {
    setPolicyType(type);
    setIsPolicyOpen(true);
  };

  // Synchronize dynamic language changes between Navbar language and Pitch configuration language
  useEffect(() => {
    if (profile.pitchLanguage && profile.pitchLanguage !== currentLanguage) {
      setCurrentLanguage(profile.pitchLanguage);
    }
  }, [profile.pitchLanguage]);

  useEffect(() => {
    if (profile.pitchLanguage !== currentLanguage) {
      setProfile(prev => ({ ...prev, pitchLanguage: currentLanguage }));
    }
  }, [currentLanguage]);

  // Option lists localized on-the-fly
  const stageOptions = [
    { value: 'any', label: t.stageAny || 'Any Stage' },
    { value: 'idea', label: t.stageIdea || 'Idea Stage' },
    { value: 'prototype', label: t.stageProto || 'Prototype Stage' },
    { value: 'seed', label: t.stageSeed || 'Seed Stage' },
    { value: 'early', label: t.stageEarly || 'Early Stage' },
    { value: 'growth', label: t.stageGrowth || 'Growth Stage' }
  ];

  const domainOptions = [
    { value: 'any', label: t.domainAny || 'Any Sector / Domain' },
    { value: 'ai', label: t.domainAi || 'AI & SaaS' },
    { value: 'deeptech', label: t.domainDeeptech || 'Deep Tech & Robotics' },
    { value: 'biotech', label: t.domainBiotech || 'Biotech & Lifesciences' },
    { value: 'healthtech', label: t.domainHealthtech || 'Healthtech & Diagnostics' },
    { value: 'agritech', label: t.domainAgritech || 'Agritech & Agriculture' },
    { value: 'fintech', label: t.domainFintech || 'Fintech' },
    { value: 'cleantech', label: t.domainCleantech || 'Cleantech & Climate' },
    { value: 'hardware', label: t.domainHardware || 'Hardware & Manufacturing' }
  ];

  const minAmountOptions = [
    { value: '0', label: currentLanguage === 'hindi' ? 'कोई भी राशि' : currentLanguage === 'punjabi' ? 'ਕੋਈ ਵੀ ਰਕਮ' : 'Any Funding Limit' },
    { value: '500000', label: currentLanguage === 'hindi' ? '₹5 लाख और अधिक' : currentLanguage === 'punjabi' ? '₹5 ਲੱਖ ਅਤੇ ਵੱਧ' : '₹5 Lakh & Above' },
    { value: '1500000', label: currentLanguage === 'hindi' ? '₹15 लाख और अधिक' : currentLanguage === 'punjabi' ? '₹15 ਲੱਖ ਅਤੇ ਵੱਧ' : '₹15 Lakh & Above' },
    { value: '3000000', label: currentLanguage === 'hindi' ? '₹30 लाख और अधिक' : currentLanguage === 'punjabi' ? '₹30 ਲੱਖ ਅਤੇ ਵੱਧ' : '₹30 Lakh & Above' },
    { value: '5000000', label: currentLanguage === 'hindi' ? '₹50 लाख और अधिक' : currentLanguage === 'punjabi' ? '₹50 ਲੱਖ ਅਤੇ ਵੱਧ' : '₹50 Lakh & Above' },
    { value: '10000000', label: currentLanguage === 'hindi' ? '₹1 करोड़ और अधिक' : currentLanguage === 'punjabi' ? '₹1 ਕਰੋੜ ਅਤੇ ਵੱਧ' : '₹1 Crore & Above' }
  ];

  // 2. Load and calculate match scores when the profile is updated
  const calculateMatches = async (currentProfile: StartupProfile) => {
    try {
      const response = await fetch('/api/grants/calculate-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: currentProfile })
      });
      const data = await response.json();
      if (data.success) {
        const scoresMap: Record<string, { score: number; reasons: string[] }> = {};
        data.scores.forEach((item: any) => {
          scoresMap[item.grantId] = {
            score: item.score,
            reasons: item.reasons
          };
        });
        setMatchScores(scoresMap);
      }
    } catch (err) {
      console.error("Match calculation error:", err);
    }
  };

  // 3. Fetch grants list from our backend API
  const fetchGrants = async () => {
    setLoadingGrants(true);
    try {
      const queryParams = new URLSearchParams({
        q,
        stage: stageFilter,
        domain: domainFilter,
        minAmount: minAmountFilter.toString()
      });
      const response = await fetch(`/api/grants?${queryParams.toString()}`);
      const data = await response.json();
      if (data.success) {
        setGrants(data.grants);
        setNluMetadata(data.nlu || null);
      }
    } catch (err) {
      console.error("Fetch grants error:", err);
    } finally {
      setLoadingGrants(false);
    }
  };

  // Trigger match recalculation whenever the profile updates
  useEffect(() => {
    calculateMatches(profile);
  }, [profile]);

  // Trigger grant search whenever filter parameters change
  useEffect(() => {
    fetchGrants();
  }, [q, stageFilter, domainFilter, minAmountFilter]);

  // Handle selected grant for draft proposal wizard
  const handleSelectGrantForProposal = (grant: Grant) => {
    setSelectedGrant(grant);
    setActiveTab('proposal');
  };

  const displayedGrants = showFavoritesOnly ? grants.filter(g => favorites.includes(g.id)) : grants;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-800 flex flex-col font-sans">
      <Navbar currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />

      {/* Main Grid Layout */}
      <div className="flex-1 max-w-[1536px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        
        {/* Left Config Panel (4 Columns in large screens) - Kept fully persistent and individually scrollable on desktop */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto pr-2 animate-fadeIn lg:self-start">
          <StartupProfileForm profile={profile} onChange={setProfile} currentLanguage={currentLanguage} />
          
          {/* Save Profile Button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }}
              className="w-full bg-[#5A5A40] text-white hover:bg-[#4A4A30] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm border border-[#4A4A30]"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? (currentLanguage === 'hindi' ? 'सफलतापूर्वक सहेजा गया!' : currentLanguage === 'punjabi' ? 'ਸਫਲਤਾਪੂਰਵਕ ਸੰਭਾਲਿਆ ਗਿਆ!' : 'Saved successfully!') : t.saveContextBtn}</span>
            </button>
            {saveSuccess && (
              <p className="text-[10px] text-[#10B981] font-semibold text-center font-mono animate-fadeIn">
                {currentLanguage === 'hindi' ? '✓ मैच स्कोर और सिफारिशें वास्तविक समय में गतिशील रूप से अपडेट की गईं!' : currentLanguage === 'punjabi' ? '✓ ਮੈਚ ਸਕੋਰ ਅਤੇ ਸਿਫ਼ਾਰਸ਼ਾਂ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਗਤੀਸ਼ੀਲ ਰੂਪ ਵਿੱਚ ਅੱਪਡੇਟ ਕੀਤੀਆਂ ਗਈਆਂ!' : '✓ Match scores & recommendations updated dynamically in real-time!'}
              </p>
            )}
          </div>
          
          {/* Quick Real-time Metrics Dashboard */}
          <div className="bg-[#ECEBE4] border border-[#DEDCCF] rounded-[24px] p-5 shadow-sm font-mono text-xs text-[#1A1A1A]">
            <h4 className="font-display font-semibold text-[#4A4A30] mb-3 flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-[#5A5A40]" />
              {currentLanguage === 'hindi' ? 'वास्तविक समय प्रोफाइल अंतर्दृष्टि' : currentLanguage === 'punjabi' ? 'ਰੀਅਲ-ਟਾਈਮ ਪ੍ਰੋਫਾਈਲ ਇਨਸਾਈਟਸ' : 'Real-time Profile Insights'}
            </h4>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#DEDCCF]">
                <span className="text-[#5A5A40] font-medium">{currentLanguage === 'hindi' ? 'DPIIT योग्यता आयु:' : currentLanguage === 'punjabi' ? 'DPIIT ਯੋਗਤਾ ਉਮਰ:' : 'DPIIT Qualification Age:'}</span>
                <span className="text-[#1A1A1A] font-bold">
                  {new Date().getFullYear() - profile.incorporationYear} {currentLanguage === 'hindi' ? 'वर्ष' : currentLanguage === 'punjabi' ? 'ਸਾਲ' : 'Years'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#DEDCCF]">
                <span className="text-[#5A5A40] font-medium">{currentLanguage === 'hindi' ? 'कुल दायरे वाली योजनाएं:' : currentLanguage === 'punjabi' ? 'ਕੁੱਲ ਦਾਇਰੇ ਵਾਲੀਆਂ ਯੋਜਨਾਵਾਂ:' : 'Total Scoped Schemes:'}</span>
                <span className="text-[#5A5A40] font-bold">66 {currentLanguage === 'hindi' ? 'सत्यापित' : currentLanguage === 'punjabi' ? 'ਪ੍ਰਮਾਣਿਤ' : 'Authenticated'}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#DEDCCF]">
                <span className="text-[#5A5A40] font-medium">{currentLanguage === 'hindi' ? 'शीर्ष रणनीतिक मिलान:' : currentLanguage === 'punjabi' ? 'ਚੋਟੀ ਦੇ ਰਣਨੀਤਕ ਮੈਚ:' : 'Top Strategic Match:'}</span>
                <span className="text-[#10B981] font-bold">
                  {grants.length > 0 && matchScores[grants[0].id] ? `${matchScores[grants[0].id].score}% ${currentLanguage === 'hindi' ? 'मिलान' : currentLanguage === 'punjabi' ? 'ਮੈਚ' : 'Match'}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Workspace (8 Columns in large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:self-start">
          
          {/* Navigation Tabs */}
          <div className="bg-[#ECEBE4] border border-[#DEDCCF] rounded-2xl p-1 flex sm:p-1.5 gap-1 shadow-sm relative">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-[#5A5A40] text-white shadow-sm hover:bg-[#4A4A30]'
                  : 'text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#D4D2C5]'
              }`}
            >
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden xs:inline">{t.tabAgent || "IBM Granite AI Agent"}</span>
              <span className="xs:hidden">{currentLanguage === 'hindi' ? 'एजेंट' : currentLanguage === 'punjabi' ? 'ਏਜੰਟ' : 'Agent'}</span>
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-[#5A5A40] text-white shadow-sm hover:bg-[#4A4A30]'
                  : 'text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#D4D2C5]'
              }`}
            >
              <Database className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden xs:inline">{t.tabBrowse || "Browse All Schemes"}</span>
              <span className="xs:hidden">{currentLanguage === 'hindi' ? 'योजनाएं' : currentLanguage === 'punjabi' ? 'ਯੋਜਨਾਵਾਂ' : 'Browse'}</span>
            </button>

            <button
              onClick={() => setActiveTab('proposal')}
              className={`flex-1 py-2 sm:py-3 px-1 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 relative cursor-pointer ${
                activeTab === 'proposal'
                  ? 'bg-[#5A5A40] text-white shadow-sm hover:bg-[#4A4A30]'
                  : 'text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#D4D2C5]'
              }`}
            >
              <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden xs:inline">{t.tabProposal || "Proposal Generator"}</span>
              <span className="xs:hidden">{currentLanguage === 'hindi' ? 'प्रस्ताव' : currentLanguage === 'punjabi' ? 'ਪ੍ਰਸਤਾਵ' : 'Draft'}</span>
              {selectedGrant && (
                <span className="absolute top-1 right-1.5 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div>

          {/* Active Workspace Rendering */}
          <div className="flex-1">
            
            {/* Tab 1: Chat Assistant */}
            {activeTab === 'assistant' && (
              <ChatAssistant 
                startupProfile={profile} 
                currentLanguage={currentLanguage}
                onSelectGrantFromChat={(gName) => {
                  const matched = grants.find(g => g.name.toLowerCase().includes(gName.toLowerCase()));
                  if (matched) {
                    handleSelectGrantForProposal(matched);
                  }
                }}
              />
            )}

            {/* Tab 2: Browse Schemes */}
            {activeTab === 'browse' && (
              <div className="space-y-6">
                
                {/* Search & Smart Filter Bar */}
                <div className="bg-white border border-[#DEDCCF] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      className="w-full bg-[#F5F5F0] text-[#1A1A1A] text-xs pl-10 pr-4 py-3 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40] transition"
                      placeholder={t.searchPlaceholder || "Search schemes — e.g. biotech, NIDHI, women..."}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>

                  {/* Watson NLU Live Metadata */}
                  {nluMetadata && nluMetadata.keywords && nluMetadata.keywords.length > 0 && (
                    <div className="bg-[#F0F0E8] border border-[#DEDCCF] rounded-xl px-3.5 py-2.5 text-xs text-[#5A5A40] flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono font-bold text-[9px] uppercase tracking-wider bg-[#5A5A40] text-white px-1.5 py-0.5 rounded">
                          IBM Watson NLU
                        </span>
                        <span className="font-semibold text-[#4A4A30]">
                          {currentLanguage === 'hindi' ? 'विश्लेषित अवधारणाएं:' : currentLanguage === 'punjabi' ? 'ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤੀਆਂ ਧਾਰਨਾਵਾਂ:' : 'Parsed Concepts:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {nluMetadata.keywords.slice(0, 4).map((kw: any, idx: number) => (
                            <span key={idx} className="bg-white px-2 py-0.5 rounded border border-[#DEDCCF] text-[#4A4A30] font-mono text-[10px] font-bold">
                              {kw.text}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                        <span>
                          {currentLanguage === 'hindi' ? 'भावना (Sentiment):' : currentLanguage === 'punjabi' ? 'ਭਾਵਨਾ (Sentiment):' : 'Sentiment:'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-white ${
                          nluMetadata.sentiment.score > 0.1 
                            ? 'bg-[#10B981]' 
                            : nluMetadata.sentiment.score < -0.1 
                              ? 'bg-rose-500' 
                              : 'bg-slate-500'
                        }`}>
                          {nluMetadata.sentiment.label.toUpperCase()} ({nluMetadata.sentiment.score > 0 ? '+' : ''}{nluMetadata.sentiment.score.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Multi-Filter Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <select
                        className="w-full bg-[#F5F5F0] text-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40]"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                      >
                        {stageOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        className="w-full bg-[#F5F5F0] text-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40]"
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                      >
                        {domainOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        className="w-full bg-[#F5F5F0] text-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#DEDCCF] focus:outline-none focus:border-[#5A5A40]"
                        value={minAmountFilter}
                        onChange={(e) => setMinAmountFilter(Number(e.target.value))}
                      >
                        {minAmountOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bookmark Favorites Only Toggle Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#DEDCCF]/50">
                    <button
                      type="button"
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                        showFavoritesOnly 
                          ? 'bg-amber-500 border-amber-600 text-white shadow-sm hover:bg-amber-600' 
                          : 'bg-[#F5F5F0] border-[#DEDCCF] text-[#5A5A40] hover:bg-[#ECEBE4] hover:text-[#4A4A30]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white text-white animate-pulse' : 'text-[#8E8E80]'}`} />
                      <span>
                        {currentLanguage === 'hindi' 
                          ? (showFavoritesOnly ? 'सभी योजनाएं दिखाएं' : 'केवल पसंदीदा दिखाएं') 
                          : currentLanguage === 'punjabi' 
                            ? (showFavoritesOnly ? 'ਸਾਰੀਆਂ ਯੋਜਨਾਵਾਂ ਦਿਖਾਓ' : 'ਸਿਰਫ਼ ਪਸੰਦੀਦਾ ਦਿਖਾਓ') 
                            : (showFavoritesOnly ? 'Show All Schemes' : 'Show Favorites Only')}
                      </span>
                    </button>
                    <span className="text-[10px] font-mono font-semibold text-[#8E8E80]">
                      {currentLanguage === 'hindi' 
                        ? `${displayedGrants.length} योजनाएं प्रदर्शित` 
                        : currentLanguage === 'punjabi' 
                          ? `${displayedGrants.length} ਯੋਜਨਾਵਾਂ ਦਿਖਾਈਆਂ` 
                          : `${displayedGrants.length} schemes displayed`}
                    </span>
                  </div>
                </div>

                {/* Grants List Grid */}
                {loadingGrants ? (
                  <div className="py-20 flex justify-center items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-[#5A5A40] animate-spin" />
                    <span className="text-[#8E8E80] text-sm font-mono">
                      {currentLanguage === 'hindi' ? 'पूर्ण डेटाबेस इंडेक्स क्वेरी चल रही है...' : currentLanguage === 'punjabi' ? 'ਪੂਰੀ ਡਾਟਾਬੇਸ ਇੰਡੈਕਸ ਕੁਐਰੀ ਚੱਲ ਰਹੀ ਹੈ...' : 'Running full database index query...'}
                    </span>
                  </div>
                ) : displayedGrants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sort grants so higher scores show first */}
                    {[...displayedGrants]
                      .sort((a, b) => {
                        const scoreA = matchScores[a.id]?.score || 0;
                        const scoreB = matchScores[b.id]?.score || 0;
                        return scoreB - scoreA;
                      })
                      .map((grant) => (
                        <GrantCard
                          key={grant.id}
                          grant={grant}
                          score={matchScores[grant.id]?.score ?? 50}
                          reasons={matchScores[grant.id]?.reasons ?? []}
                          isSelectedForProposal={selectedGrant?.id === grant.id}
                          onSelectForProposal={handleSelectGrantForProposal}
                          currentLanguage={currentLanguage}
                          isFavorite={favorites.includes(grant.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#DEDCCF] rounded-2xl py-20 px-6 text-center shadow-sm">
                    <HelpCircle className="w-12 h-12 text-[#8E8E80] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#4A4A30]">
                      {showFavoritesOnly
                        ? (currentLanguage === 'hindi' ? 'कोई पसंदीदा योजना नहीं मिली' : currentLanguage === 'punjabi' ? 'ਕੋਈ ਪਸੰਦੀਦਾ ਯੋਜਨਾ ਨਹੀਂ ਮਿਲੀ' : 'No bookmarked favorite schemes found')
                        : (currentLanguage === 'hindi' ? 'कोई मेल खाने वाली योजना नहीं मिली' : currentLanguage === 'punjabi' ? 'ਕੋਈ ਮੇਲ ਖਾਂਦੀ ਯੋਜਨਾ ਨਹੀਂ ਮਿਲੀ' : 'No matching grant schemes found')}
                    </p>
                    <p className="text-xs text-[#8E8E80] max-w-sm mx-auto mt-1 leading-normal">
                      {showFavoritesOnly
                        ? (currentLanguage === 'hindi' 
                            ? 'पसंदीदा सूची में जोड़ने के लिए योजनाओं पर स्टार बटन दबाएं।' 
                            : currentLanguage === 'punjabi' 
                              ? 'ਪਸੰਦੀਦਾ ਸੂਚੀ ਵਿੱਚ ਜੋੜਨ ਲਈ ਸਕੀਮਾਂ ਤੇ ਸਟਾਰ ਬਟਨ ਦਬਾਓ।' 
                              : "Press the star icon on any grant card to add it to your favorites.")
                        : (currentLanguage === 'hindi' 
                            ? 'अपने खोज मापदंडों को शिथिल करने का प्रयास करें, "कोई भी चरण" या "कोई भी क्षेत्र" चुनें।' 
                            : currentLanguage === 'punjabi' 
                              ? 'ਆਪਣੇ ਖੋਜ ਮਾਪਦੰਡਾਂ ਨੂੰ ਢਿੱਲਾ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ, "ਕੋਈ ਵੀ ਪੜਾਅ" ਜਾਂ "ਕੋਈ ਵੀ ਖੇਤਰ" ਚੁਣੋ।' 
                              : "Try relaxing your query parameters, selecting 'Any Stage' or 'Any Sector', or lowering the funding amount limit.")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Proposal Generator */}
            {activeTab === 'proposal' && (
              <ProposalGenerator 
                startupProfile={profile} 
                selectedGrant={selectedGrant} 
                onClearSelectedGrant={() => setSelectedGrant(null)}
                currentLanguage={currentLanguage}
              />
            )}

          </div>

        </div>

      </div>

      {/* FAQ Section */}
      <div className="max-w-[1536px] w-full mx-auto px-4 md:px-6 mb-8">
        <CollapsibleFAQ currentLanguage={currentLanguage} />
      </div>

      <Footer currentLanguage={currentLanguage} onOpenPolicy={handleOpenPolicy} />
      
      <PolicyModal 
        isOpen={isPolicyOpen} 
        onClose={() => setIsPolicyOpen(false)} 
        type={policyType} 
        currentLanguage={currentLanguage} 
      />
    </div>
  );
}
