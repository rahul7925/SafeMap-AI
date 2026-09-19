import crypto from 'crypto';

function getSeededRandom(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

/**
 * Generate traffic intelligence based on location and time.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Object}
 */
export function getTrafficIntelligence(lat, lng) {
  const hour = new Date().getHours();
  const seed = `${lat.toFixed(3)}_${lng.toFixed(3)}_${hour}`;
  const rand = getSeededRandom(seed);

  const levels = ['Free Flow', 'Light', 'Moderate', 'Heavy', 'Severe'];
  
  // Rush hours weight towards heavy
  let levelIdx = Math.floor(rand * levels.length);
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    levelIdx = Math.min(levels.length - 1, levelIdx + 2);
  }
  const congestionLevel = levels[levelIdx];

  const baseSpeed = [60, 45, 30, 15, 5][levelIdx];
  const averageSpeed = Math.round(baseSpeed + (getSeededRandom(seed + 'speed') * 10 - 5));

  const incidentTypes = ['Road Closure', 'Construction', 'Accident'];
  const incidents = [];
  
  // 30% chance of an incident
  if (getSeededRandom(seed + 'inc') > 0.7) {
    const type = incidentTypes[Math.floor(getSeededRandom(seed + 'type') * incidentTypes.length)];
    const sevs = ['Low', 'Medium', 'High'];
    const severity = sevs[Math.floor(getSeededRandom(seed + 'sev') * sevs.length)];
    const eta = Math.round(15 + getSeededRandom(seed + 'eta') * 105);
    incidents.push({
      type,
      location: 'Nearby Main Intersection',
      severity,
      eta: `${eta} mins`
    });
  }

  const delayMinutes = Math.round(levelIdx * 5 + getSeededRandom(seed + 'delay') * 10);
  
  // High congestion or severe incidents negatively impact safety score slightly
  let safetyImpact = Math.round(getSeededRandom(seed + 'impact') * 15) - 10; // -10 to +5
  if (levelIdx >= 3) safetyImpact = Math.min(safetyImpact, -2);

  return {
    congestionLevel,
    averageSpeed: Math.max(0, averageSpeed),
    incidents,
    delayMinutes,
    safetyImpact,
    updatedAt: new Date().toISOString()
  };
}
