import React, { useState, useMemo } from 'react';
import {
  Search, MapPin, X, Shield, ShieldCheck, Users, Moon, Car, Clock,
  Navigation, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft,
  LogIn, Lightbulb, Flame, Pill, Bus, Fuel, CreditCard, Building2,
  Flag, Zap, Activity, UserCheck, Siren, BarChart3, MessageSquare,
  Send, Sparkles, Filter, Plus, Minus, Layers, Eye, Bookmark, Bell,
  ArrowUpRight, TrendingUp, HelpCircle, Share2, Info, Check
} from 'lucide-react';

// ---------------------------------------------------------------------------
// PROJECT SPECIFICATION DATA SOURCE (SafeMap AI — Final Year Project Spec)
// ---------------------------------------------------------------------------

const LOCATIONS = [
  {
    id: 'railway',
    name: 'Coimbatore Railway Station',
    category: 'Transit Hub',
    x: 42, y: 58,
    score: 84,
    sub: {
      women: 91,
      night: 68,
      child: 88,
      tourist: 89,
      senior: 82,
      emergency: 76,
      traffic: 72,
    },
    summary: 'This area is generally safe during the daytime. Pickpocketing is the most commonly reported issue in crowded areas. Women and families can travel comfortably during business hours. Extra caution is recommended after 10 PM due to reduced public activity.',
    crime: [
      { label: 'Vehicle Theft', pct: 32 },
      { label: 'Robbery', pct: 18 },
      { label: 'Harassment', pct: 14 },
      { label: 'Assault', pct: 8 },
      { label: 'Cyber Crime', pct: 5 },
      { label: 'Others', pct: 23 },
    ],
    time: '6 AM – 10 PM',
    reportsCount: 4,
    trend: 'Decreasing (-12% this month)',
    reports: [
      { reason: 'Poor street lighting', time: '2 hours ago', verified: true },
      { reason: 'Heavy crowd', time: '4 hours ago', verified: true },
    ]
  },
  {
    id: 'gandhipuram',
    name: 'Gandhipuram Bus Stand',
    category: 'Transit Hub',
    x: 58, y: 38,
    score: 58,
    sub: {
      women: 61,
      night: 39,
      child: 65,
      tourist: 64,
      senior: 59,
      emergency: 70,
      traffic: 45,
    },
    summary: 'Busy and commercially active by day, with standard pickpocketing risks typical of a major transit hub. Reports of harassment and dim lighting rise sharply after 9 PM around the outer bus terminals. Best visited in daylight.',
    crime: [
      { label: 'Vehicle Theft', pct: 21 },
      { label: 'Robbery', pct: 27 },
      { label: 'Harassment', pct: 24 },
      { label: 'Assault', pct: 10 },
      { label: 'Cyber Crime', pct: 3 },
      { label: 'Others', pct: 15 },
    ],
    time: '7 AM – 8 PM',
    reportsCount: 9,
    trend: 'Stable (+2% this month)',
    reports: [
      { reason: 'Unsafe at night', time: '1 hour ago', verified: true },
      { reason: 'Poor street lighting', time: '3 hours ago', verified: true },
      { reason: 'Suspicious activity', time: '5 hours ago', verified: true },
    ]
  },
  {
    id: 'rspuram',
    name: 'RS Puram',
    category: 'Residential',
    x: 25, y: 30,
    score: 91,
    sub: {
      women: 94,
      night: 82,
      child: 95,
      tourist: 90,
      senior: 92,
      emergency: 88,
      traffic: 68,
    },
    summary: 'One of the most consistently safe neighbourhoods in Coimbatore, with active residential patrols and well-lit retail stretches. Reported incidents are rare, mostly minor vehicle theft near unsupervised parking zones.',
    crime: [
      { label: 'Vehicle Theft', pct: 38 },
      { label: 'Robbery', pct: 9 },
      { label: 'Harassment', pct: 7 },
      { label: 'Assault', pct: 3 },
      { label: 'Cyber Crime', pct: 6 },
      { label: 'Others', pct: 37 },
    ],
    time: 'All day',
    reportsCount: 1,
    trend: 'Consistently Safe (-5% this month)',
    reports: [
      { reason: 'Heavy crowd', time: 'Yesterday', verified: true }
    ]
  },
  {
    id: 'racecourse',
    name: 'Race Course Road',
    category: 'Mixed Use',
    x: 68, y: 65,
    score: 72,
    sub: {
      women: 75,
      night: 58,
      child: 80,
      tourist: 80,
      senior: 78,
      emergency: 82,
      traffic: 52,
    },
    summary: 'A popular evening walking stretch with cafes and green parks, generally calm but with occasional speeding traffic incidents given the road width. Caution advised near the flyover after midnight.',
    crime: [
      { label: 'Vehicle Theft', pct: 25 },
      { label: 'Robbery', pct: 15 },
      { label: 'Harassment', pct: 11 },
      { label: 'Assault', pct: 6 },
      { label: 'Cyber Crime', pct: 4 },
      { label: 'Others', pct: 39 },
    ],
    time: '6 AM – 11 PM',
    reportsCount: 3,
    trend: 'Decreasing (-8% this month)',
    reports: [
      { reason: 'Broken CCTV', time: '6 hours ago', verified: true },
      { reason: 'Poor street lighting', time: '1 day ago', verified: true }
    ]
  },
];

