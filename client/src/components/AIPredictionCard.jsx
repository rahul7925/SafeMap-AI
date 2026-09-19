import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Sun, Moon, Calendar, CloudRain, Users, Shield, Clock
} from 'lucide-react';

const TIMEFRAME_CONFIG = {
  today: { label: 'Today', icon: Sun, color: '#2563EB' },
  tomorrow: { label: 'Tomorrow', icon: Calendar, color: '#7C3AED' },
  weekend: { label: 'Weekend', icon: Users, color: '#0891B2' },
  festival: { label: 'Festival', icon: Users, color: '#DB2777' },
  rainy: { label: 'Rainy Day', icon: CloudRain, color: '#6366F1' },
  night: { label: 'Night', icon: Moon, color: '#1E293B' },
};

function RiskBadge({ level }) {
  const styles = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold border ${styles[level] || styles.Moderate}`}>
      {level}
    </span>
  );
}

function ChangeIndicator({ change, direction }) {
  const isUp = direction === 'increase';
  return (
    <div className={`flex items-center gap-1 text-[13px] font-semibold ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{change}</span>
    </div>
  );
}

export default function AIPredictionCard({ predictions = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} strokeWidth={1.75} className="text-purple-600" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
            AI Crime Prediction
          </span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[88px] rounded-[12px] bg-[#F1F5F9] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} strokeWidth={1.75} className="text-purple-600" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
            AI Crime Prediction
          </span>
        </div>
        <span className="text-[11px] font-medium text-[#94A3B8] flex items-center gap-1">
          <Shield size={12} /> RF-v2.1
        </span>
      </div>

      {predictions.map((pred, idx) => {
        const config = TIMEFRAME_CONFIG[pred.timeframe] || TIMEFRAME_CONFIG.today;
        const Icon = config.icon;

        return (
          <motion.div
            key={pred.timeframe}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.25 }}
            className="p-4 rounded-[12px] border border-[#E5E7EB] bg-white hover:border-[#CBD5E1] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.color + '12', color: config.color }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#0F172A]">{config.label}</div>
                  <div className="text-[12px] text-[#64748B]">
                    Score: {pred.predictedScore}/100
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={pred.riskLevel} />
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-[#64748B]">Confidence</span>
                <span className="text-[12px] font-bold text-[#0F172A]">{pred.confidence}%</span>
              </div>
              <div className="h-[4px] w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidence}%` }}
                  transition={{ delay: idx * 0.08 + 0.2, duration: 0.5 }}
                  className="h-[4px] rounded-full"
                  style={{ backgroundColor: config.color }}
                />
              </div>
            </div>

            {/* Expected Changes */}
            {pred.expectedChanges && pred.expectedChanges.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {pred.expectedChanges.slice(0, 3).map((ch, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[#64748B]">{ch.type}</span>
                    <ChangeIndicator change={ch.change} direction={ch.direction} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
