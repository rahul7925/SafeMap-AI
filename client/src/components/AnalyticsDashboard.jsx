import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Shield,
  MapPin, AlertTriangle, Users, ArrowLeft, PieChart,
  Activity, Target, CheckCircle2, Clock, ChevronRight
} from 'lucide-react';

/* ── Inline SVG Mini-Charts ────────────────────────────────────────────── */
function MiniBarChart({ data = [], color = '#2563EB', height = 64 }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const barW = Math.max(6, Math.floor(200 / data.length) - 3);

  return (
    <svg viewBox={`0 0 ${data.length * (barW + 3)} ${height}`} className="w-full" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.count / max) * (height - 8);
        return (
          <g key={i}>
            <rect
              x={i * (barW + 3)}
              y={height - h - 4}
              width={barW}
              height={h}
              rx={3}
              fill={color}
              opacity={0.8}
            />
            <text
              x={i * (barW + 3) + barW / 2}
              y={height}
              textAnchor="middle"
              fontSize="7"
              fill="#94A3B8"
            >
              {d.month?.slice(0, 1) || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MiniDonut({ segments = [], size = 80 }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;
  let cumulative = 0;
  const radius = 30;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const start = cumulative / total;
        cumulative += seg.count;
        const end = cumulative / total;
        const largeArc = end - start > 0.5 ? 1 : 0;
        const x1 = cx + radius * Math.cos(2 * Math.PI * start - Math.PI / 2);
        const y1 = cy + radius * Math.sin(2 * Math.PI * start - Math.PI / 2);
        const x2 = cx + radius * Math.cos(2 * Math.PI * end - Math.PI / 2);
        const y2 = cy + radius * Math.sin(2 * Math.PI * end - Math.PI / 2);
        const colors = ['#2563EB', '#EF4444', '#F59E0B', '#22C55E', '#7C3AED', '#64748B'];
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={colors[i % colors.length]}
            opacity={0.85}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={18} fill="white" />
    </svg>
  );
}

function TrendBadge({ trend }) {
  if (trend === 'improving') return <span className="flex items-center gap-1 text-emerald-600 text-[12px] font-semibold"><TrendingDown size={13} /> Improving</span>;
  if (trend === 'declining') return <span className="flex items-center gap-1 text-red-600 text-[12px] font-semibold"><TrendingUp size={13} /> Declining</span>;
  return <span className="flex items-center gap-1 text-amber-600 text-[12px] font-semibold"><Minus size={13} /> Stable</span>;
}

/* ── Main Analytics Dashboard Component ──────────────────────────────── */
export default function AnalyticsDashboard({ isOpen, onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    axios.get('http://localhost:5000/api/analytics?city=Coimbatore')
      .then(({ data }) => {
        setAnalytics(data.analytics || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-6 font-[Inter,sans-serif]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-[960px] max-h-[85vh] bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <BarChart3 size={20} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[18px] font-bold text-[#0F172A]">Crime Analytics</div>
              <div className="text-[13px] text-[#64748B]">Coimbatore • Last 30 Days</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] text-[14px] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Map
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[180px] rounded-[16px] bg-[#F1F5F9] animate-pulse" />
              ))}
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Monthly Trend */}
              <div className="col-span-2 p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={18} strokeWidth={1.75} className="text-[#2563EB]" />
                    <span className="text-[14px] font-bold text-[#0F172A]">Monthly Crime Trend</span>
                  </div>
                  <TrendBadge trend={analytics.predictionAccuracy?.trend || 'stable'} />
                </div>
                <MiniBarChart data={analytics.monthlyTrend || []} color="#2563EB" height={80} />
              </div>

              {/* 2. Prediction Accuracy */}
              <div className="p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} strokeWidth={1.75} className="text-purple-600" />
                  <span className="text-[14px] font-bold text-[#0F172A]">AI Accuracy</span>
                </div>
                <div className="text-center">
                  <div className="text-[40px] font-extrabold text-[#0F172A] leading-none mb-1">
                    {analytics.predictionAccuracy?.overall || 89}%
                  </div>
                  <div className="text-[13px] text-[#64748B]">
                    Overall Model Accuracy
                  </div>
                  <div className="mt-3 text-[12px] text-[#94A3B8]">
                    Last Month: {analytics.predictionAccuracy?.lastMonth || 91}%
                  </div>
                </div>
              </div>

              {/* 3. Crime Type Distribution */}
              <div className="p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={18} strokeWidth={1.75} className="text-[#F59E0B]" />
                  <span className="text-[14px] font-bold text-[#0F172A]">Crime Types</span>
                </div>
                <div className="flex items-center gap-4">
                  <MiniDonut segments={analytics.crimeTypeDistribution || []} size={72} />
                  <div className="space-y-1 flex-1">
                    {(analytics.crimeTypeDistribution || []).slice(0, 4).map((ct, i) => {
                      const colors = ['#2563EB', '#EF4444', '#F59E0B', '#22C55E'];
                      return (
                        <div key={i} className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                            <span className="text-[#0F172A] font-medium">{ct.type}</span>
                          </div>
                          <span className="text-[#64748B] font-semibold">{ct.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. District Ranking */}
              <div className="p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} strokeWidth={1.75} className="text-[#22C55E]" />
                  <span className="text-[14px] font-bold text-[#0F172A]">District Ranking</span>
                </div>
                <div className="space-y-2">
                  {(analytics.districtRanking || []).slice(0, 5).map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-[#94A3B8] w-4">{i + 1}</span>
                        <span className="text-[13px] font-medium text-[#0F172A]">{d.district}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#0F172A]">{d.score}</span>
                        <TrendBadge trend={d.trend} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Community Reports */}
              <div className="p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} strokeWidth={1.75} className="text-[#F97316]" />
                  <span className="text-[14px] font-bold text-[#0F172A]">Community Reports</span>
                </div>
                {analytics.communityReports && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-[#F8FAFC]">
                      <div className="text-[20px] font-extrabold text-[#0F172A]">{analytics.communityReports.total}</div>
                      <div className="text-[11px] text-[#64748B]">Total</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-emerald-50">
                      <div className="text-[20px] font-extrabold text-emerald-700">{analytics.communityReports.verified}</div>
                      <div className="text-[11px] text-[#64748B]">Verified</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-amber-50">
                      <div className="text-[20px] font-extrabold text-amber-700">{analytics.communityReports.pending}</div>
                      <div className="text-[11px] text-[#64748B]">Pending</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-red-50">
                      <div className="text-[20px] font-extrabold text-red-700">{analytics.communityReports.rejected}</div>
                      <div className="text-[11px] text-[#64748B]">Rejected</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Emergency Response */}
              <div className="p-5 rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} strokeWidth={1.75} className="text-[#EF4444]" />
                  <span className="text-[14px] font-bold text-[#0F172A]">Emergency Response</span>
                </div>
                {analytics.emergencyResponse && (
                  <div className="space-y-3">
                    <div className="text-center p-3 rounded-xl bg-[#F8FAFC]">
                      <div className="text-[28px] font-extrabold text-[#0F172A]">{analytics.emergencyResponse.averageTime}</div>
                      <div className="text-[12px] text-[#64748B]">Average Response</div>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#64748B]">Fastest: <strong className="text-emerald-600">{analytics.emergencyResponse.fastestDistrict}</strong></span>
                      <span className="text-[#64748B]">Slowest: <strong className="text-red-600">{analytics.emergencyResponse.slowestDistrict}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B]">
              Unable to load analytics data.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