const FACILITIES = [
  { icon: Shield, label: 'Police Station', dist: '0.4 km' },
  { icon: Activity, label: 'Hospital', dist: '0.9 km' },
  { icon: Flame, label: 'Fire Station', dist: '1.2 km' },
  { icon: Pill, label: 'Pharmacy', dist: '0.3 km' },
  { icon: Bus, label: 'Bus Stand', dist: '0.2 km' },
  { icon: Fuel, label: 'Petrol Bunk', dist: '0.6 km' },
  { icon: CreditCard, label: 'ATM', dist: '0.3 km' },
  { icon: Building2, label: 'Hotels', dist: '0.5 km' },
];

// All 7 community report reasons exactly from Page 5 of spec
const REPORT_REASONS = [
  { icon: Lightbulb, label: 'Poor street lighting' },
  { icon: AlertTriangle, label: 'Suspicious activity' },
  { icon: Siren, label: 'Road blocked' },
  { icon: Users, label: 'Heavy crowd' },
  { icon: Flag, label: 'Broken CCTV' },
  { icon: Activity, label: 'Accident reported' },
  { icon: Moon, label: 'Unsafe at night' },
];

const ROUTES = [
  {
    key: 'safest',
    label: 'Safest Route',
    icon: ShieldCheck,
    color: '#16A34A',
    eta: '24 min',
    dist: '6.1 km',
    score: 92,
    lighting: '96%',
    cctv: '88%',
    badge: 'Recommended',
    summary: 'Prioritizes main roads with high street lighting, CCTV surveillance, and 24/7 police kiosks.'
  },
  {
    key: 'balanced',
    label: 'Balanced Route',
    icon: Navigation,
    color: '#1D4ED8',
    eta: '18 min',
    dist: '5.4 km',
    score: 81,
    lighting: '84%',
    cctv: '76%',
    badge: 'Optimal ETA & Safety',
    summary: 'Good balance of travel time and safety, avoiding unlit side alleys after 9 PM.'
  },
  {
    key: 'fastest',
    label: 'Fastest Route',
    icon: Zap,
    color: '#EA580C',
    eta: '13 min',
    dist: '5.0 km',
    score: 64,
    lighting: '62%',
    cctv: '54%',
    badge: 'Time Saver',
    summary: 'Direct shortcut via interior residential roads. Less commercial activity at night.'
  },
];

const NOTIFICATIONS = [
  { id: 1, title: 'High crime activity reported', desc: 'Near your saved place: Gandhipuram Bus Stand. Avoid poorly lit stretches after 10 PM.', time: '10 min ago', level: 'orange' },
  { id: 2, title: 'Police advisory issued', desc: 'Traffic diversion and increased patrol near Coimbatore Railway Station platform 2.', time: '1 hour ago', level: 'blue' },
  { id: 3, title: 'Avoid this route tonight', desc: 'North alley shortcut reported for suspicious activity by 3 verified community members.', time: '2 hours ago', level: 'red' },
];

const AI_PRESET_QUESTIONS = [
  "Is Gandhipuram safe after 9 PM?",
  "What is the safest route from Railway Station to RS Puram?",
  "Which area in Coimbatore has the highest Women Safety score?",
  "Why is Race Course Road rated 72/100?",
];

