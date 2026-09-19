import crypto from 'crypto';

function getSeededRandom(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

/**
 * Generate weather intelligence based on latitude and current day.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Object}
 */
export function getWeatherIntelligence(lat, lng) {
  const day = new Date().toISOString().split('T')[0];
  const seed = `${lat.toFixed(3)}_${lng.toFixed(3)}_${day}`;
  const rand = getSeededRandom(seed);

  // Temp base derived from latitude (equator is hotter)
  const absLat = Math.abs(lat);
  const baseTemp = 35 - (absLat * 0.4); 
  const temperature = Math.round(baseTemp + (getSeededRandom(seed + 'temp') * 15 - 7.5));

  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Fog', 'Storm'];
  const conditionIdx = Math.floor(getSeededRandom(seed + 'cond') * conditions.length);
  const condition = conditions[conditionIdx];

  const humidity = Math.round(30 + getSeededRandom(seed + 'hum') * 60);
  const visibility = (getSeededRandom(seed + 'vis') > 0.8 || conditionIdx >= 5) 
    ? (1 + getSeededRandom(seed + 'vis2') * 4).toFixed(1) 
    : (8 + getSeededRandom(seed + 'vis2') * 12).toFixed(1);

  const windSpeed = Math.round(getSeededRandom(seed + 'wind') * 40);

  const aqiIndex = Math.floor(1 + getSeededRandom(seed + 'aqi') * 5);
  const aqiLabels = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy'];

  let safetyScoreImpact = 0;
  let reason = 'Weather conditions are optimal.';
  
  if (condition === 'Storm' || condition === 'Heavy Rain') {
    safetyScoreImpact = -15;
    reason = 'Severe weather conditions may disrupt services and visibility.';
  } else if (condition === 'Fog') {
    safetyScoreImpact = -5;
    reason = 'Reduced visibility affects road safety.';
  } else if (aqiIndex >= 4) {
    safetyScoreImpact = -5;
    reason = 'Poor air quality might pose health risks.';
  } else if (temperature > 40 || temperature < -5) {
    safetyScoreImpact = -10;
    reason = 'Extreme temperatures pose outdoor safety hazards.';
  }

  // Sunrise/Sunset estimation
  const sunriseHour = Math.floor(5 + getSeededRandom(seed + 'sun') * 2);
  const sunriseMinute = Math.floor(getSeededRandom(seed + 'sunm') * 60);
  const sunsetHour = Math.floor(17 + getSeededRandom(seed + 'set') * 2);
  const sunsetMinute = Math.floor(getSeededRandom(seed + 'setm') * 60);

  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    temperature,
    condition,
    humidity,
    visibility: parseFloat(visibility),
    windSpeed,
    airQuality: {
      index: aqiIndex,
      label: aqiLabels[aqiIndex - 1] || 'Good'
    },
    safetyImpact: {
      score: safetyScoreImpact,
      reason
    },
    sunrise: formatTime(sunriseHour, sunriseMinute),
    sunset: formatTime(sunsetHour, sunsetMinute),
    updatedAt: new Date().toISOString()
  };
}
