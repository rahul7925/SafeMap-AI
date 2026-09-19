/* ══════════════════════════════════════════════════════════
   SafeMap AI — Centralized Theme, Utilities & Data Constants
   ══════════════════════════════════════════════════════════ */

export function scoreBand(score) {
  const s = Number(score) || 0;
  if (s >= 80) {
    return {
      color: '#22C55E',
      bg: '#DCFCE7',
      text: '#15803D',
      label: 'Safe',
      stars: 5,
      verdict: 'Very Safe',
      badgeBg: 'rgba(34, 197, 94, 0.12)',
    };
  }
  if (s >= 60) {
    return {
      color: '#EAB308',
      bg: '#FEF9C3',
      text: '#A16207',
      label: 'Moderate',
      stars: 4,
      verdict: 'Moderate Risk',
      badgeBg: 'rgba(234, 179, 8, 0.12)',
    };
  }
  if (s >= 40) {
    return {
      color: '#F97316',
      bg: '#FFEDD5',
      text: '#C2410C',
      label: 'High Risk',
      stars: 3,
      verdict: 'Caution Zone',
      badgeBg: 'rgba(249, 115, 22, 0.12)',
    };
  }
  return {
    color: '#EF4444',
    bg: '#FEE2E2',
    text: '#B91C1C',
    label: 'Dangerous',
    stars: 2,
    verdict: 'High Crime Area',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
  };
}

export const EMERGENCY_CONTACTS = [
  { label: 'Police SOS', num: '100', tel: 'tel:100', color: '#EF4444' },
  { label: 'Ambulance', num: '108', tel: 'tel:108', color: '#22C55E' },
  { label: 'Fire Service', num: '101', tel: 'tel:101', color: '#F97316' },
  { label: 'Women SOS', num: '1091', tel: 'tel:1091', color: '#A855F7' },
  { label: 'Emergency 112', num: '112', tel: 'tel:112', color: '#2563EB' },
];

export const RISK_TAGS = [
  { label: 'Women Friendly', color: '#EC4899' },
  { label: 'Tourist Area', color: '#3B82F6' },
  { label: 'Well Lit', color: '#F59E0B' },
  { label: 'Police Patrol', color: '#22C55E' },
  { label: 'CCTV Covered', color: '#8B5CF6' },
  { label: 'Family Safe', color: '#06B6D4' },
];

export const FACILITIES = [
  { emoji: '🚔', label: 'Police', dist: '0.4 km', time: '2 min' },
  { emoji: '🏥', label: 'Hospital', dist: '0.9 km', time: '5 min' },
  { emoji: '🚒', label: 'Fire Stn', dist: '1.2 km', time: '7 min' },
  { emoji: '💊', label: 'Pharmacy', dist: '0.3 km', time: '2 min' },
  { emoji: '🚌', label: 'Bus Stand', dist: '0.2 km', time: '1 min' },
  { emoji: '⛽', label: 'Petrol', dist: '0.6 km', time: '3 min' },
  { emoji: '🏧', label: 'ATM', dist: '0.3 km', time: '2 min' },
  { emoji: '🏨', label: 'Hotels', dist: '0.5 km', time: '3 min' },
];

export const CRIME_COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6', '#8B5CF6', '#94A3B8'];

/** Export Location Safety Report as HTML/Print */
export function printLocationReport(location) {
  if (!location) return;
  const b = scoreBand(location.score);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SafeMap AI Safety Intelligence Report - ${location.name}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #0F172A; }
          .header { border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: 800; margin: 0; }
          .subtitle { font-size: 14px; color: #64748B; margin-top: 4px; }
          .score-box { background: ${b.bg}; color: ${b.text}; padding: 16px 24px; border-radius: 12px; display: inline-block; margin: 16px 0; }
          .score-val { font-size: 36px; font-weight: 800; }
          .section { margin-top: 24px; }
          .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; text-align: left; font-size: 14px; }
          th { font-weight: 700; color: #475569; background: #F8FAFC; }
          .footer { margin-top: 40px; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">SafeMap AI — Geospatial Crime Intelligence Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()} · Official Data Summary</div>
        </div>

        <h2>${location.name}</h2>
        <div class="subtitle">${location.city || 'Global Location'} · Category: ${location.category || 'Mixed Use'}</div>

        <div class="score-box">
          <div class="score-val">${location.score} / 100</div>
          <div>Overall Safety Rating: <strong>${b.verdict} (${b.label})</strong></div>
        </div>

        <div class="section">
          <div class="section-title">AI Executive Summary</div>
          <p>${location.summary || location.aiSummary || 'SafeMap AI analysis indicates normal safety parameters.'}</p>
        </div>

        <div class="section">
          <div class="section-title">Category Breakdown</div>
          <table>
            <thead>
              <tr><th>Metric</th><th>Score / Percentage</th></tr>
            </thead>
            <tbody>
              <tr><td>Women Safety</td><td>${location.sub?.women || 85}%</td></tr>
              <tr><td>Night Safety</td><td>${location.sub?.night || 70}%</td></tr>
              <tr><td>Child Safety</td><td>${location.sub?.child || 82}%</td></tr>
              <tr><td>Traffic Safety</td><td>${location.sub?.traffic || 70}%</td></tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          SafeMap AI Platform · Automated Security Telemetry & Crowd-Sourced Risk Analysis
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}
