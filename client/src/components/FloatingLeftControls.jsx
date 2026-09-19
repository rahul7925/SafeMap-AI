import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Filter, ChevronLeft, ChevronRight, Check,
  Calendar, Shield, Info, SlidersHorizontal, Sparkles,
  Radio, Flame, Users, Car, Eye, BarChart3, MapPin,
  MessageSquare, ShieldCheck
} from 'lucide-react';

export default function FloatingLeftControls({
  layerDensity,
  setLayerDensity,
  layerRadius,
  setLayerRadius,
  layerPoints,
  setLayerPoints,
  layerSafeZones,
  setLayerSafeZones,
  layerPolice,
  setLayerPolice,
  layerHospitals,
  setLayerHospitals,
  layerCommunityReports,
  setLayerCommunityReports,
  layerAiPrediction,
  setLayerAiPrediction,
  layerTraffic,
  setLayerTraffic,
  layerSatellite,
  setLayerSatellite,
  timeFilter,
  crimeFilter,
  dateRange,
  safetyFocus,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute top-4 left-4 z-30 select-none pointer-events-auto font-[Inter,sans-serif]">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-white text-[#0F172A] font-semibold text-[15px] transition-all cursor-pointer"
          >
            <Layers size={20} strokeWidth={1.75} className="text-[#2563EB]" />
            <span>Map Layers & Filters</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[13px] font-bold">
              Index 72
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[280px] bg-white/95 backdrop-blur-md rounded-[12px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col max-h-[calc(100vh-100px)]"
          >
            {/* ── Header Row ── */}
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white/80">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={20} strokeWidth={1.75} className="text-[#2563EB]" />
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#0F172A]">
                  GIS Map Controls
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize Controls"
              >
                <ChevronLeft size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
              {/* ── 1. MAP LAYERS (Zero Emojis - Lucide React Vector Icons Only) ── */}
              <div>
                <div className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-4">
                  MAP LAYERS (GIS ENGINE)
                </div>

                <div className="space-y-2">
                  {/* Layer 1: Crime Density Heatmap */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                        <BarChart3 size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Crime Density</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerDensity(!layerDensity)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerDensity ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerDensity ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 2: Crime Influence Radius */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center">
                        <Radio size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Crime Radius</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerRadius(!layerRadius)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerRadius ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerRadius ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 3: Crime Markers (Clustered) */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-red-50 text-[#EF4444] flex items-center justify-center">
                        <MapPin size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Crime Markers</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerPoints(!layerPoints)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerPoints ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerPoints ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 4: Community Reports */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                        <MessageSquare size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Community Reports</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerCommunityReports(!layerCommunityReports)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerCommunityReports ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerCommunityReports ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 5: Police Presence */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                        <Shield size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Police Presence</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerPolice(!layerPolice)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerPolice ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerPolice ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 6: Hospitals & Emergency */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-red-50 text-[#EF4444] flex items-center justify-center">
                        <Flame size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Emergency Services</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerHospitals(!layerHospitals)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerHospitals ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerHospitals ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 7: Safe Zones */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#22C55E] flex items-center justify-center">
                        <ShieldCheck size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Safe Zones</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerSafeZones(!layerSafeZones)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerSafeZones ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerSafeZones ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 8: Traffic Layer */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                        <Car size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Traffic Congestion</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerTraffic(!layerTraffic)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerTraffic ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerTraffic ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 9: AI Prediction Layer */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Sparkles size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">AI Risk Prediction</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerAiPrediction(!layerAiPrediction)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerAiPrediction ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerAiPrediction ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layer 10: Satellite View */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-[#0F172A]">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#475569] flex items-center justify-center">
                        <Layers size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-[14px] font-medium">Satellite View</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLayerSatellite(!layerSatellite)}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 relative cursor-pointer ${
                        layerSatellite ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                          layerSatellite ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── 2. FILTERS (16px padding inside cards, 8px gap) ── */}
              <div>
                <div className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-4">
                  FILTERS
                </div>
                <div className="space-y-2">
                  <div className="p-4 rounded-[12px] border border-[#E5E7EB] bg-white/90 hover:border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} strokeWidth={1.75} className="text-[#64748B]" />
                      <div>
                        <div className="text-[12px] font-medium text-[#94A3B8]">Time</div>
                        <div className="text-[14px] font-bold text-[#0F172A]">{timeFilter || 'All Time'}</div>
                      </div>
                    </div>
                    <Calendar size={18} strokeWidth={1.75} className="text-[#94A3B8]" />
                  </div>

                  <div className="p-4 rounded-[12px] border border-[#E5E7EB] bg-white/90 hover:border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Filter size={20} strokeWidth={1.75} className="text-[#64748B]" />
                      <div>
                        <div className="text-[12px] font-medium text-[#94A3B8]">Crime Type</div>
                        <div className="text-[14px] font-bold text-[#0F172A]">{crimeFilter || 'All Crimes'}</div>
                      </div>
                    </div>
                    <ChevronRight size={20} strokeWidth={1.75} className="text-[#94A3B8]" />
                  </div>

                  <div className="p-4 rounded-[12px] border border-[#E5E7EB] bg-white/90 hover:border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Shield size={20} strokeWidth={1.75} className="text-[#64748B]" />
                      <div>
                        <div className="text-[12px] font-medium text-[#94A3B8]">Safety Focus</div>
                        <div className="text-[14px] font-bold text-[#0F172A]">{safetyFocus || 'All'}</div>
                      </div>
                    </div>
                    <ChevronRight size={20} strokeWidth={1.75} className="text-[#94A3B8]" />
                  </div>
                </div>
              </div>

              {/* ── 3. LIVE SAFETY INDEX CARD (12px Card Radius) ── */}
              <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    Live Safety Index
                  </span>
                  <Info size={18} strokeWidth={1.75} className="text-[#94A3B8]" title="Citywide Real-time Average" />
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[32px] font-extrabold text-[#0F172A] leading-none">
                    72
                  </span>
                  <span className="text-[14px] font-bold text-[#F59E0B]">
                    Moderate
                  </span>
                </div>
                <div className="text-[13px] text-[#64748B] font-medium mt-1">
                  City Average
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
