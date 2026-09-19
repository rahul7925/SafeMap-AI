import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Mail,
} from 'lucide-react';
import Modal from './common/Modal.jsx';

const RADII = [
  { label: '500m', value: 0.5, desc: 'Immediate block & parking perimeter' },
  { label: '1.0 km', value: 1.0, desc: 'Walking distance & metro corridor' },
  { label: '2.5 km', value: 2.5, desc: 'Neighborhood & commercial zone' },
  { label: '5.0 km', value: 5.0, desc: 'City districtwide alerting' },
];

export default function GeofenceAlertModal({
  isOpen,
  onClose,
  location,
  onAlertConfigured,
}) {
  const [radius, setRadius] = useState(1.0);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !location) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (onAlertConfigured) {
        onAlertConfigured({
          locationId: location.id,
          locationName: location.name,
          radius,
          notifyPush,
          notifySms,
        });
      }
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Geofence Safety Alert"
      subtitle={`Zone: ${location.name} (${location.city || 'Coimbatore'})`}
      maxWidth="max-w-md"
    >
      {!saved ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Geofence Radius Selection */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
              Alert Perimeter Radius
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {RADII.map((r) => {
                const isSelected = radius === r.value;
                return (
                  <button
                    type="button"
                    key={r.label}
                    onClick={() => setRadius(r.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-[#2563EB] shadow-sm'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold text-[#0F172A]">
                        {r.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={16} className="text-[#2563EB]" />
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B]">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Condition Notice */}
          <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3">
            <Radio size={18} className="text-[#2563EB] shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="text-[13px] font-bold text-[#1E3A8A]">
                AI Perimeter Geofence Active
              </div>
              <div className="text-[12px] text-[#1D4ED8] mt-0.5">
                You will be notified immediately if any critical incident, road block, or rapid safety score drop occurs within {radius} km.
              </div>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="space-y-2.5">
            <label className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
              Delivery Channels
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <Smartphone size={18} className="text-[#2563EB]" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    Instant Push Notification
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => setNotifyPush(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <Mail size={18} className="text-[#2563EB]" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    SMS & Email Advisory Alert
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB]"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Bell size={16} />
              <span>Enable Geofence ({radius} km)</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="text-[18px] font-bold text-[#0F172A]">
            Geofence Perimeter Active!
          </div>
          <p className="text-[13px] text-[#64748B] max-w-xs mx-auto">
            Real-time security monitoring enabled for a {radius} km radius around {location.name}.
          </p>
        </div>
      )}
    </Modal>
  );
}
