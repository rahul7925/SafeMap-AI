import crypto from 'crypto';

/**
 * Helper to generate a deterministic hash based on coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string} Hex hash string
 */
function getLocationHash(lat, lng) {
    const seed = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
    return crypto.createHash('sha256').update(seed).digest('hex');
}

/**
 * Extract a numeric value from a hash string
 * @param {string} hash 
 * @param {number} start 
 * @param {number} len 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getValueFromHash(hash, start, len, min, max) {
    const sub = hash.substring(start, start + len);
    const num = parseInt(sub, 16);
    const maxHex = Math.pow(16, len) - 1;
    const ratio = num / maxHex;
    return min + Math.floor(ratio * (max - min + 1));
}

/**
 * Generates active safety alerts for a given location and radius
 * @param {number} lat 
 * @param {number} lng 
 * @param {number} radiusKm 
 * @returns {object} Object containing active alerts
 */
export function getActiveAlerts(lat, lng, radiusKm = 5) {
    const hash = getLocationHash(lat, lng);
    
    // Determine number of alerts based on hash (3 to 6)
    const alertCount = getValueFromHash(hash, 0, 1, 3, 6);
    const alertTypes = ['crime_report', 'road_block', 'weather_warning', 'police_advisory', 'crowd_alert', 'traffic_accident'];
    const severities = ['low', 'medium', 'high', 'critical'];

    const titles = {
        'crime_report': 'Recent Incident Reported',
        'road_block': 'Road Closed for Construction',
        'weather_warning': 'Heavy Rain Warning',
        'police_advisory': 'Increased Police Patrols',
        'crowd_alert': 'Unusual Crowd Gathering',
        'traffic_accident': 'Major Traffic Collision'
    };

    const descriptions = {
        'crime_report': 'A petty theft was reported nearby. Please remain cautious.',
        'road_block': 'Main street is temporarily closed. Expect detours.',
        'weather_warning': 'Heavy rains expected in the next 2 hours. Drive safe.',
        'police_advisory': 'Routine checks being conducted in the area.',
        'crowd_alert': 'Large gathering detected near the central square.',
        'traffic_accident': 'Accident reported at the intersection causing major delays.'
    };

    const alerts = [];
    let criticalCount = 0;

    const now = new Date();

    for (let i = 0; i < alertCount; i++) {
        const offset = (i + 1) * 4;
        const typeIdx = getValueFromHash(hash, offset, 1, 0, alertTypes.length - 1);
        const sevIdx = getValueFromHash(hash, offset + 1, 1, 0, severities.length - 1);
        
        // Time based logic simulation
        const hour = now.getHours();
        let adjustedTypeIdx = typeIdx;
        let adjustedSevIdx = sevIdx;

        if (hour < 6 || hour > 21) {
            // More critical crime alerts at night
            if (alertTypes[typeIdx] === 'crime_report') adjustedSevIdx = Math.max(sevIdx, 2); 
        } else if (hour > 16 && hour < 20) {
            // Weather / traffic during evening commute
            if (alertTypes[typeIdx] === 'weather_warning') adjustedSevIdx = Math.max(sevIdx, 1);
        }

        const type = alertTypes[adjustedTypeIdx];
        const severity = severities[adjustedSevIdx];

        if (severity === 'critical') criticalCount++;

        // Randomize coordinates within radius roughly
        const latOffset = (getValueFromHash(hash, offset + 2, 2, 0, 100) - 50) / 1000 * radiusKm;
        const lngOffset = (getValueFromHash(hash, offset + 4, 2, 0, 100) - 50) / 1000 * radiusKm;

        const distance = +(Math.abs(latOffset) + Math.abs(lngOffset)).toFixed(2);
        
        // Expires in 1 to 4 hours
        const expireHours = getValueFromHash(hash, offset + 6, 1, 1, 4);
        const expiresAt = new Date(now.getTime() + expireHours * 60 * 60 * 1000).toISOString();
        const timestamp = new Date(now.getTime() - (getValueFromHash(hash, offset + 7, 1, 10, 120) * 60000)).toISOString();

        alerts.push({
            id: `alt_${hash.substring(0, 4)}_${i}`,
            type,
            severity,
            title: titles[type],
            description: descriptions[type],
            lat: lat + latOffset,
            lng: lng + lngOffset,
            distance: distance === 0 ? 0.1 : distance,
            timestamp,
            expiresAt
        });
    }

    return {
        alerts,
        activeCount: alerts.length,
        criticalCount
    };
}
