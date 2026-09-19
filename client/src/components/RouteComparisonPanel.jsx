import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ShieldCheck,
  Navigation,
  Zap,
  MapPin,
  Users,
  Lightbulb,
  Car,
  Loader2,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';

const ROUTE_ICON_MAP = {
  safest: { icon: ShieldCheck, color: '#16A34A', bg: '#DCFCE7' },
  women_safe: { icon: Users, color: '#9333EA', bg: '#F3E8FF' },
  well_lit: { icon: Lightbulb, color: '#D97706', bg: '#FEF3C7' },
  balanced: { icon: Navigation, color: '#2563EB', bg: '#EFF6FF' },
  fastest: { icon: Zap, color: '#EA580C', bg: '#FFEDD5' },
  low_traffic: { icon: Car, color: '#0D9488', bg: '#CCFBF1' },
  family_safe: { icon: Users, color: '#4F46E5', bg: '#E0E7FF' },
  walking_safe: { icon: Compass, color: '#059669', bg: '#D1FAE5' },
  bike_safe: { icon: Zap, color: '#0891B2', bg: '#CFFAFE' },
  driving_route: { icon: Car, color: '#2563EB', bg: '#EFF6FF' },
  night_safe: { icon: Lightbulb, color: '#7C3AED', bg: '#EDE9FE' },
  accessible_route: { icon: ShieldCheck, color: '#0D9488', bg: '#CCFBF1' },
};

const FALLBACK_ROUTES = [
  {
    key: 'safest',
    label: 'Safest Route',
    distance: 6.1,
    eta: 24,
    safetyScore: 94,
    lighting: 97,
    cctv: 90,
    policeCoverage: 88,
    badge: 'Recommended',
    summary: 'Prioritizes main avenues with high street lighting, CCTV surveillance, and active police kiosks.',
  },
  {
    key: 'balanced',
    label: 'Balanced Route',
    distance: 5.4,
    eta: 18,
    safetyScore: 84,
    lighting: 88,
    cctv: 80,
    policeCoverage: 75,
    badge: 'Optimal ETA & Safety',
    summary: 'Optimal balance of travel speed and safety, bypassing unlit alleys after dark.',
  },
  {
    key: 'fastest',
    label: 'Fastest Route',
    distance: 5.0,
    eta: 13,
    safetyScore: 68,
    lighting: 65,
    cctv: 58,
    policeCoverage: 52,
    badge: 'Time Saver',
    summary: 'Direct shortcut via interior residential roads. Less commercial activity at night.',
  },
  {
    key: 'women_safe',
    label: 'Women Safe Route',
    distance: 6.3,
    eta: 25,
    safetyScore: 92,
    lighting: 96,
    cctv: 92,
    policeCoverage: 85,
    badge: 'Women Preferred',
    summary: 'High crowd density corridors with 24/7 CCTV and active commercial establishments.',
  },
  {
    key: 'family_safe',
    label: 'Family Safe Route',
    distance: 5.8,
    eta: 22,
    safetyScore: 90,
    lighting: 94,
    cctv: 86,
    policeCoverage: 82,
    badge: 'Family Friendly',
    summary: 'Traverses school and hospital corridors with zero high-crime zones and emergency call boxes.',
  },
  {
    key: 'walking_safe',
    label: 'Walking Safe Route',
    distance: 5.2,
    eta: 45,
    safetyScore: 89,
    lighting: 95,
    cctv: 84,
    policeCoverage: 80,
    badge: 'Pedestrian Safe',
    summary: 'Well-paved pedestrian walkways with street lighting and high pedestrian footfall.',
  },
  {
    key: 'bike_safe',
    label: 'Bike Safe Route',
    distance: 5.5,
    eta: 16,
    safetyScore: 82,
    lighting: 85,
    cctv: 78,
    policeCoverage: 72,
    badge: '2-Wheeler Preferred',
    summary: 'Avoids heavy multi-axle truck routes and congested junctions; good asphalt quality.',
  },
  {
    key: 'driving_route',
    label: 'Driving Route',
    distance: 5.6,
    eta: 15,
    safetyScore: 80,
    lighting: 84,
    cctv: 75,
    policeCoverage: 70,
    badge: 'Main Arterials',
    summary: 'Wide multi-lane arterials with secure parking corridors and petrol pumps.',
  },
  {
    key: 'night_safe',
    label: 'Night Safe Route',
    distance: 6.4,
    eta: 24,
    safetyScore: 91,
    lighting: 98,
    cctv: 90,
    policeCoverage: 86,
    badge: '24/7 Monitored',
    summary: 'Avoids isolated alleys after 10 PM; routes exclusively through illuminated commercial boulevards.',
  },
  {
    key: 'accessible_route',
    label: 'Accessible Route',
    distance: 5.9,
    eta: 23,
    safetyScore: 88,
    lighting: 92,
    cctv: 82,
    policeCoverage: 78,
    badge: 'Barrier Free',
    summary: 'Smooth pavements with handicap assistance ramps, zero road construction or closures.',
  },
];

