import React from 'react';
import {
  X,
  Printer,
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
} from 'lucide-react';
import Modal from './common/Modal.jsx';

export default function ExportSafetyReportModal({
  isOpen,
  onClose,
  location,
  aiIntelligence,
  dynamicSafetyScore,
}) {
  if (!isOpen || !location) return null;

  const lat = location.lat || 11.0018;
  const lng = location.lng || 76.9628;
  const score = dynamicSafetyScore || location.score || 85;

  const band =
    score >= 85
      ? { label: 'Very Safe', text: '#16A34A', bg: '#DCFCE7' }
      : score >= 70
      ? { label: 'Safe', text: '#2563EB', bg: '#EFF6FF' }
      : score >= 50
      ? { label: 'Moderate', text: '#D97706', bg: '#FEF3C7' }
      : { label: 'High Risk', text: '#DC2626', bg: '#FEE2E2' };

  const subScores = [
    { label: 'Women Safety', value: score - 2 },
    { label: 'Night Safety', value: score - 5 },
    { label: 'Child Safety', value: score + 3 },
    { label: 'Tourist Safety', value: score + 1 },
    { label: 'Traffic Safety', value: score - 4 },
    { label: 'Emergency Response', value: score + 4 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Geospatial AI Safety Briefing"
      subtitle="Printable 1-Page Executive Security Report"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-[#0F172A]">
        {/* Printable Executive Document Sheet */}
        <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
          {/* Header Block */}
          <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#2563EB] uppercase tracking-wider">
                <Shield size={16} />
                <span>SafeMap AI Geospatial Intelligence</span>
              </div>
              <h3 className="text-[22px] font-bold text-[#0F172A] mt-1">
                {location.name}
              </h3>
              <p className="text-[13px] text-[#64748B]">
                {location.city || 'Coimbatore'} · {location.category || 'Monitored Area'} · GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            </div>

            <div className="text-right">
              <span
                className="inline-block px-3 py-1 rounded-full text-[14px] font-bold"
                style={{ background: band.bg, color: band.text }}
              >
                Score {score}/100 · {band.label}
              </span>
              <div className="text-[11px] text-[#94A3B8] mt-1">
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* AI Executive Summary Block */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Executive Security Assessment
            </div>
            <p className="text-[13px] text-[#334155] leading-relaxed">
              {aiIntelligence?.summary ||
                `An assessment of ${location.name} indicates a base safety score of ${score}/100 (${band.label}). Street lighting is well maintained along primary avenues, and police patrols occur at regular intervals. Pedestrian footfall is consistent during daytime hours.`}
            </p>
          </div>

          {/* Demographic Sub-Scores Grid */}
          <div>
            <div className="text-[13px] font-bold text-[#0F172A] mb-2.5">
              Demographic Safety Index
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {subScores.map((sub, idx) => {
                const sVal = Math.min(100, Math.max(20, sub.value));
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {sub.label}
                    </span>
                    <span className="text-[17px] font-bold text-[#0F172A] mt-1">
                      {sVal}
                      <span className="text-[11px] font-normal text-[#94A3B8]">/100</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency & Response Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#1E3A8A]">
                  Est. Police Response Time
                </div>
                <div className="text-[15px] font-bold text-[#1D4ED8]">
                  {aiIntelligence?.policeResponse || '~4 minutes'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
              <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-green-900">
                  Nearest Hospital / Trauma
                </div>
                <div className="text-[15px] font-bold text-green-700">
                  {aiIntelligence?.hospitalDistance || '~0.8 km'}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-2">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              Recommended Security Guidelines
            </div>
            {(
              aiIntelligence?.recommendations || [
                'Stay on well-lit main thoroughfares after 10:00 PM.',
                'Keep vehicle doors locked and valuables out of plain view.',
                'Utilize 24/7 monitored pedestrian corridors for late-night transit.',
              ]
            ).map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-[#334155]"
              >
                <CheckCircle2
                  size={15}
                  className="text-[#22C55E] shrink-0 mt-0.5"
                />
                <span>{rec}</span>
              </div>
            ))}
          </div>

          {/* Footer Emergency Contacts Row */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Emergency Police: <strong>100</strong></span>
            <span>Emergency Ambulance: <strong>108</strong></span>
            <span>National Emergency: <strong>112</strong></span>
            <span>Women Helpline: <strong>1091</strong></span>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Printer size={16} />
            <span>Print Executive Briefing (PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