// Helper for color branding (Page 8: Green for safe, Orange for caution, Red for danger)
function band(score) {
  if (score >= 80) return { color: '#16A34A', bg: '#DCFCE7', text: '#15803D', label: 'Safe', border: '#86EFAC' };
  if (score >= 60) return { color: '#CA8A04', bg: '#FEF9C3', text: '#A16207', label: 'Moderate', border: '#FDE047' };
  if (score >= 40) return { color: '#EA580C', bg: '#FFEDD5', text: '#C2410C', label: 'High Risk', border: '#FDBA74' };
  return { color: '#DC2626', bg: '#FEE2E2', text: '#B91C1C', label: 'Dangerous', border: '#FCA5A5' };
}

export default function SafeMapPrototype() {
  // Navigation & selection state
  const [activeId, setActiveId] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('safest');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Map controls state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layerHeatmap, setLayerHeatmap] = useState(true);
  const [layerIncidents, setLayerIncidents] = useState(false);
  const [layerReports, setLayerReports] = useState(true);

  // Modals & drawers state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportChoice, setReportChoice] = useState(null);
  const [reportSent, setReportSent] = useState(false);

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am SafeMap AI. Ask me about safety scores, safest travel routes, or night travel recommendations in Coimbatore.'
    }
  ]);
  const [aiInput, setAiInput] = useState('');

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(l => {
      const matchCategory = categoryFilter === 'All' || l.category === categoryFilter;
      const matchQuery = l.name.toLowerCase().includes(query.toLowerCase()) || l.category.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [categoryFilter, query]);

  const active = useMemo(() => LOCATIONS.find(l => l.id === activeId) || null, [activeId]);

  function openLocation(id) {
    setActiveId(id);
    setRouteMode(false);
    setShowSuggestions(false);
  }

  function closePanel() {
    setActiveId(null);
    setRouteMode(false);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (filteredLocations.length > 0) {
      openLocation(filteredLocations[0].id);
    }
  }

  function submitReport() {
    setReportSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSent(false);
      setReportChoice(null);
    }, 1800);
  }

  function handleSendAiMessage(customText) {
    const promptText = customText || aiInput;
    if (!promptText.trim()) return;

    const userMsg = { sender: 'user', text: promptText };
    setAiMessages(prev => [...prev, userMsg]);
    if (!customText) setAiInput('');

    // Simulate intelligent AI answer based on spec queries
    setTimeout(() => {
      let reply = "SafeMap AI Intelligence: According to our multi-layer crime dataset and community reports, this location maintains steady patrol presence. We recommend staying on well-lit main arterial routes after 10 PM.";
      const qLower = promptText.toLowerCase();

      if (qLower.includes('gandhipuram') || qLower.includes('9 pm')) {
        reply = "Gandhipuram Bus Stand has an Overall Safety Score of 58/100 (Moderate). Night Safety drops to 39/100 due to reported harassment and dim lighting around outer bus stands after 9 PM. Recommendation: Use the main terminal entrance and verified prepaid taxis.";
      } else if (qLower.includes('route') || qLower.includes('safest')) {
        reply = "The Safest Route to RS Puram covers 6.1 km (24 min ETA) with a 92/100 route score, 96% street lighting, and 88% CCTV surveillance. It avoids interior residential shortcuts that have reduced visibility at night.";
      } else if (qLower.includes('women') || qLower.includes('highest')) {
        reply = "RS Puram currently ranks #1 in Coimbatore for Women Safety (94/100) and Night Safety (82/100), supported by active residential community reporting and high retail footfall.";
      } else if (qLower.includes('race course') || qLower.includes('72')) {
        reply = "Race Course Road scores 72/100 overall. While Tourist Safety is high (80/100), Night Safety is rated 58/100 due to isolated stretches near the flyover after midnight and occasional speeding traffic.";
      }

      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  }

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 text-slate-900 select-none" style={{ fontFamily: "'Inter', sans-serif", height: '100vh', minHeight: 680 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(255,255,255,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .glass-dark { background: rgba(15,23,42,0.85); backdrop-filter: blur(16px); }
        @keyframes slideIn { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .panel-in { animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes popIn { from { transform: scale(0.95); opacity:0; } to { transform: scale(1); opacity:1; } }
        .pop-in { animation: popIn 0.2s ease-out; }
        @keyframes dashmove { to { stroke-dashoffset: -40; } }
        .route-line { animation: dashmove 1.2s linear infinite; }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 9999px; }
      `}</style>

      {/* =========================================================================
          1. INTERACTIVE MAP LAYER (Google Maps / Apple Maps style from Spec Page 8)
          ========================================================================= */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out" 
        style={{ 
          background: 'linear-gradient(135deg, #EBF1F8 0%, #DFE7F2 100%)',
          transform: `scale(${zoomLevel})`,
          transformOrigin: '50% 50%'
        }}
      >
        {/* SVG Grid & Streets Simulation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main arterial highways */}
          <path d="M 0 50 Q 50 52 100 48" stroke="#CFD9E6" strokeWidth="1.2" fill="none" />
          <path d="M 45 0 Q 48 50 42 100" stroke="#CFD9E6" strokeWidth="1.2" fill="none" />
          <path d="M 20 0 L 80 100" stroke="#DCE4EF" strokeWidth="0.8" fill="none" />
          
          {/* Secondary streets */}
          {[15, 30, 45, 60, 75, 88].map(v => (
            <line key={'h' + v} x1="0" y1={v} x2="100" y2={v} stroke="#D6E0EC" strokeWidth="0.3" strokeDasharray="1,1" />
          ))}
          {[12, 28, 42, 58, 72, 86].map(v => (
            <line key={'v' + v} x1={v} y1="0" x2={v} y2="100" stroke="#D6E0EC" strokeWidth="0.3" strokeDasharray="1,1" />
          ))}

          {/* Heatmap Layer (Page 2: District Safety Colors) */}
          {layerHeatmap && (
            <>
              <circle cx="25" cy="30" r="18" fill="#16A34A" opacity="0.16" />
              <circle cx="42" cy="58" r="16" fill="#16A34A" opacity="0.14" />
              <circle cx="58" cy="38" r="20" fill="#EA580C" opacity="0.22" />
              <circle cx="68" cy="65" r="16" fill="#CA8A04" opacity="0.16" />
              <circle cx="82" cy="18" r="14" fill="#DC2626" opacity="0.18" />
              <circle cx="15" cy="75" r="15" fill="#16A34A" opacity="0.15" />
            </>
          )}

          {/* Route Safety Line (Page 5: Standout feature) */}
          {routeMode && active && (
            <line
              x1={active.x} y1={active.y} x2="25" y2="30"
              stroke={ROUTES.find(r => r.key === selectedRoute).color}
              strokeWidth="1.1" strokeDasharray="2.2,1.6" className="route-line"
            />
          )}
        </svg>

        {/* Location Markers (Page 2: Risk-coded pins) */}
        {LOCATIONS.map(loc => {
          const b = band(loc.score);
          const isSelected = activeId === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => openLocation(loc.id)}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group transition-all duration-200"
              style={{ left: loc.x + '%', top: loc.y + '%' }}
              aria-label={loc.name}
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
                {loc.name} · {loc.score}/100
              </div>
              
              {/* Marker pin */}
              <div 
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform ${isSelected ? 'scale-125 ring-4 ring-blue-500/30' : 'group-hover:scale-110'}`} 
                style={{ background: b.color }}
              >
                <MapPin size={15} color="white" strokeWidth={2.5} />
              </div>
              <div className="w-2 h-2 rounded-full -mt-1 shadow-sm" style={{ background: b.color }} />
            </button>
          );
        })}

        {/* Simulated Community Report Pins (Page 5: Verified Community Reports) */}
        {layerReports && LOCATIONS.map(loc => (
          <div
            key={'rep-' + loc.id}
            onClick={() => openLocation(loc.id)}
            className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center hover:scale-110 transition-transform"
            style={{ left: (loc.x + 3.5) + '%', top: (loc.y - 3) + '%' }}
            title={`Verified report: ${loc.reports[0].reason}`}
          >
            <AlertTriangle size={11} className="text-amber-700" />
          </div>
        ))}
      </div>

      {/* =========================================================================
          2. TOP HEADER BAR (Search, Filters, Analytics, AI Chat, Alerts)
          ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 z-20 pointer-events-none">
        {/* Left branding + Search input */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Logo */}
          <div className="glass rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 shrink-0 border border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <Shield size={17} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight leading-none text-slate-900">SafeMap AI</div>
              <div className="text-[10px] font-medium text-blue-600 mt-0.5">Crime Intelligence</div>
            </div>
          </div>

          {/* Search bar with dropdown suggestions */}
          <div className="relative flex-1 md:w-80">
            <form onSubmit={handleSearchSubmit} className="glass rounded-2xl shadow-lg flex items-center gap-2.5 px-4 py-2.5 border border-slate-200/60">
              <Search size={17} className="text-slate-400 shrink-0" />
              <input
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search place, hub, residential..."
                className="bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400 flex-1 min-w-0"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-slate-400 hover:text-slate-600">
                  <X size={15} />
                </button>
              )}
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                  Locations & Transit Hubs
                </div>
                {filteredLocations.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">No matching safe locations found.</div>
                ) : (
                  filteredLocations.map(loc => {
                    const b = band(loc.score);
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => openLocation(loc.id)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b border-slate-100/60 last:border-0"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{loc.name}</div>
                          <div className="text-xs text-slate-500">{loc.category} · Best time: {loc.time}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono-data font-bold" style={{ color: b.color }}>{loc.score}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: b.bg, color: b.text }}>
                            {b.label}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right tools (Filters, Analytics, AI Assistant, Alerts, Login) */}
        <div className="flex items-center gap-2 pointer-events-auto overflow-x-auto pb-1 md:pb-0">
          {/* Category Filter Pills */}
          <div className="glass rounded-2xl shadow-md p-1 flex items-center gap-1 border border-slate-200/60 shrink-0">
            {['All', 'Transit Hub', 'Residential', 'Mixed Use'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Analytics Modal Toggle Button (Page 6: Crime Trends & Analytics) */}
          <button
            type="button"
            onClick={() => setAnalyticsOpen(true)}
            className="glass rounded-2xl shadow-md px-3.5 py-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-white border border-slate-200/60 shrink-0"
            title="View Crime Trends & Analytics"
          >
            <BarChart3 size={16} className="text-blue-600" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* Ask AI Assistant Button (Page 7: Standout AI Chat Feature) */}
          <button
            type="button"
            onClick={() => setAiChatOpen(true)}
            className="rounded-2xl shadow-lg px-3.5 py-2.5 flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shrink-0 shadow-blue-500/20"
          >
            <Sparkles size={15} className="text-amber-300 animate-pulse" />
            <span>Ask AI</span>
          </button>

          {/* Notifications / Alerts Button (Page 6: Safety Notifications) */}
          <button
            type="button"
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative glass rounded-2xl shadow-md p-2.5 text-slate-600 hover:text-slate-900 border border-slate-200/60 shrink-0"
            title="Safety Notifications & Advisory"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Login button */}
          <button type="button" className="glass rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 border border-slate-200/60 shrink-0">
            <LogIn size={15} />
            <span className="hidden lg:inline">Admin Login</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. MAP TOOLBAR & LEGEND (Heatmap, Incidents, Zoom Controls)
          ========================================================================= */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-2 z-20">
        {/* Map Layers Card */}
        <div className="glass rounded-2xl shadow-lg p-2 border border-slate-200/60 flex flex-col gap-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Map Layers</div>
          <button
            type="button"
            onClick={() => setLayerHeatmap(!layerHeatmap)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors ${layerHeatmap ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Layers size={14} className={layerHeatmap ? 'text-blue-600' : 'text-slate-400'} />
            <span>Heatmap</span>
            {layerHeatmap && <Check size={13} className="ml-auto" />}
          </button>
          <button
            type="button"
            onClick={() => setLayerReports(!layerReports)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors ${layerReports ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <AlertTriangle size={14} className={layerReports ? 'text-amber-500' : 'text-slate-400'} />
            <span>Reports (Verified)</span>
            {layerReports && <Check size={13} className="ml-auto" />}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="glass rounded-2xl shadow-lg p-1 border border-slate-200/60 flex flex-col">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <div className="h-px bg-slate-200 my-0.5" />
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Safety Score Color Legend (Page 2: Safe, Moderate, High, Dangerous) */}
      <div className="absolute left-4 bottom-4 glass rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-4 z-20 text-xs font-semibold text-slate-700 border border-slate-200/60">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-1">Safety Index:</span>
        {[['#16A34A', 'Safe (80-100)'], ['#CA8A04', 'Moderate (60-79)'], ['#EA580C', 'High Risk (40-59)'], ['#DC2626', 'Dangerous (<40)']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ background: c }} />
            <span>{l}</span>
          </div>
        ))}
      </div>

      {/* =========================================================================
          4. FLOATING TEASER CARD (When no location is clicked - Page 1 & 2 Spec)
          ========================================================================= */}
      {!active && (
        <button
          type="button"
          onClick={() => openLocation('railway')}
          className="absolute left-4 bottom-20 glass rounded-3xl shadow-xl p-5 w-80 text-left z-20 pop-in border border-slate-200/70 hover:shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              <MapPin size={12} /> Near your location
            </span>
            <span className="text-xs font-medium text-slate-400">Click to inspect</span>
          </div>
          <div className="font-display font-bold text-base text-slate-900 mb-1">Coimbatore Railway Station</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-mono-data text-xl font-extrabold text-emerald-600">84</span>
              <span className="text-xs font-medium text-slate-500">/ 100 · Overall Safe</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
              Safety panel <ChevronRight size={14} />
            </span>
          </div>
        </button>
      )}

      {/* =========================================================================
          5. REPORT AN ISSUE FAB (Page 5: Verified Community Reports)
          ========================================================================= */}
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="absolute bottom-6 right-6 rounded-2xl shadow-xl flex items-center gap-2 px-4 py-3 z-30 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-blue-500/30"
        aria-label="Submit a safety report"
      >
        <Flag size={16} />
        <span>Report Issue</span>
      </button>

      {/* =========================================================================
          6. MAIN PROFESSIONAL SIDE PANEL (Page 3, 4, 5, 6 Specification)
          ========================================================================= */}
      {active && (
        <div className="absolute inset-x-0 bottom-0 top-24 md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[420px] bg-white shadow-2xl z-40 panel-in overflow-y-auto rounded-t-3xl md:rounded-none border-l border-slate-200/70">
          <div className="p-6">
            {/* Header with Category Badge & Close */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
                  <Shield size={12} /> {active.category}
                </div>
                <div className="font-display font-bold text-2xl text-slate-900 leading-tight">{active.name}</div>
                <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-2">
                  <span>30-Day Trend: <strong className="text-slate-700">{active.trend}</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {!routeMode ? (
              <>
                {/* 1. Score Ring Box (Page 6: Safety Score out of 100) */}
                <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ScoreRing score={active.score} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold" style={{ color: band(active.score).color }}>
                        {band(active.score).label}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        Rank #2 in District
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Calculated using historical datasets, police logs, and verified community inputs.
                    </p>
                  </div>
                </div>

                {/* 2. All 7 Safety Categories (Page 6 Table Specification) */}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Category Safety Breakdown</span>
                    <span className="text-[10px] lowercase font-normal">out of 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <SubScore icon={UserCheck} label="Women Safety" value={active.sub.women} />
                    <SubScore icon={Moon} label="Night Safety" value={active.sub.night} />
                    <SubScore icon={Users} label="Child Safety" value={active.sub.child} />
                    <SubScore icon={Navigation} label="Tourist Safety" value={active.sub.tourist} />
                    <SubScore icon={Shield} label="Senior Citizen" value={active.sub.senior} />
                    <SubScore icon={Siren} label="Emergency Resp." value={active.sub.emergency} />
                    <SubScore icon={Car} label="Traffic Safety" value={active.sub.traffic} />
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-900">Recommended Time</span>
                      </div>
                      <span className="font-mono-data font-bold text-xs text-blue-700">{active.time}</span>
                    </div>
                  </div>
                </div>

                {/* 3. AI Safety Summary (Page 4: Human-readable explanation) */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={15} className="text-blue-600" />
                      <span className="text-xs font-bold text-blue-900">AI Safety Intelligence Summary</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded text-blue-600 border border-blue-100">
                      Phase 1 AI
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{active.summary}</p>
                </div>

                {/* 4. Crime Distribution Cards (Page 4: Modern cards instead of tables) */}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Reported Crime Distribution (Last 12 Months)
                  </div>
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    {active.crime.map(c => (
                      <div key={c.label} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 w-28 shrink-0">{c.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: c.pct + '%',
                              background: c.pct >= 30 ? '#DC2626' : c.pct >= 18 ? '#EA580C' : '#1D4ED8',
                            }}
                          />
                        </div>
                        <span className="font-mono-data font-bold text-xs text-slate-700 w-9 text-right">{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Verified Community Reports Feed (Page 5 & 11 Specification) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Verified Community Reports
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Admin Verified ({active.reportsCount})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {active.reports.map((rep, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800">{rep.reason}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">{rep.time}</span>
                          <CheckCircle2 size={13} className="text-emerald-600" title="Verified by admin" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Nearby Facilities Grid (Page 5: Automatically show nearby) */}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Nearby Essential Facilities
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {FACILITIES.map(f => (
                      <div
                        key={f.label}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <f.icon size={17} className="text-blue-600" />
                        <span className="text-[11px] font-medium text-slate-700 text-center leading-tight mt-0.5">
                          {f.label}
                        </span>
                        <span className="font-mono-data text-[10px] text-slate-400">{f.dist}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Standout Route Safety Button (Page 5) */}
                <button
                  type="button"
                  onClick={() => setRouteMode(true)}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Navigation size={17} />
                  <span>Compare Safest vs Balanced Routes</span>
                </button>
              </>
            ) : (
              <RouteView
                active={active}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                onBack={() => setRouteMode(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL: COMMUNITY REPORT AN ISSUE (Page 5: All 7 Reasons + Admin Verify)
          ========================================================================= */}
      {reportOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => !reportSent && setReportOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 pop-in border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {!reportSent ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-display font-bold text-lg text-slate-900">Report a Safety Issue</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Help the Coimbatore community stay informed.
                    </p>
                  </div>
                  <button type="button" onClick={() => setReportOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {REPORT_REASONS.map(r => {
                    const isChosen = reportChoice === r.label;
                    return (
                      <button
                        type="button"
                        key={r.label}
                        onClick={() => setReportChoice(r.label)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                          isChosen
                            ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <r.icon size={18} className={isChosen ? 'text-blue-600' : 'text-slate-400'} />
                        <span className="text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Admin Verification:</strong> As per project specification, community reports are verified by an administrator before appearing publicly on the heatmap.
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!reportChoice}
                  onClick={submitReport}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-all shadow-md shadow-blue-500/20"
                >
                  Submit Verified Report
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <span className="font-display font-bold text-lg text-slate-900">Report Successfully Logged</span>
                <p className="text-xs text-slate-500 max-w-xs">
                  Your report is pending administrator verification. Thank you for making SafeMap AI more accurate for everyone.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: AI SAFETY CHAT ASSISTANT (Page 7: Phase 4 Optional AI Chat)
          ========================================================================= */}
      {aiChatOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setAiChatOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[540px] flex flex-col pop-in overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Sparkles size={18} className="text-amber-300" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm">SafeMap AI Intelligence Assistant</div>
                  <div className="text-[11px] text-slate-400">Trained on Crime Trends & DBSCAN Hotspots</div>
                </div>
              </div>
              <button type="button" onClick={() => setAiChatOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                        : 'bg-white text-slate-800 shadow-sm border border-slate-200/70 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Preset Question Suggestions */}
            <div className="px-5 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Suggestions:</span>
              {AI_PRESET_QUESTIONS.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendAiMessage(q)}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 shrink-0 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendAiMessage();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask about safety, night travel, or specific areas..."
                className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-900 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!aiInput.trim()}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. MODAL: ANALYTICS & CRIME TREND DASHBOARD (Page 6 & 7 Specification)
          ========================================================================= */}
      {analyticsOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setAnalyticsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 pop-in border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="font-display font-bold text-xl text-slate-900">Coimbatore Safety & Crime Analytics</span>
                <p className="text-xs text-slate-500 mt-0.5">30-day crime trends, district comparison, and safest zone ranking.</p>
              </div>
              <button type="button" onClick={() => setAnalyticsOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-semibold text-emerald-800">Safest District Area</div>
                <div className="font-display font-bold text-xl text-emerald-900 mt-1">RS Puram (91/100)</div>
                <div className="text-[11px] text-emerald-700 mt-1">Women Safety: 94% · Night Safety: 82%</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="text-xs font-semibold text-amber-800">Moderate Transit Zone</div>
                <div className="font-display font-bold text-xl text-amber-900 mt-1">Gandhipuram (58/100)</div>
                <div className="text-[11px] text-amber-700 mt-1">Pickpocketing & night lighting alerts</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="text-xs font-semibold text-blue-800">30-Day Crime Trend</div>
                <div className="font-display font-bold text-xl text-blue-900 mt-1">-6.4% Decrease</div>
                <div className="text-[11px] text-blue-700 mt-1">City-wide patrol effectiveness</div>
              </div>
            </div>

            {/* District Ranking Table (Page 6: District Comparison / Safest Areas / High-Risk) */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">District Area Ranking</div>
              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Location Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Safety Score</th>
                      <th className="p-3">Women Safety</th>
                      <th className="p-3">Best Travel Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {LOCATIONS.map(l => {
                      const b = band(l.score);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-800">{l.name}</td>
                          <td className="p-3 text-slate-500">{l.category}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full font-bold text-xs" style={{ background: b.bg, color: b.text }}>
                              {l.score}/100 ({b.label})
                            </span>
                          </td>
                          <td className="p-3 font-mono-data font-semibold text-slate-700">{l.sub.women}%</td>
                          <td className="p-3 text-slate-500">{l.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span>
                <strong>Dataset Integrity:</strong> Supports historical datasets and verified community reports without relying on fragile real-time police APIs (Page 11 recommendation).
              </span>
              <button
                type="button"
                onClick={() => setAnalyticsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. POPOVER: SAFETY NOTIFICATIONS (Page 6 Examples)
          ========================================================================= */}
      {alertsOpen && (
        <div
          className="absolute top-16 right-4 z-50 w-80 bg-white rounded-3xl shadow-2xl p-4 border border-slate-100 pop-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900">
              <Bell size={15} className="text-blue-600" />
              <span>Live Safety Notifications</span>
            </div>
            <button type="button" onClick={() => setAlertsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={15} />
            </button>
          </div>
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CHILD COMPONENTS: ScoreRing, SubScore, RouteView (Page 5 & 6 Spec)
// ---------------------------------------------------------------------------

function ScoreRing({ score }) {
  const b = band(score);
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={b.color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-data font-bold text-lg text-slate-900 leading-none">{score}</span>
        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">Score</span>
      </div>
    </div>
  );
}

function SubScore({ icon: Icon, label, value }) {
  const b = band(value);
  return (
    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <span className="font-mono-data font-bold text-xs" style={{ color: b.color }}>
        {value}
      </span>
    </div>
  );
}

function RouteView({ active, selectedRoute, setSelectedRoute, onBack }) {
  const currentRoute = ROUTES.find(r => r.key === selectedRoute);
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs mb-4 font-bold text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ChevronLeft size={16} /> Back to {active.name} details
      </button>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Route Safety Options (Page 5 Spec)
        </span>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          Standout Feature
        </span>
      </div>

      {/* 3 Routes: Safest, Balanced, Fastest */}
      <div className="space-y-2.5 mb-5">
        {ROUTES.map(r => {
          const isSelected = selectedRoute === r.key;
          return (
            <button
              type="button"
              key={r.key}
              onClick={() => setSelectedRoute(r.key)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <r.icon size={17} color={r.color} />
                  <span className="text-sm font-bold text-slate-900">{r.label}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: r.color + '18', color: r.color }}>
                  {r.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2 leading-relaxed">{r.summary}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono-data">
                <span className="font-semibold text-slate-700">ETA: {r.eta} ({r.dist})</span>
                <span className="text-emerald-700 font-bold">Safety Score: {r.score}/100</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Route safety telemetry comparison */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
        <div className="text-xs font-bold text-slate-800 mb-2">Route Safety Telemetry ({currentRoute.label})</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Street Lighting</span>
            <span className="font-mono-data font-bold text-slate-800">{currentRoute.lighting} well-lit</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">CCTV Coverage</span>
            <span className="font-mono-data font-bold text-slate-800">{currentRoute.cctv} covered</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Proactive Advisory:</strong> The {currentRoute.label.toLowerCase()} is highlighted on the interactive map. After 10 PM, Safest Route is strongly advised over interior residential shortcuts.
        </span>
      </div>
    </div>
  );
}
