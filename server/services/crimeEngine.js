// Worldwide Crime & Safety Intelligence Engine
// Dynamically generates realistic, deterministic safety scores and crime distributions
// for ANY location on Earth based on coordinates, category, and geocoded place metadata.

import crypto from 'crypto';

export function generateSafetyDataForLocation(name, lat, lng, category = 'Mixed Use', city = 'Global Location') {
  // Use MD5 hash of (lat, lng, name) to make scores deterministic for any given location on Earth
  const seedStr = `${lat.toFixed(3)}_${lng.toFixed(3)}_${name.toLowerCase()}`;
  const hash = crypto.createHash('md5').update(seedStr).digest('hex');

  // Helper to extract a pseudo-random integer between min and max from hex slice
  function getRange(startIdx, min, max) {
    const val = parseInt(hash.slice(startIdx, startIdx + 4), 16);
    return min + (val % (max - min + 1));
  }

  // Base score range based on location keywords / category
  let minScore = 65;
  let maxScore = 92;

  const lowerName = name.toLowerCase();
  if (lowerName.includes('station') || lowerName.includes('bus') || lowerName.includes('airport') || lowerName.includes('terminal') || lowerName.includes('hub')) {
    minScore = 55;
    maxScore = 82;
  } else if (lowerName.includes('park') || lowerName.includes('residential') || lowerName.includes('school') || lowerName.includes('college') || lowerName.includes('university') || lowerName.includes('hospital')) {
    minScore = 78;
    maxScore = 96;
  } else if (lowerName.includes('downtown') || lowerName.includes('market') || lowerName.includes('mall') || lowerName.includes('plaza') || lowerName.includes('square')) {
    minScore = 68;
    maxScore = 88;
  }

  const score = getRange(0, minScore, maxScore);

  // Calculate 7 sub-category scores with realistic variation around overall score
  const women = Math.min(100, Math.max(35, score + getRange(4, -8, 10)));
  const night = Math.min(100, Math.max(30, score - getRange(8, 8, 24))); // night is typically lower
  const child = Math.min(100, Math.max(50, score + getRange(12, -4, 12)));
  const tourist = Math.min(100, Math.max(45, score + getRange(16, -6, 14)));
  const senior = Math.min(100, Math.max(40, score + getRange(20, -10, 8)));
  const emergency = Math.min(100, Math.max(50, score + getRange(24, -12, 15)));
  const traffic = Math.min(100, Math.max(35, score - getRange(28, 5, 20)));

  // Crime percentages summing to 100%
  const wVehicle = getRange(2, 15, 35);
  const wRobbery = getRange(6, 10, 25);
  const wHarassment = getRange(10, 8, 20);
  const wAssault = getRange(14, 4, 12);
  const wCyber = getRange(18, 3, 10);
  const totalWeight = wVehicle + wRobbery + wHarassment + wAssault + wCyber;
  
  const pctVehicle = Math.round((wVehicle / totalWeight) * 78);
  const pctRobbery = Math.round((wRobbery / totalWeight) * 78);
  const pctHarassment = Math.round((wHarassment / totalWeight) * 78);
  const pctAssault = Math.round((wAssault / totalWeight) * 78);
  const pctCyber = Math.round((wCyber / totalWeight) * 78);
  const pctOthers = Math.max(5, 100 - (pctVehicle + pctRobbery + pctHarassment + pctAssault + pctCyber));

  const crime = [
    { label: 'Vehicle Theft', pct: pctVehicle },
    { label: 'Robbery', pct: pctRobbery },
    { label: 'Harassment', pct: pctHarassment },
    { label: 'Assault', pct: pctAssault },
    { label: 'Cyber Crime', pct: pctCyber },
    { label: 'Others', pct: pctOthers }
  ];

  // AI Safety Summary generation
  let riskLevel = 'generally safe';
  if (score < 60) riskLevel = 'a moderate risk area requiring heightened vigilance';
  else if (score < 75) riskLevel = 'safe during business hours with standard urban precautions';

  let timeAdvisory = '6 AM – 10 PM';
  if (score >= 85) timeAdvisory = 'All day & evening';
  else if (score < 60) timeAdvisory = '7 AM – 8 PM';

  const summary = `SafeMap AI Analysis for ${name} (${city}): This area is evaluated at an Overall Safety Score of ${score}/100, making it ${riskLevel}. Women Safety is rated ${women}/100 while Night Safety drops to ${night}/100 after 10 PM due to lighting and pedestrian density changes. Pickpocketing and vehicle security (${pctVehicle}% of reported incidents) are the primary areas for caution.`;

  const trendsList = [
    'Decreasing (-9% this month)',
    'Stable (+1% this month)',
    'Consistently Safe (-4% this month)',
    'Decreasing (-14% this month)',
    'Stable (-2% this month)'
  ];
  const trend = trendsList[getRange(26, 0, trendsList.length - 1)];

  return {
    id: `world_${lat.toFixed(4)}_${lng.toFixed(4)}`,
    name,
    category,
    city,
    lat,
    lng,
    score,
    sub: {
      women,
      night,
      child,
      tourist,
      senior,
      emergency,
      traffic
    },
    summary,
    crime,
    time: timeAdvisory,
    reportsCount: getRange(30, 1, 8),
    trend,
    reports: [
      { reason: 'Poor street lighting', time: '4 hours ago', verified: true },
      { reason: 'Heavy crowd', time: 'Yesterday', verified: true }
    ]
  };
}
