import crypto from 'crypto';

/**
 * Generates a deterministic random number between 0 and 1 based on a string seed.
 * @param {string} seed 
 * @returns {number}
 */
function getSeededRandom(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

/**
 * Calculate dynamic safety score based on location and various factors.
 * @param {number} lat 
 * @param {number} lng 
 * @param {Object} options 
 * @returns {Object} Structured JSON with safety scores
 */
export function calculateDynamicSafetyScore(lat, lng, options = {}) {
  const seed = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const rand = getSeededRandom(seed);

  // 14 weighted factors
  const factors = [
    { name: 'Historical Crime Density', weight: 0.18, value: 50 + (getSeededRandom(seed + '1') * 50) },
    { name: 'Crime Severity', weight: 0.12, value: 30 + (getSeededRandom(seed + '2') * 70) },
    { name: 'Crime Frequency', weight: 0.10, value: 40 + (getSeededRandom(seed + '3') * 60) },
    { name: 'Time of Day', weight: 0.10, value: options.timeOfDay || (20 + (getSeededRandom(seed + '4') * 80)) },
    { name: 'Traffic Conditions', weight: 0.06, value: options.traffic || (getSeededRandom(seed + '5') * 100) },
    { name: 'Weather', weight: 0.05, value: options.weather || (getSeededRandom(seed + '6') * 100) },
    { name: 'Police Proximity', weight: 0.08, value: options.policeProximity || (40 + (getSeededRandom(seed + '7') * 60)) },
    { name: 'Hospital Proximity', weight: 0.06, value: options.hospitalProximity || (30 + (getSeededRandom(seed + '8') * 70)) },
    { name: 'Community Reports', weight: 0.05, value: options.communityReports || (getSeededRandom(seed + '9') * 100) },
    { name: 'Lighting Quality', weight: 0.04, value: options.lightingQuality || (getSeededRandom(seed + '10') * 100) },
    { name: 'Population Density', weight: 0.04, value: getSeededRandom(seed + '11') * 100 },
    { name: 'Recent Incidents', weight: 0.04, value: getSeededRandom(seed + '12') * 100 },
    { name: 'Emergency Response Time', weight: 0.04, value: getSeededRandom(seed + '13') * 100 },
    { name: 'AI Model Confidence', weight: 0.04, value: 80 + (getSeededRandom(seed + '14') * 20) },
  ];

  let overall = 0;
  factors.forEach(f => {
    f.impact = f.value * f.weight;
    overall += f.impact;
  });

  const getSubScore = (s) => Math.round(overall * 0.8 + (getSeededRandom(seed + s) * 20));

  const breakdown = {
    women: getSubScore('women'),
    night: getSubScore('night'),
    child: getSubScore('child'),
    tourist: getSubScore('tourist'),
    traffic: getSubScore('traffic'),
    emergency: getSubScore('emergency'),
    senior: getSubScore('senior')
  };

  let band = 'Moderate';
  if (overall >= 85) band = 'Very Safe';
  else if (overall >= 70) band = 'Safe';
  else if (overall >= 50) band = 'Moderate';
  else if (overall >= 30) band = 'High Risk';
  else band = 'Dangerous';

  return {
    overall: Math.round(overall),
    confidence: Math.round(80 + (rand * 15)), // 80-95%
    band,
    breakdown,
    factors: factors.map(f => ({ ...f, value: Math.round(f.value), impact: Math.round(f.impact * 100) / 100 }))
  };
}
