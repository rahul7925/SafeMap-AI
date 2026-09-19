import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Navigation, Bookmark, Share2, Flag, Bell, Sparkles,
  CheckCircle2, Clock, PhoneCall, ChevronRight, Shield,
  MapPin, ArrowUpRight, Car, Video, Moon, Clock3,
  Hospital as HospitalIcon, Flame, CreditCard, Train,
  Bus, Hotel, Fuel, Plus, CloudRain, Thermometer, Wind, FileText, ChevronDown
} from 'lucide-react';
import { scoreBand } from '../utils/theme.js';
import AIPredictionCard from './AIPredictionCard.jsx';

/* ── Shimmer Block ────────────────────────────────────────────────────────── */
function ShimmerBlock({ width = '100%', height = '16px', className = '' }) {
  return <div className={`shimmer-loading ${className}`} style={{ width, height, backgroundColor: '#E2E8F0', borderRadius: '4px' }} />;
}

/* ── Accordion Section ────────────────────────────────────────────────────── */
function AccordionSection({ title, icon, badge, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#F1F5F9] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[14px] font-semibold text-[#0F172A]">{title}</span>
          {badge && <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB]">{badge}</span>}
        </div>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Progress Bar ─────────────────────────────────────────────────────────── */
function CategoryBar({ label, score, color = '#22C55E' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-[#0F172A]">{label}</span>
        <span className="text-[14px] font-bold text-[#0F172A] tabular-nums">
          {score}/100
        </span>
      </div>
      <div className="h-[8px] w-full bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-[8px] rounded-full transition-all duration-350"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function LocationSidePanel({
  location,
  onClose,
  onStartRouteMode,
  onOpenReportModal,
  predictions = [],
  aiIntelligence = null,
  dynamicSafetyScore = null,
  weatherData = null,
  trafficData = null,
  onOpenShareModal,
  onOpenAlertsModal,
  onOpenExportModal,
}) {
  const [saved, setSaved] = useState(false);

  if (!location) return null;

  const loc = location;
  const b = scoreBand(loc.score || 86);

  const ds = dynamicSafetyScore;
  const categories = ds ? [
    { label: 'Women Safety', score: ds.breakdown?.women ?? 83, color: '#22C55E' },
    { label: 'Night Safety', score: ds.breakdown?.night ?? 61, color: '#2563EB' },
    { label: 'Child Safety', score: ds.breakdown?.child ?? 84, color: '#6366F1' },
    { label: 'Traffic Safety', score: ds.breakdown?.traffic ?? 61, color: '#F59E0B' },
    { label: 'Tourist Safety', score: ds.breakdown?.tourist ?? 79, color: '#0EA5E9' },
    { label: 'Senior Citizen Safety', score: ds.breakdown?.senior ?? 78, color: '#10B981' },
    { label: 'Emergency Response', score: ds.breakdown?.emergency ?? 85, color: '#EF4444' },
  ] : [
    { label: 'Women Safety', score: loc.sub?.women ?? 83, color: '#22C55E' },
    { label: 'Night Safety', score: loc.sub?.night ?? 61, color: '#2563EB' },
    { label: 'Child Safety', score: loc.sub?.child ?? 84, color: '#6366F1' },
    { label: 'Traffic Safety', score: loc.sub?.traffic ?? 61, color: '#F59E0B' },
    { label: 'Tourist Safety', score: loc.sub?.tourist ?? 79, color: '#0EA5E9' },
    { label: 'Senior Citizen Safety', score: loc.sub?.senior ?? 78, color: '#10B981' },
  ];

  const nearbyServices = [
    { name: 'Police Station', icon: <Shield size={16} strokeWidth={1.75} className="text-[#2563EB]" />, dist: '0.3 km', eta: '2 min' },
    { name: 'Hospital', icon: <HospitalIcon size={16} strokeWidth={1.75} className="text-[#EF4444]" />, dist: '0.6 km', eta: '4 min' },
    { name: 'Fire Station', icon: <Flame size={16} strokeWidth={1.75} className="text-[#F59E0B]" />, dist: '1.1 km', eta: '6 min' },
    { name: 'ATM', icon: <CreditCard size={16} strokeWidth={1.75} className="text-[#22C55E]" />, dist: '0.2 km', eta: '1 min' },
    { name: 'Metro Station', icon: <Train size={16} strokeWidth={1.75} className="text-purple-600" />, dist: '0.8 km', eta: '5 min' },
    { name: 'Bus Stand', icon: <Bus size={16} strokeWidth={1.75} className="text-blue-500" />, dist: '0.4 km', eta: '3 min' },
    { name: 'Petrol Station', icon: <Fuel size={16} strokeWidth={1.75} className="text-orange-500" />, dist: '0.9 km', eta: '5 min' },
    { name: 'Hotels & Stay', icon: <Hotel size={16} strokeWidth={1.75} className="text-indigo-500" />, dist: '0.5 km', eta: '3 min' },
  ];

  const emergencyContacts = [
    { label: 'Police Control', number: '100 / 112', desc: 'Emergency response' },
    { label: 'Ambulance', number: '108', desc: 'Medical emergencies' },
    { label: 'Fire Service', number: '101', desc: 'Fire & rescue' },
    { label: "Women's Helpline", number: '1091', desc: '24/7 Women security' },
    { label: 'Child Helpline', number: '1098', desc: '24/7 Child protection' },
  ];

  const communityReports = [
    {
      id: 1,
      user: 'Verified Resident',
      time: '12m ago',
      severity: 'Low',
      text: 'Police patrol car stationed near the north railway gate.',
    },
    {
      id: 2,
      user: 'Community Guide',
      time: '2h ago',
      severity: 'Moderate',
      text: 'Street lighting maintenance completed along the main market road.',
    },
  ];

  return (
    <aside className="w-full h-full bg-white flex flex-col z-20 select-none overflow-hidden font-[Inter,sans-serif]">
      {/* ── 1. LOCATION HEADER ROW ───────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="text-[14px] font-semibold text-[#2563EB] hover:underline flex items-center gap-2 cursor-pointer"
        >
          <span>&larr; Back to Map</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              saved
                ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                : 'bg-[#F8FAFC] border-[#E5E7EB] hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
            title="Bookmark Place"
          >
            <Bookmark size={20} strokeWidth={1.75} fill={saved ? '#2563EB' : 'none'} />
          </button>

          <button
            type="button"
            onClick={() => onOpenShareModal?.()}
            className="w-10 h-10 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer"
            title="Share Place"
          >
            <Share2 size={20} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer"
            title="Close Sheet"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTAINER ──── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        {/* ── 2. LOCATION TITLE BLOCK ── */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-extrabold text-[#0F172A] leading-tight">
              {loc.name}
            </h1>
            <CheckCircle2 size={24} strokeWidth={1.75} className="text-[#2563EB] shrink-0" fill="#2563EB" stroke="#FFFFFF" />
          </div>
          <p className="text-[16px] text-[#64748B] font-medium mt-1">
            {loc.city || 'Coimbatore'}, Tamil Nadu, India · {loc.category || 'Monitored Zone'}
          </p>
        </div>

        {/* ── 3. SAFETY CARD ── */}
        <div className="px-4 py-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" stroke="#E2E8F0" strokeWidth="5.5" fill="transparent" />
                <circle
                  cx="32" cy="32" r="26"
                  stroke={b.color || '#22C55E'}
                  strokeWidth="5.5"
                  strokeDasharray="163"
                  strokeDashoffset={163 - ((ds?.overall || loc.score || 86) / 100) * 163}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[20px] font-extrabold text-[#0F172A]">
                {ds?.overall || loc.score || 86}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[18px] font-extrabold text-[#0F172A]">
                <span>{ds?.band || b.label || 'Very Safe'}</span>
                <CheckCircle2 size={16} strokeWidth={1.75} className="text-[#22C55E]" />
              </div>
              <div className="text-[14px] text-[#64748B] mt-1">
                {ds ? `Confidence: ${ds.confidence}%` : 'Updated today'} · Verified
              </div>
              <div className="text-[12px] font-bold text-[#22C55E] mt-1 uppercase tracking-wider">
                AI Spatial Risk Assessment
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. QUICK ACTIONS ── */}
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] group-hover:bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] transition-colors">
                <Bookmark size={20} strokeWidth={1.75} className={saved ? 'text-[#2563EB]' : ''} fill={saved ? '#2563EB' : 'none'} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Save</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenShareModal?.()}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] group-hover:bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] transition-colors">
                <Share2 size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Share</span>
            </button>

            <button
              type="button"
              onClick={() => onStartRouteMode?.(loc)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] border border-blue-200 bg-[#EFF6FF] group-hover:bg-blue-100 flex items-center justify-center text-[#2563EB] transition-colors">
                <Navigation size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#2563EB]">Directions</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAlertsModal?.()}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] group-hover:bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] transition-colors">
                <Bell size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenReportModal?.()}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] group-hover:bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] transition-colors">
                <Flag size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Report</span>
            </button>
          </div>
        </div>

        {/* ── ACCORDION SECTIONS ── */}
        <div className="border border-[#F1F5F9] rounded-[12px] overflow-hidden mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* 1. Safety Scores */}
          <AccordionSection
            title="Safety Scores"
            icon={<Shield size={16} className="text-[#2563EB]" />}
            badge={`${ds?.overall || loc.score || 86}/100`}
            defaultOpen={true}
          >
            {!dynamicSafetyScore ? (
              <div className="space-y-4">
                <ShimmerBlock height="32px" />
                <ShimmerBlock height="32px" />
                <ShimmerBlock height="32px" />
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((c, idx) => (
                  <CategoryBar key={idx} label={c.label} score={c.score} color={c.color} />
                ))}
              </div>
            )}
          </AccordionSection>

          {/* 2. Nearby Services */}
          <AccordionSection
            title="Nearby Services"
            icon={<MapPin size={16} className="text-[#22C55E]" />}
            badge={`${nearbyServices.length} found`}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 gap-4">
              {nearbyServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      {srv.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-[#0F172A] truncate">{srv.name}</div>
                      <div className="text-[12px] text-[#64748B] font-medium">{srv.dist}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#64748B] shrink-0 ml-2">{srv.eta}</span>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* 3. Emergency Contacts */}
          <AccordionSection
            title="Emergency Contacts"
            icon={<PhoneCall size={16} className="text-[#EF4444]" />}
            defaultOpen={false}
          >
            <div className="space-y-2">
              {emergencyContacts.map((em, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between hover:border-red-200 transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-bold text-[#0F172A]">{em.label}</div>
                    <div className="text-[12px] text-[#64748B]">{em.desc}</div>
                  </div>
                  <a
                    href={`tel:${em.number.split('/')[0].trim()}`}
                    className="px-4 py-2 rounded-lg bg-[#EF4444] hover:bg-red-700 text-white font-bold text-[13px] flex items-center gap-2 transition-colors"
                  >
                    <PhoneCall size={16} strokeWidth={1.75} />
                    <span>{em.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* 4. Community Reports */}
          <AccordionSection
            title="Community Reports"
            icon={<Flag size={16} className="text-[#F59E0B]" />}
            badge={`${communityReports.length}`}
            defaultOpen={false}
          >
            <div className="space-y-4">
              {communityReports.map((rep) => (
                <div
                  key={rep.id}
                  className="px-4 py-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#0F172A]">{rep.user}</span>
                      <CheckCircle2 size={16} strokeWidth={1.75} className="text-[#2563EB]" />
                    </div>
                    <span className="text-[12px] text-[#64748B]">{rep.time}</span>
                  </div>
                  <p className="text-[14px] text-[#0F172A] leading-normal">{rep.text}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#64748B]">Severity:</span>
                    <span className="text-[12px] font-bold text-[#22C55E]">{rep.severity}</span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onOpenReportModal?.()}
                className="w-full px-4 py-3 rounded-[12px] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#BFDBFE]"
              >
                <Plus size={16} strokeWidth={1.75} />
                <span>Submit Report</span>
              </button>
            </div>
          </AccordionSection>

          {/* 5. AI Intelligence / Summary */}
          <AccordionSection
            title="AI Intelligence / Summary"
            icon={<Sparkles size={16} className="text-[#A855F7]" />}
            defaultOpen={false}
          >
            <div className="space-y-4 text-[14px] text-[#0F172A]">
              {aiIntelligence ? (
                <>
                  <p className="text-[14px] text-[#334155] leading-relaxed">
                    {aiIntelligence.summary}
                  </p>
                  <div className="flex items-start gap-2">
                    <Shield size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>Top concern: {aiIntelligence.topConcern}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>Police response: {aiIntelligence.policeResponse}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Moon size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>{aiIntelligence.nighttimeAdvice}</span>
                  </div>
                  {aiIntelligence.recommendations?.length > 0 && (
                    <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">Recommendations</div>
                      {aiIntelligence.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[13px] text-[#334155]">
                          <CheckCircle2 size={16} className="text-[#22C55E] mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <Car size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>Safe during daytime with normal pedestrian activity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>Most common issue: Vehicle Theft (26%).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Moon size={16} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
                    <span>Avoid isolated streets after 10 PM.</span>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => onOpenExportModal?.()}
                className="w-full px-4 py-3 rounded-[12px] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#BFDBFE]"
              >
                <FileText size={16} />
                <span>Export AI Safety Briefing (PDF)</span>
              </button>
            </div>
          </AccordionSection>

          {/* 6. Weather & Traffic */}
          <AccordionSection
            title="Weather & Traffic"
            icon={<CloudRain size={16} className="text-[#0EA5E9]" />}
            defaultOpen={false}
          >
            {(weatherData || trafficData) ? (
              <div className="flex gap-4">
                {weatherData && (
                  <div className="flex-1 px-4 py-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={16} strokeWidth={1.75} className="text-[#F59E0B]" />
                      <span className="text-[14px] font-bold text-[#0F172A]">Weather</span>
                    </div>
                    <div className="text-[24px] font-extrabold text-[#0F172A]">{weatherData.temperature}°C</div>
                    <div className="text-[14px] text-[#64748B]">{weatherData.condition}</div>
                  </div>
                )}
                {trafficData && (
                  <div className="flex-1 px-4 py-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={16} strokeWidth={1.75} className="text-[#2563EB]" />
                      <span className="text-[14px] font-bold text-[#0F172A]">Traffic</span>
                    </div>
                    <div className="text-[24px] font-extrabold text-[#0F172A]">{trafficData.congestionLevel}</div>
                    <div className="text-[14px] text-[#64748B]">{trafficData.averageSpeed} km/h avg</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[14px] text-[#64748B]">No weather or traffic data available.</div>
            )}
          </AccordionSection>
        </div>

        {/* ── SAFETY AMENITIES ── */}
        <div className="mb-4">
          <div className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
            Safety Amenities
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Women Friendly',
              'Tourist Friendly',
              'Family Friendly',
              'Well Lit',
              'Police Patrol',
              'Verified Area',
              'Crowded',
            ].map((tag) => (
              <span key={tag} className="apple-chip px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[13px] text-[#334155] font-medium border border-[#E2E8F0]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── AI CRIME PREDICTION CARDS ── */}
        <div className="mb-4">
          <AIPredictionCard predictions={predictions} />
        </div>

      </div>

      {/* ── 11. STICKY FOOTER COMPARE ROUTES CARD ───────────── */}
      <div className="px-4 py-4 border-t border-[#E5E7EB] bg-white shrink-0">
        <div className="px-4 py-3 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="text-[14px] font-bold text-[#0F172A]">Compare Routes</div>
            <div className="text-[12px] text-[#64748B] font-medium">Safest · Balanced · Fastest</div>
          </div>
          <button
            type="button"
            onClick={() => onStartRouteMode?.(loc)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[8px] text-[14px] font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <ArrowUpRight size={16} strokeWidth={1.75} />
            <span>Compare</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
