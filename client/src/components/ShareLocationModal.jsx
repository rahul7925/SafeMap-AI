import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
  Send,
  MessageSquare,
  Mail,
  MapPin,
} from 'lucide-react';
import Modal from './common/Modal.jsx';

export default function ShareLocationModal({
  isOpen,
  onClose,
  location,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !location) return null;

  const lat = location.lat || 11.0018;
  const lng = location.lng || 76.9628;
  const trackingUrl = `https://safemap.ai/track?lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}&place=${encodeURIComponent(location.name || 'Zone')}&token=safe_${Date.now().toString().slice(-6)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `I am tracking safety at ${location.name}. Check real-time AI safety score and corridor monitoring here: ${trackingUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `SafeMap AI Real-Time Tracking: ${location.name}`;
    const body = `View real-time safety metrics, CCTV coverage, and live corridor updates for ${location.name} (${lat.toFixed(4)}, ${lng.toFixed(4)}):\n\n${trackingUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Live Safety Corridor"
      subtitle={`Location: ${location.name} (${location.city || 'Coimbatore'})`}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* QR Code & Status Box */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center p-3">
            <QrCode size={110} strokeWidth={1.5} className="text-[#0F172A]" />
          </div>
          <div className="mt-3 text-[13px] font-bold text-[#0F172A]">
            Scan for Instant Tracking
          </div>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Recipients view real-time safety scores, nearby police kiosks, and SOS alerts.
          </p>
        </div>

        {/* Copyable Tracking URL Block */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
            Live Tracking URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={trackingUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#334155] select-all outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-3 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100/80 text-green-800 text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare size={16} className="text-green-600" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleEmail}
            className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Mail size={16} className="text-[#64748B]" />
            <span>Email Link</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-600 shrink-0" />
          <span>Tracking links automatically expire after 24 hours for user privacy.</span>
        </div>
      </div>
    </Modal>
  );
}
