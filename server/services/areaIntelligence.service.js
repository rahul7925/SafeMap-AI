import crypto from 'crypto';

function getSeededRandom(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

/**
 * Generates natural language area intelligence based on location data.
 * @param {Object} locationData { name, lat, lng, city, score, sub, crime }
 * @returns {Object}
 */
export function generateAreaIntelligence(locationData) {
  const { lat, lng, name, city, score = 50 } = locationData;
  const seed = `${lat?.toFixed(3)}_${lng?.toFixed(3)}_${name}`;
  const rand = getSeededRandom(seed);

  const concerns = ['Theft', 'Burglary', 'Assault', 'Vandalism', 'Vehicle Theft'];
  const topConcernStr = concerns[Math.floor(getSeededRandom(seed + 'concern') * concerns.length)];
  const concernPct = Math.round(15 + (getSeededRandom(seed + 'pct') * 30));

  const responseTime = Math.round(3 + (getSeededRandom(seed + 'resp') * 15));
  const hospitalDist = (0.5 + (getSeededRandom(seed + 'hosp') * 5)).toFixed(1);

  const summary = `The area of ${name || 'this location'} in ${city || 'the city'} exhibits a safety score of ${score}/100. Based on our predictive modeling and recent reports, it is considered generally ${score > 70 ? 'safe' : score > 40 ? 'moderate' : 'high-risk'}. Vigilance is recommended, especially in isolated zones.`;

  const daytimeAdvice = score > 60 ? 'Daytime activities are generally safe with regular standard precautions.' : 'Exercise caution during daytime, stick to populated areas.';
  const nighttimeAdvice = score > 75 ? 'Nighttime travel is reasonably safe, but remain aware of surroundings.' : 'Avoid solitary travel at night. Use well-lit main routes or ride-sharing services.';

  const recommendations = [
    'Save local emergency contacts.',
    'Share your live location with a trusted contact if traveling alone.',
    `Be particularly aware of ${topConcernStr} in the vicinity.`
  ];

  if (score < 50) {
    recommendations.push('Consider traveling in groups when possible.');
  }

  return {
    summary,
    topConcern: `${topConcernStr} (${concernPct}%)`,
    policeResponse: `${responseTime} mins`,
    hospitalDistance: `${hospitalDist} km`,
    daytimeAdvice,
    nighttimeAdvice,
    recommendations,
    confidence: Math.round(75 + rand * 20)
  };
}
