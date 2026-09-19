import crypto from 'crypto';

/**
 * Get deterministic value from string
 */
function getDeterministicHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getValue(hash, start, len, min, max) {
    const sub = hash.substring(start, start + len);
    const num = parseInt(sub, 16);
    const maxHex = Math.pow(16, len) - 1;
    const ratio = num / maxHex;
    return min + Math.floor(ratio * (max - min + 1));
}

/**
 * Generates analytics data
 * @param {string} city 
 * @param {string} timeRange 
 * @returns {object} Analytics data
 */
export function getCrimeAnalytics(city = 'Coimbatore', timeRange = '30d') {
    const hash = getDeterministicHash(`${city}_${timeRange}`);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = months.map((month, index) => {
        const count = getValue(hash, index % 16, 2, 50, 300);
        const severity = getValue(hash, (index + 2) % 16, 1, 1, 10) > 7 ? 'High' : 'Medium';
        return { month, count, severity };
    });

    const crimeTypes = ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Cybercrime', 'Fraud'];
    let totalCrime = 0;
    const distribution = crimeTypes.map((type, i) => {
        const count = getValue(hash, 20 + i, 2, 10, 200);
        totalCrime += count;
        return { type, count, percentage: 0 };
    });
    
    distribution.forEach(d => {
        d.percentage = +((d.count / totalCrime) * 100).toFixed(1);
    });

    const districts = ['RS Puram', 'Peelamedu', 'Gandhipuram', 'Saibaba Colony', 'Singanallur', 'Townhall', 'Ramanathapuram', 'Vadavalli'];
    const districtRanking = districts.map((district, i) => {
        const score = getValue(hash, 30 + i, 2, 40, 95);
        const trendVal = getValue(hash, 40 + i, 1, 0, 2);
        const trends = ['declining', 'stable', 'improving'];
        return { district, score, trend: trends[trendVal] };
    });

    districtRanking.sort((a, b) => b.score - a.score);

    const safeAreas = districtRanking.slice(0, 5).map(d => ({ name: d.district, score: d.score }));
    const dangerousAreas = [...districtRanking].sort((a, b) => a.score - b.score).slice(0, 5).map(d => ({ name: d.district, score: d.score }));

    return {
        monthlyTrend,
        crimeTypeDistribution: distribution,
        districtRanking,
        predictionAccuracy: {
            overall: getValue(hash, 50, 2, 85, 95),
            lastMonth: getValue(hash, 52, 2, 88, 98),
            trend: 'improving'
        },
        topSafeAreas: safeAreas,
        topDangerousAreas: dangerousAreas,
        communityReports: {
            total: getValue(hash, 54, 2, 500, 2000),
            verified: getValue(hash, 56, 2, 400, 1800),
            pending: getValue(hash, 58, 2, 50, 200),
            rejected: getValue(hash, 60, 1, 10, 50)
        },
        emergencyResponse: {
            averageTime: `${getValue(hash, 61, 1, 5, 12)} mins`,
            fastestDistrict: safeAreas[0].name,
            slowestDistrict: dangerousAreas[0].name
        }
    };
}
