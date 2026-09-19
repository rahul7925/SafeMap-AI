import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Navigation, Bookmark, Share2, Flag, Bell, Sparkles,
  CheckCircle2, Clock, PhoneCall, ChevronRight, Shield,
  MapPin, ArrowUpRight, Car, Video, Moon, Clock3,
  Hospital as HospitalIcon, Flame, CreditCard, Train,
  Bus, Hotel, Fuel, Plus
} from 'lucide-react';
import { scoreBand } from '../utils/theme.js';

/* ── Progress Bar (6px height, 999px radius) ─────────────────────────────── */
function CategoryBar({ label, score, color = '#22C55E' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-[#0F172A]">{label}</span>
        <span className="text-[14px] font-bold text-[#0F172A] tabular-nums">
          {score}/100
        </span>
      </div>
      <div className="h-[6px] w-full bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-[6px] rounded-full transition-all duration-350"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function MobileBottomSheet({
  location,
  onClose,
  onStartRouteMode,
  onOpenReportModal,
}) {
  // Snap Points: 0 = Peek (30%), 1 = Half (60%), 2 = Full (100%)
  const [snapIndex, setSnapIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Category Scores');
  const [saved, setSaved] = useState(false);

  if (!location) return null;
  const loc = location;
  const b = scoreBand(loc.score || 86);

  const categories = [
    { label: 'Women Safety', score: 83, color: '#22C55E' },
    { label: 'Night Safety', score: 61, color: '#2563EB' },
    { label: 'Child Safety', score: 84, color: '#6366F1' },
    { label: 'Traffic Safety', score: 61, color: '#F59E0B' },
    { label: 'Tourist Safety', score: 79, color: '#0EA5E9' },
    { label: 'Senior Citizen Safety', score: 78, color: '#10B981' },
  ];

  const nearbyServices = [
    { name: 'Police Station', icon: <Shield size={20} strokeWidth={1.75} className="text-[#2563EB]" />, dist: '0.3 km', eta: '2 min' },
    { name: 'Hospital', icon: <HospitalIcon size={20} strokeWidth={1.75} className="text-[#EF4444]" />, dist: '0.6 km', eta: '4 min' },
    { name: 'Fire Station', icon: <Flame size={20} strokeWidth={1.75} className="text-[#F59E0B]" />, dist: '1.1 km', eta: '6 min' },
    { name: 'ATM', icon: <CreditCard size={20} strokeWidth={1.75} className="text-[#22C55E]" />, dist: '0.2 km', eta: '1 min' },
    { name: 'Metro Station', icon: <Train size={20} strokeWidth={1.75} className="text-purple-600" />, dist: '0.8 km', eta: '5 min' },
    { name: 'Bus Stand', icon: <Bus size={20} strokeWidth={1.75} className="text-blue-500" />, dist: '0.4 km', eta: '3 min' },
    { name: 'Petrol Station', icon: <Fuel size={20} strokeWidth={1.75} className="text-orange-500" />, dist: '0.9 km', eta: '5 min' },
    { name: 'Hotels & Stay', icon: <Hotel size={20} strokeWidth={1.75} className="text-indigo-500" />, dist: '0.5 km', eta: '3 min' },
  ];

  const emergencyContacts = [
    { label: 'Police Control', number: '100 / 112', desc: 'Emergency response' },
    { label: 'Ambulance', number: '108', desc: 'Medical emergencies' },
    { label: 'Fire Service', number: '101', desc: 'Fire & rescue' },
    { label: "Women's Helpline", number: '1091', desc: '24/7 Women security' },
    { label: 'Child Helpline', number: '1098', desc: '24/7 Child protection' },
  ];

  const snapHeights = ['30vh', '60vh', '94vh'];

  const handleDragEnd = (_, info) => {
    const y = info.offset.y;
    if (y < -60 && snapIndex < 2) {
      setSnapIndex(snapIndex + 1);
    } else if (y > 60 && snapIndex > 0) {
      setSnapIndex(snapIndex - 1);
    } else if (y > 140 && snapIndex === 0) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ height: snapHeights[snapIndex], y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md rounded-t-[20px] border-t border-[#E5E7EB] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col select-none overflow-hidden font-[Inter,sans-serif]"
    >
      {/* ── DRAG HANDLE PILL ─────────────────────────────────────────────── */}
      <div
        onClick={() => setSnapIndex((prev) => (prev < 2 ? prev + 1 : 0))}
        className="pt-3 pb-2 flex items-center justify-center cursor-pointer shrink-0"
      >
        <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full" />
      </div>

      {/* ── HEADER ROW ───────────────────────────────────────────────────── */}
      <div className="px-6 pt-2 pb-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[24px] font-extrabold text-[#0F172A]">
              {loc.name}
            </h2>
            <CheckCircle2 size={20} strokeWidth={1.75} className="text-[#2563EB]" />
          </div>
          <p className="text-[14px] text-[#64748B] font-medium">
            {loc.city || 'Coimbatore'} · {loc.category || 'Monitored Zone'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              saved
                ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#64748B]'
            }`}
          >
            <Bookmark size={20} strokeWidth={1.75} fill={saved ? '#2563EB' : 'none'} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTAINER WITH EXACT 24PX (space-y-6) WHITESPACE ──── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
        {/* ── 1. SAFETY SCORE CARD ── */}
        <div className="p-5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" stroke="#E2E8F0" strokeWidth="5.5" fill="transparent" />
                <circle
                  cx="32" cy="32" r="26"
                  stroke="#22C55E"
                  strokeWidth="5.5"
                  strokeDasharray="163"
                  strokeDashoffset={163 - ((loc.score || 86) / 100) * 163}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[20px] font-extrabold text-[#0F172A]">
                {loc.score || 86}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[18px] font-extrabold text-[#0F172A]">
                <span>Very Safe</span>
                <CheckCircle2 size={18} strokeWidth={1.75} className="text-[#22C55E]" />
              </div>
              <div className="text-[13px] text-[#64748B] mt-0.5">
                Updated today · Verified
              </div>
              <div className="text-[12px] font-bold text-[#22C55E] mt-1 uppercase tracking-wider">
                AI Spatial Risk Assessment
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. QUICK ACTIONS (Identical 52x52 Containers) ── */}
        <div>
          <div className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
            Quick Actions
          </div>
          <div className="grid grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
                <Bookmark size={20} strokeWidth={1.75} className={saved ? 'text-[#2563EB]' : ''} fill={saved ? '#2563EB' : 'none'} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Save</span>
            </button>

            <button
              type="button"
              onClick={() => alert(`Sharing link for ${loc.name}...`)}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
                <Share2 size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Share</span>
            </button>

            <button
              type="button"
              onClick={() => onStartRouteMode?.(loc)}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[12px] border border-blue-200 bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                <Navigation size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#2563EB]">Directions</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Real-time geofence alerts enabled for this zone.')}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
                <Bell size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenReportModal?.()}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
                <Flag size={20} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] font-semibold text-[#0F172A]">Report</span>
            </button>
          </div>
        </div>

        {/* ── 3. AI SUMMARY ── */}
        <div className="p-5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 mb-3.5">
            <Sparkles size={20} strokeWidth={1.75} className="text-[#2563EB]" />
            <span className="text-[16px] font-bold text-[#0F172A]">
              AI Safety Summary
            </span>
          </div>
          <div className="space-y-3 text-[14px] text-[#0F172A]">
            <div className="flex items-start gap-3">
              <Car size={20} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
              <span>Safe during daytime with normal pedestrian activity.</span>
            </div>
            <div className="flex items-start gap-3">
              <Shield size={20} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
              <span>Most common issue: Vehicle Theft (26%).</span>
            </div>
            <div className="flex items-start gap-3">
              <Video size={20} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
              <span>Active police patrol and CCTV coverage available.</span>
            </div>
            <div className="flex items-start gap-3">
              <Moon size={20} strokeWidth={1.75} className="text-[#64748B] shrink-0 mt-0.5" />
              <span>Avoid isolated streets after 10 PM.</span>
            </div>
          </div>
        </div>

        {/* ── 4. SAFETY AMENITIES (Apple Maps chips) ── */}
        <div>
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
              <span key={tag} className="apple-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── 5. CATEGORY SCORES / BREAKDOWN / TIMELINE ── */}
        <div>
          <div className="flex border-b border-[#E5E7EB] mb-5">
            {['Category Scores', 'Crime Breakdown', '24H Timeline'].map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-3 text-[14px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-[#64748B]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {activeTab === 'Category Scores' && (
            <div className="space-y-4">
              {categories.map((c, idx) => (
                <CategoryBar key={idx} label={c.label} score={c.score} color={c.color} />
              ))}
            </div>
          )}

          {activeTab === 'Crime Breakdown' && (
            <div className="space-y-4">
              <CategoryBar label="Vehicle Theft" score={26} color="#2563EB" />
              <CategoryBar label="Robbery" score={18} color="#2563EB" />
              <CategoryBar label="Harassment" score={14} color="#2563EB" />
              <CategoryBar label="Assault" score={12} color="#2563EB" />
              <CategoryBar label="Cyber Crime" score={8} color="#2563EB" />
              <CategoryBar label="Others" score={22} color="#2563EB" />
            </div>
          )}

          {activeTab === '24H Timeline' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-center">
                <div className="text-[13px] font-bold text-[#64748B]">Morning (06–12h)</div>
                <div className="text-[17px] font-extrabold text-[#22C55E] mt-1">Safe (92/100)</div>
              </div>
              <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-center">
                <div className="text-[13px] font-bold text-[#64748B]">Afternoon (12–18h)</div>
                <div className="text-[17px] font-extrabold text-[#22C55E] mt-1">Safe (88/100)</div>
              </div>
              <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-center">
                <div className="text-[13px] font-bold text-[#64748B]">Evening (18–00h)</div>
                <div className="text-[17px] font-extrabold text-[#F59E0B] mt-1">Moderate (74/100)</div>
              </div>
              <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-center">
                <div className="text-[13px] font-bold text-[#64748B]">Night (00–06h)</div>
                <div className="text-[17px] font-extrabold text-[#EF4444] mt-1">Caution (61/100)</div>
              </div>
            </div>
          )}
        </div>

        {/* ── 6. NEARBY SERVICES (Every card 56px height) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Nearby Services
            </span>
            <span className="text-[13px] text-[#64748B] font-medium">Within 1.5 km</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nearbyServices.map((srv, idx) => (
              <div
                key={idx}
                className="h-[56px] px-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    {srv.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-[#0F172A] truncate">{srv.name}</div>
                    <div className="text-[12px] text-[#64748B] font-medium">{srv.dist}</div>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-[#64748B] shrink-0 ml-1">{srv.eta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. EMERGENCY CONTACTS ── */}
        <div>
          <div className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
            Emergency Contacts
          </div>
          <div className="space-y-2.5">
            {emergencyContacts.map((em, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between"
              >
                <div>
                  <div className="text-[14px] font-bold text-[#0F172A]">{em.label}</div>
                  <div className="text-[12px] text-[#64748B]">{em.desc}</div>
                </div>
                <a
                  href={`tel:${em.number.split('/')[0].trim()}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EF4444] text-white font-bold text-[13px] flex items-center gap-1.5"
                >
                  <PhoneCall size={16} strokeWidth={1.75} />
                  <span>{em.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. STICKY FOOTER COMPARE ROUTES CARD ─────────────────────────── */}
      <div className="p-4 border-t border-[#E5E7EB] bg-white shrink-0">
        <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-[#0F172A]">Compare Routes</div>
            <div className="text-[12px] text-[#64748B] font-medium">Safest · Balanced · Fastest</div>
          </div>
          <button
            type="button"
            onClick={() => onStartRouteMode?.(loc)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[14px] font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <ArrowUpRight size={18} strokeWidth={1.75} />
            <span>Compare</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