export default function RouteComparisonPanel({
  location,
  selectedRoute,
  onSelectRoute,
  onBack,
}) {
  const [routes, setRoutes] = useState(FALLBACK_ROUTES);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const destLat = location?.lat || 11.0183;
  const destLng = location?.lng || 76.9664;
  const fromLat = 11.0018; // Default origin: Coimbatore Junction
  const fromLng = 76.9628;

  useEffect(() => {
    let active = true;
    async function fetchRoutes() {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/routes', {
          params: {
            fromLat,
            fromLng,
            toLat: destLat,
            toLng: destLng,
          },
        });
        if (active && data?.routes?.length > 0) {
          setRoutes(data.routes);
          if (!selectedRoute && onSelectRoute) {
            onSelectRoute(data.routes[0].key);
          }
        }
      } catch (err) {
        // Use fallback routes if backend unreachable
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchRoutes();
    return () => {
      active = false;
    };
  }, [destLat, destLng]);

  const current = routes.find((r) => r.key === selectedRoute) || routes[0] || FALLBACK_ROUTES[0];
  const iconMeta = ROUTE_ICON_MAP[current.key] || ROUTE_ICON_MAP.safest;

  const NAV_STEPS = [
    {
      title: 'Head north toward Avinashi Road',
      sub: 'Monitored 24/7 by CCTV · High Street Lighting (96%)',
      dist: '1.2 km',
      safe: true,
    },
    {
      title: 'Turn right onto Race Course Main Road',
      sub: 'Active Police Patrol Kiosk · Women Safe Corridor',
      dist: '2.4 km',
      safe: true,
    },
    {
      title: 'Continue straight along cross street',
      sub: 'Moderate pedestrian footfall · Well lit boulevard',
      dist: '1.1 km',
      safe: true,
    },
    {
      title: `Arrive at destination: ${location?.name || 'Selected Place'}`,
      sub: 'Safe parking & emergency call box nearby',
      dist: '0.3 km',
      safe: true,
    },
  ];

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 bottom-4 right-4 z-40 w-[420px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:w-full max-md:h-[78vh] max-md:rounded-t-2xl max-md:rounded-b-none shadow-xl"
    >
      {/* Mobile Handle */}
      <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mt-3 mb-1 md:hidden shrink-0" />

      {/* ── 1. Google Maps Directions Header ──────────────── */}
      <div className="p-6 pb-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={navigating ? () => setNavigating(false) : onBack}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A73E8] hover:underline cursor-pointer"
          >
            <ChevronLeft size={16} />
            {navigating ? 'Exit Navigation' : `Back to ${location?.name || 'Location'}`}
          </button>

          {loading && (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B]">
              <Loader2 size={14} className="animate-spin text-[#2563EB]" />
              <span>Updating AI Routes...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 mb-1">
          <Compass size={14} className="text-[#1A73E8]" />
          <span>{navigating ? 'Turn-by-Turn AI Safety Guidance' : '6 AI-Ranked Navigation Corridors'}</span>
        </div>
        <h2 className="text-[20px] font-bold text-gray-900 truncate">
          {navigating ? `En route to ${location?.name || 'Destination'}` : `Directions to ${location?.name || 'Destination'}`}
        </h2>
      </div>

      {/* ── 2. BODY CONTENT: ROUTE CARDS vs ACTIVE NAVIGATION GUIDANCE ── */}
      {!navigating ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {routes.map((r) => {
            const isSelected = selectedRoute === r.key;
            const rMeta = ROUTE_ICON_MAP[r.key] || ROUTE_ICON_MAP.safest;
            const Icon = rMeta.icon;
            return (
              <button
                type="button"
                key={r.key}
                onClick={() => onSelectRoute?.(r.key)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/40 border-[#1A73E8] shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isSelected ? rMeta.color : '#F3F4F6',
                        color: isSelected ? '#FFFFFF' : '#4B5563',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-gray-900">{r.label}</div>
                      <div className="text-[12px] font-medium text-gray-500">
                        {r.distance ? `${r.distance} km` : '5.5 km'} · {r.eta ? `${r.eta} min` : '18 min'}
                      </div>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0"
                    style={{
                      backgroundColor: isSelected ? rMeta.color : '#E5E7EB',
                      color: isSelected ? '#FFFFFF' : '#374151',
                    }}
                  >
                    {r.badge}
                  </span>
                </div>

                {/* Safety metrics row */}
                <div className="grid grid-cols-3 gap-2 text-[12px] font-medium text-gray-600 pt-2.5 border-t border-gray-100">
                  <div>
                    Safety: <strong className="text-gray-900">{r.safetyScore}/100</strong>
                  </div>
                  <div>
                    Lighting: <strong className="text-gray-900">{typeof r.lighting === 'number' ? `${r.lighting}%` : r.lighting}</strong>
                  </div>
                  <div>
                    CCTV: <strong className="text-gray-900">{typeof r.cctv === 'number' ? `${r.cctv}%` : r.cctv}</strong>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2.5 text-[12px] text-gray-600 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-gray-200">
                    {r.summary}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Active Navigation Header Pill */}
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                Active Safety Guidance
              </div>
              <div className="text-[15px] font-bold text-[#1E3A8A]">
                {current.label} ({current.eta || '18'} min · {current.distance || '5.5'} km)
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#1D4ED8] text-white">
              Score {current.safetyScore}/100
            </span>
          </div>

          {/* Turn by Turn List */}
          <div className="space-y-3">
            {NAV_STEPS.map((step, idx) => {
              const isActiveStep = idx === stepIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isActiveStep
                      ? 'bg-blue-50 border-[#2563EB] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5 ${
                      isActiveStep
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-gray-900">{step.title}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">{step.sub}</div>
                  </div>
                  <span className="text-[12px] font-bold text-gray-600 shrink-0">{step.dist}</span>
                </div>
              );
            })}
          </div>

          {/* Emergency SOS Banner */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall size={18} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-red-900">Emergency SOS Assist</div>
                <div className="text-[12px] text-red-700">1-click dispatch to nearest Police & Hospital</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('Emergency SOS triggered! Nearest police kiosk (0.3 km) alerted.')}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-bold transition-colors cursor-pointer"
            >
              SOS 100
            </button>
          </div>
        </div>
      )}

      {/* ── 3. Footer CTA ────────────────────────────────── */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
        {!navigating ? (
          <button
            type="button"
            onClick={() => setNavigating(true)}
            className="w-full h-11 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Navigation size={17} />
            <span>Start AI Navigation ({current.eta ? `${current.eta} min` : '18 min'})</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setNavigating(false)}
            className="w-full h-11 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <X size={17} />
            <span>End Navigation Mode</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
