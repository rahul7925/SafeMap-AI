import React from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, CloudRain, CloudSnow, Sun, CloudLightning, Wind, Eye,
  Thermometer, Droplets, Car, AlertTriangle, Construction,
  CircleAlert, Timer
} from 'lucide-react';

const WEATHER_ICONS = {
  Clear: Sun,
  'Partly Cloudy': Cloud,
  Cloudy: Cloud,
  'Light Rain': CloudRain,
  'Heavy Rain': CloudRain,
  Fog: Eye,
  Storm: CloudLightning,
};

const CONGESTION_COLORS = {
  'Free Flow': '#22C55E',
  Light: '#84CC16',
  Moderate: '#F59E0B',
  Heavy: '#F97316',
  Severe: '#EF4444',
};

export default function WeatherTrafficBar({
  weather = null,
  traffic = null,
  loading = false,
}) {
  if (loading) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 h-[48px] w-[560px] max-w-[90vw] rounded-full bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-pulse"
      />
    );
  }

  if (!weather && !traffic) return null;

  const WeatherIcon = weather ? (WEATHER_ICONS[weather.condition] || Cloud) : Cloud;
  const congestionColor = traffic ? (CONGESTION_COLORS[traffic.congestionLevel] || '#F59E0B') : '#22C55E';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0 h-[48px] rounded-full bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden font-[Inter,sans-serif] select-none"
    >
      {/* ── Weather Section ── */}
      {weather && (
        <div className="flex items-center gap-3 px-5 h-full border-r border-[#E5E7EB]">
          <WeatherIcon size={18} strokeWidth={1.75} className="text-[#2563EB] shrink-0" />
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold text-[#0F172A]">
              {weather.temperature}°C
            </span>
            <span className="text-[13px] font-medium text-[#64748B]">
              {weather.condition}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#94A3B8]">
            <span className="flex items-center gap-0.5">
              <Droplets size={12} /> {weather.humidity}%
            </span>
            <span className="flex items-center gap-0.5">
              <Wind size={12} /> {weather.windSpeed} km/h
            </span>
          </div>
        </div>
      )}

      {/* ── Traffic Section ── */}
      {traffic && (
        <div className="flex items-center gap-3 px-5 h-full">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: congestionColor }}
            />
            <span className="text-[13px] font-semibold text-[#0F172A]">
              {traffic.congestionLevel}
            </span>
          </div>

          {traffic.averageSpeed && (
            <span className="text-[12px] text-[#64748B] flex items-center gap-1">
              <Car size={13} /> {traffic.averageSpeed} km/h
            </span>
          )}

          {traffic.delayMinutes > 0 && (
            <span className="text-[12px] font-medium text-orange-600 flex items-center gap-1">
              <Timer size={12} /> +{traffic.delayMinutes} min
            </span>
          )}

          {traffic.incidents && traffic.incidents.length > 0 && (
            <span className="text-[12px] font-medium text-red-500 flex items-center gap-1">
              <AlertTriangle size={12} /> {traffic.incidents.length} incident{traffic.incidents.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
