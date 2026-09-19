import React, { useState } from 'react';
import axios from 'axios';
import {
  Lightbulb, AlertTriangle, Siren, Users, Flag, Activity, Moon, Info, CheckCircle2, Loader2, MapPin
} from 'lucide-react';
import Modal from './common/Modal.jsx';

const REPORT_REASONS = [
  { icon: Lightbulb, label: 'Poor street lighting' },
  { icon: AlertTriangle, label: 'Suspicious activity' },
  { icon: Siren, label: 'Road blocked' },
  { icon: Users, label: 'Heavy crowd' },
  { icon: Flag, label: 'Broken CCTV' },
  { icon: Activity, label: 'Accident reported' },
  { icon: Moon, label: 'Unsafe at night' },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetLocation,
  onReportSubmitted,
}) {
  const [choice, setChoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const lat = targetLocation ? targetLocation.lat : 11.0168;
  const lng = targetLocation ? targetLocation.lng : 76.9558;
  const name = targetLocation ? targetLocation.name : 'Selected Map Coordinate';

  async function handleSubmit() {
    if (!choice) return;
    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/reports', {
        lat,
        lng,
        reason: choice,
        locationId: targetLocation?.id,
      });
      if (response.data && response.data.status === 'success') {
        setSent(true);
        setTimeout(() => {
          if (onReportSubmitted) {
            onReportSubmitted(response.data.report, response.data.allReports);
          }
          setSent(false);
          setChoice(null);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report a Safety Issue"
      subtitle={`Location: ${name} (${lat.toFixed(3)}, ${lng.toFixed(3)})`}
      maxWidth="max-w-md"
    >
      {!sent ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {REPORT_REASONS.map((r) => {
              const isChosen = choice === r.label;
              const Icon = r.icon;
              return (
                <button
                  type="button"
                  key={r.label}
                  onClick={() => setChoice(r.label)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all"
                  style={{
                    borderColor: isChosen ? 'var(--primary)' : 'var(--border)',
                    background: isChosen ? 'rgba(37,99,235,0.12)' : 'var(--bg-3)',
                    color: 'var(--text)',
                  }}
                >
                  <Icon
                    size={17}
                    style={{ color: isChosen ? 'var(--primary)' : 'var(--text-3)' }}
                  />
                  <span className="text-xs font-semibold">{r.label}</span>
                </button>
              );
            })}
          </div>

          <div
            className="p-3 rounded-xl text-xs flex items-start gap-2.5 border"
            style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', color: '#B45309' }}
          >
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#D97706' }} />
            <span>
              <strong>Admin Verification:</strong> Community reports are verified by an administrator before appearing publicly on the safety heatmap feed.
            </span>
          </div>

          <button
            type="button"
            disabled={!choice || submitting}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(37,99,235,.35)' }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Submitting report to DB...</span>
              </>
            ) : (
              <span>Submit Verified Report</span>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
            <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>
            Report Saved to DB
          </span>
          <p className="text-xs max-w-xs" style={{ color: 'var(--text-2)' }}>
            Your report has been logged and published to the live geospatial telemetry feed.
          </p>
        </div>
      )}
    </Modal>
  );
}
