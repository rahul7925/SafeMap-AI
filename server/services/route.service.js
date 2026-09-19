import crypto from 'crypto';

/**
 * Helper to generate a deterministic hash based on coordinates
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {string} Hex hash string
 */
function getRouteHash(lat1, lng1, lat2, lng2) {
    const seed = `${lat1.toFixed(3)}_${lng1.toFixed(3)}_${lat2.toFixed(3)}_${lng2.toFixed(3)}`;
    return crypto.createHash('sha256').update(seed).digest('hex');
}

/**
 * Helper to convert hash segments to numeric values
 * @param {string} hash 
 * @param {number} start 
 * @param {number} len 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} Value mapped to range
 */
function getValueFromHash(hash, start, len, min, max) {
    const sub = hash.substring(start, start + len);
    const num = parseInt(sub, 16);
    const maxHex = Math.pow(16, len) - 1;
    const ratio = num / maxHex;
    return min + Math.floor(ratio * (max - min + 1));
}

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Calculates route options based on start and end coordinates
 * @param {number} fromLat 
 * @param {number} fromLng 
 * @param {number} toLat 
 * @param {number} toLng 
 * @returns {object} JSON object containing route options
 */
export function calculateRoutes(fromLat, fromLng, toLat, toLng) {
    const baseDistance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const hash = getRouteHash(fromLat, fromLng, toLat, toLng);
    
    const crowdDensities = ['Low', 'Medium', 'High'];
    const weatherImpacts = ['None', 'Minor', 'Moderate'];

    const routesInfo = [
        { key: 'safest', label: 'Safest Route', icon: 'shield', color: 'green', mult: 1.4, speed: 40, badge: 'Recommended', summary: 'Prioritizes main avenues with high street lighting, CCTV surveillance, and active police kiosks.' },
        { key: 'balanced', label: 'Balanced Route', icon: 'scale', color: 'blue', mult: 1.25, speed: 45, badge: 'Optimal ETA & Safety', summary: 'Optimal balance of travel speed and safety, bypassing unlit alleys after dark.' },
        { key: 'fastest', label: 'Fastest Route', icon: 'zap', color: 'orange', mult: 1.1, speed: 55, badge: 'Time Saver', summary: 'Direct shortcut via interior residential roads. Less commercial activity at night.' },
        { key: 'women_safe', label: 'Women Safe Route', icon: 'user-check', color: 'purple', mult: 1.5, speed: 35, badge: 'Women Preferred', summary: 'High crowd density corridors with 24/7 CCTV and active commercial establishments.' },
        { key: 'family_safe', label: 'Family Safe Route', icon: 'users', color: 'indigo', mult: 1.3, speed: 42, badge: 'Family Friendly', summary: 'Traverses school and hospital corridors with zero high-crime zones and emergency call boxes.' },
        { key: 'walking_safe', label: 'Walking Safe Route', icon: 'footprints', color: 'emerald', mult: 1.6, speed: 20, badge: 'Pedestrian Safe', summary: 'Well-paved pedestrian walkways with street lighting and high pedestrian footfall.' },
        { key: 'bike_safe', label: 'Bike Safe Route', icon: 'bike', color: 'cyan', mult: 1.2, speed: 48, badge: '2-Wheeler Preferred', summary: 'Avoids heavy multi-axle truck routes and congested junctions; good asphalt quality.' },
        { key: 'driving_route', label: 'Driving Route', icon: 'car', color: 'blue', mult: 1.15, speed: 50, badge: 'Main Arterials', summary: 'Wide multi-lane arterials with secure parking corridors and petrol pumps.' },
        { key: 'night_safe', label: 'Night Safe Route', icon: 'moon', color: 'violet', mult: 1.45, speed: 38, badge: '24/7 Monitored', summary: 'Avoids isolated alleys after 10 PM; routes exclusively through illuminated commercial boulevards.' },
        { key: 'accessible_route', label: 'Accessible Route', icon: 'accessibility', color: 'teal', mult: 1.35, speed: 36, badge: 'Barrier Free', summary: 'Smooth pavements with handicap assistance ramps, zero road construction or closures.' }
    ];

    const routes = routesInfo.map((r, i) => {
        const offset = (i * 3) % 12;
        
        // Deterministic generation
        const distance = +(baseDistance * r.mult).toFixed(1);
        const eta = Math.ceil((distance / r.speed) * 60);
        
        let crimeRisk, lighting, cctv, policeCoverage;

        // Apply specific biases based on route type
        if (r.key === 'safest' || r.key === 'women_safe' || r.key === 'family_safe' || r.key === 'night_safe') {
            crimeRisk = getValueFromHash(hash, offset, 2, 5, 18);
            lighting = getValueFromHash(hash, offset+2, 2, 88, 99);
            cctv = getValueFromHash(hash, offset+4, 2, 82, 95);
            policeCoverage = getValueFromHash(hash, offset+6, 2, 75, 92);
        } else if (r.key === 'fastest') {
            crimeRisk = getValueFromHash(hash, offset, 2, 40, 70);
            lighting = getValueFromHash(hash, offset+2, 2, 50, 70);
            cctv = getValueFromHash(hash, offset+4, 2, 40, 60);
            policeCoverage = getValueFromHash(hash, offset+6, 2, 30, 50);
        } else if (r.key === 'well_lit' || r.key === 'walking_safe') {
            crimeRisk = getValueFromHash(hash, offset, 2, 15, 35);
            lighting = getValueFromHash(hash, offset+2, 2, 92, 99);
            cctv = getValueFromHash(hash, offset+4, 2, 65, 85);
            policeCoverage = getValueFromHash(hash, offset+6, 2, 60, 80);
        } else {
            crimeRisk = getValueFromHash(hash, offset, 2, 25, 45);
            lighting = getValueFromHash(hash, offset+2, 2, 70, 88);
            cctv = getValueFromHash(hash, offset+4, 2, 60, 80);
            policeCoverage = getValueFromHash(hash, offset+6, 2, 55, 75);
        }

        const crowdDensity = crowdDensities[getValueFromHash(hash, offset+8, 1, 0, 2)];
        const weatherImpact = weatherImpacts[getValueFromHash(hash, offset+9, 1, 0, 2)];
        
        const safetyScore = Math.floor(100 - crimeRisk + (lighting * 0.3) + (cctv * 0.3) + (policeCoverage * 0.4));
        const normalizedSafetyScore = Math.min(100, Math.max(20, safetyScore));

        return {
            key: r.key,
            label: r.label,
            icon: r.icon,
            color: r.color,
            distance,
            eta,
            crimeRisk,
            lighting,
            cctv,
            policeCoverage,
            crowdDensity,
            weatherImpact,
            safetyScore: normalizedSafetyScore,
            summary: r.summary,
            badge: r.badge
        };
    });

    // Sort by safety score descending
    routes.sort((a, b) => b.safetyScore - a.safetyScore);

    return { routes };
}
