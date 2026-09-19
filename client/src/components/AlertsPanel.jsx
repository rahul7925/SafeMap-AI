import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bell, Shield, CloudRain, Car, AlertTriangle,
  Users, Radio, CheckCircle2, Clock
} from 'lucide-react';

const ALERT_ICONS = {
  crime_report: { icon: AlertTriangle, color: '#EF4444', bg: 'bg-red-50' },
  road_block: { icon: Car, color: '#F97316', bg: 'bg-orange-50' },
  weather_warning: { icon: CloudRain, color: '#6366F1', bg: 'bg-indigo-50' },
  police_advisory: { icon: Shield, color: '#2563EB', bg: 'bg-blue-50' },
  crowd_alert: { icon: Users, color: '#D946EF', bg: 'bg-fuchsia-50' },
  traffic_accident: { icon: Car, color: '#DC2626', bg: 'bg-red-50' },
};

const SEVERITY_STYLES = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export default function AlertsPanel({ alerts = [], isOpen, onClose, onDismiss }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-[80px] right-6 z-50 w-[380px] max-h-[480px] bg-white/95 backdrop-blur-md rounded-[16px] border border-[#E5E7EB] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden font-[Inter,sans-serif]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <Bell size={20} strokeWidth={1.75} className="text-[#2563EB]" />
            <span className="text-[14px] font-bold text-[#0F172A]">
              Live Safety Alerts
            </span>
            {alerts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[12px] font-bold border border-red-200">
                {alerts.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-[380px] no-scrollbar">
          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} strokeWidth={1.75} />
              </div>
              <div className="text-[14px] font-semibold text-[#0F172A] mb-1">All Clear</div>
              <div className="text-[13px] text-[#64748B]">No active safety alerts in your area.</div>
            </div>
          ) : (
            <div className="py-2">
              {alerts.map((alert, idx) => {
                const config = ALERT_ICONS[alert.type] || ALERT_ICONS.crime_report;
                const AlertIcon = config.icon;
                const sevStyle = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium;

                return (
                  <motion.div
                    key={alert.id || idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-none"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <AlertIcon size={18} strokeWidth={1.75} style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[14px] font-semibold text-[#0F172A] truncate">
                            {alert.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${sevStyle}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#64748B] leading-snug mb-1.5">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-3 text-[12px] text-[#94A3B8]">
                          {alert.distance && (
                            <span className="flex items-center gap-1">
                              <Radio size={11} /> {alert.distance}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {alert.timestamp || 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
