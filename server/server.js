import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSafetyDataForLocation } from './services/crimeEngine.js';

/* ── Phase 2: AI Intelligence & Real-Time Safety Engine Imports ── */
import { calculateDynamicSafetyScore } from './services/safetyScore.service.js';
import { generateAreaIntelligence } from './services/areaIntelligence.service.js';
import { predictCrimeRisk } from './services/prediction.service.js';
import { getTrafficIntelligence } from './services/traffic.service.js';
import { getWeatherIntelligence } from './services/weather.service.js';
import { calculateRoutes } from './services/route.service.js';
import { getActiveAlerts } from './services/alerts.service.js';
import { getCrimeAnalytics } from './services/analytics.service.js';
import { getNotifications, createNotification, markAsRead } from './services/notification.service.js';
import { generateAIChatResponse } from './services/aiChat.service.js';
import { getSearchSuggestions, executeSearchGateway } from './services/search.service.js';
import { startJourney, endJourney, getJourneyStatus } from './services/journey.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple In-Memory Cache for Search, Autocomplete & Geocoding (5 min TTL)
const apiCache = new Map();

function getCached(key) {
  const item = apiCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    apiCache.delete(key);
    return null;
  }
  return item.value;
}

function setCache(key, value, ttlMs = 300000) {
  apiCache.set(key, { value, expiry: Date.now() + ttlMs });
}

function readDB() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeDBAsync(data) {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

/* ── In-Memory Auth / Users / Favorites Store for Phase 1 MVP ── */
const usersStore = [
  { id: 'usr_1', email: 'demo@safemap.ai', name: 'Verified Resident', role: 'user', favorites: ['Coimbatore Junction', 'RS Puram Commercial Area'] },
  { id: 'usr_admin', email: 'admin@safemap.ai', name: 'SafeMap Admin', role: 'admin', favorites: [] }
];
const searchHistoryStore = [
  { query: 'Coimbatore Junction', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { query: 'RS Puram', timestamp: new Date(Date.now() - 7200000).toISOString() }
];

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 1: AUTHENTICATION API
   ────────────────────────────────────────────────────────────────────────── */
app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }
  const existing = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ status: 'error', message: 'User already registered with this email' });
  }
  const newUser = {
    id: 'usr_' + Date.now(),
    email: sanitizeInput(email),
    name: sanitizeInput(name || 'SafeMap User'),
    role: 'user',
    favorites: []
  };
  usersStore.push(newUser);
  res.status(201).json({
    status: 'success',
    token: 'jwt_mock_token_' + newUser.id,
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = usersStore.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || usersStore[0];
  res.json({
    status: 'success',
    token: 'jwt_mock_token_' + user.id,
    user
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ status: 'success', message: 'User logged out successfully' });
});

app.get('/api/auth/profile', (req, res) => {
  const user = usersStore[0];
  res.json({ status: 'success', user });
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 2: ORCHESTRATED PRODUCTION SEARCH ENGINE (Google Maps Quality)
   ────────────────────────────────────────────────────────────────────────── */
// 1. Autocomplete Suggestions Engine (<300ms) with Multi-Provider Fallback
app.get('/api/search/suggestions', async (req, res) => {
  try {
    const q = sanitizeInput(req.query.q || '');
    const db = readDB();
    const suggestions = await getSearchSuggestions(q, db.locations);
    res.json({ status: 'success', query: q, count: suggestions.length, suggestions });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Single-Endpoint Search Gateway (<500ms) with Parallel AI & GIS Intelligence
app.get('/api/search/place', async (req, res) => {
  try {
    const db = readDB();
    const payload = await executeSearchGateway(req.query, db.locations);
    if (payload.status === 'error') {
      return res.status(404).json(payload);
    }
    res.json(payload);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/search/gateway', async (req, res) => {
  try {
    const db = readDB();
    const payload = await executeSearchGateway(req.query, db.locations);
    if (payload.status === 'error') {
      return res.status(404).json(payload);
    }
    res.json(payload);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. Existing general search route for backward compatibility
app.get('/api/locations/search', async (req, res) => {
  try {
    const q = sanitizeInput(req.query.q || '');
    if (!q) {
      const db = readDB();
      return res.json({ status: 'success', results: db.locations });
    }

    const db = readDB();
    const qLower = q.toLowerCase();

    const localMatches = db.locations.filter(l =>
      l.name.toLowerCase().includes(qLower) ||
      (l.city && l.city.toLowerCase().includes(qLower)) ||
      (l.category && l.category.toLowerCase().includes(qLower))
    );

    const cacheKey = `search_${qLower}`;
    let osmResults = getCached(cacheKey);

    if (!osmResults) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`;
        const response = await fetch(nominatimUrl, {
          headers: { 'User-Agent': 'SafeMap-AI-Crime-Platform/1.0 (contact@safemap.ai)' }
        });
        if (response.ok) {
          const data = await response.json();
          osmResults = data.map(item => {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            const namePart = item.display_name.split(',')[0] || item.display_name;
            const cityPart = item.address?.city || item.address?.town || item.address?.country || 'Global';
            return generateSafetyDataForLocation(namePart, lat, lng, item.type || 'Landmark', cityPart);
          });
          setCache(cacheKey, osmResults);
        } else {
          osmResults = [];
        }
      } catch (apiErr) {
        console.warn('Nominatim search API error:', apiErr.message);
        osmResults = [];
      }
    }

    const combined = [...localMatches];
    const existingNames = new Set(localMatches.map(m => m.name.toLowerCase()));
    for (const r of (osmResults || [])) {
      if (!existingNames.has(r.name.toLowerCase())) {
        combined.push(r);
        existingNames.add(r.name.toLowerCase());
      }
    }

    res.json({
      status: 'success',
      query: q,
      count: combined.length,
      results: combined
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/locations', (req, res) => {
  try {
    const db = readDB();
    res.json({
      status: 'success',
      count: db.locations.length,
      locations: db.locations,
      reports: db.reports
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/locations/geocode', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }

    const cacheKey = `geocode_${lat.toFixed(3)}_${lng.toFixed(3)}`;
    let safetyData = getCached(cacheKey);

    if (!safetyData) {
      let placeName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      let city = 'Global Coordinates';
      try {
        const revUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`;
        const response = await fetch(revUrl, {
          headers: { 'User-Agent': 'SafeMap-AI-Crime-Platform/1.0 (contact@safemap.ai)' }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.display_name) {
            placeName = data.display_name.split(',')[0] || placeName;
            city = data.address?.city || data.address?.town || data.address?.country || city;
          }
        }
      } catch (revErr) {
        console.warn('Reverse geocode warning:', revErr.message);
      }

      safetyData = generateSafetyDataForLocation(placeName, lat, lng, 'Map Point', city);
      setCache(cacheKey, safetyData);
    }

    res.json({ status: 'success', location: safetyData });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 4: NEARBY SERVICES API
   ────────────────────────────────────────────────────────────────────────── */
app.get('/api/nearby/police', (req, res) => {
  res.json({
    status: 'success',
    services: [
      { id: 'pol_1', name: 'B-1 Bazaar Police Station', lat: 11.0022, lng: 76.9631, phone: '100 / 0422-2300100', response: '3 min', dist: '0.3 km' },
      { id: 'pol_2', name: 'RS Puram Police Station (B-2)', lat: 11.0108, lng: 76.9482, phone: '100 / 0422-2542400', response: '2 min', dist: '0.5 km' }
    ]
  });
});

app.get('/api/nearby/hospitals', (req, res) => {
  res.json({
    status: 'success',
    services: [
      { id: 'hosp_1', name: 'Coimbatore Medical College Hospital', lat: 11.0045, lng: 76.9678, beds: '24/7 Trauma', phone: '108 / 0422-2301393', dist: '0.6 km' },
      { id: 'hosp_2', name: 'Ganga Medical Centre & Hospital', lat: 11.0212, lng: 76.9548, beds: 'Emergency ICU', phone: '0422-2485000', dist: '1.2 km' }
    ]
  });
});

app.get('/api/nearby/fire', (req, res) => {
  res.json({
    status: 'success',
    services: [
      { id: 'fire_1', name: 'Gandhipuram Fire & Rescue Station', lat: 11.0185, lng: 76.9669, phone: '101', response: '4 min', dist: '0.8 km' }
    ]
  });
});

app.get('/api/nearby/pharmacy', (req, res) => {
  res.json({
    status: 'success',
    services: [
      { id: 'phar_1', name: 'Apollo Pharmacy 24/7', lat: 11.0095, lng: 76.9582, phone: '1800-266-0000', dist: '0.2 km' }
    ]
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 5: HISTORICAL CRIME DATASET API
   ────────────────────────────────────────────────────────────────────────── */
app.get('/api/crimes', (req, res) => {
  const crimes = [
    { id: 'crm_1', type: 'Vehicle Theft', category: 'Property', severity: 'High', date: '2026-07-27', time: '22:15', area: 'Coimbatore Junction', city: 'Coimbatore', lat: 11.0012, lng: 76.9642, weight: 0.8 },
    { id: 'crm_2', type: 'Robbery', category: 'Violent', severity: 'Critical', date: '2026-07-26', time: '23:45', area: 'Ukadam Bus Terminus', city: 'Coimbatore', lat: 11.0168, lng: 76.9688, weight: 0.95 },
    { id: 'crm_3', type: 'Assault', category: 'Violent', severity: 'High', date: '2026-07-25', time: '21:30', area: 'Gandhipuram', city: 'Coimbatore', lat: 10.9935, lng: 76.9589, weight: 0.85 }
  ];
  res.json({ status: 'success', count: crimes.length, crimes });
});

app.get('/api/crimes/:id', (req, res) => {
  const crime = {
    id: req.params.id,
    type: 'Vehicle Theft',
    category: 'Property',
    severity: 'High',
    date: '2026-07-27',
    time: '22:15',
    area: 'Coimbatore Junction',
    city: 'Coimbatore',
    lat: 11.0012,
    lng: 76.9642,
    description: 'Two-wheeler theft reported near north parking gate.',
    confidence: 0.92
  };
  res.json({ status: 'success', crime });
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 6: HEATMAP ENGINE API
   ────────────────────────────────────────────────────────────────────────── */
app.get('/api/heatmap', (req, res) => {
  const densityPoints = [
    { lat: 11.0018, lng: 76.9628, weight: 0.85 },
    { lat: 11.0183, lng: 76.9664, weight: 0.92 },
    { lat: 10.9925, lng: 76.9614, weight: 0.88 }
  ];
  res.json({ status: 'success', points: densityPoints });
});

app.get('/api/heatmap/density', (req, res) => {
  res.json({
    status: 'success',
    layer: 'True Density Heatmap',
    gradient: { 0.1: '#00E676', 0.3: '#66BB6A', 0.5: '#FFEB3B', 0.7: '#FF9800', 0.85: '#F44336', 1.0: '#8B0000' }
  });
});

app.get('/api/heatmap/influence', (req, res) => {
  res.json({
    status: 'success',
    zones: [
      { id: 'inf_1', name: 'Robbery Influence Zone', lat: 11.0168, lng: 76.9688, radius: 400, opacity: 0.18, color: '#F97316' },
      { id: 'inf_2', name: 'Vehicle Theft Influence Zone', lat: 11.0012, lng: 76.9642, radius: 700, opacity: 0.14, color: '#2563EB' }
    ]
  });
});

app.get('/api/heatmap/safezones', (req, res) => {
  res.json({
    status: 'success',
    zones: [
      { id: 'safe_1', name: 'VOC Park & Zoo Corridor', lat: 11.0085, lng: 76.9691, radius: 650, note: 'Patrolled Green Corridor' },
      { id: 'safe_2', name: 'Race Course Walking Path', lat: 11.0041, lng: 76.9748, radius: 800, note: '24/7 CCTV & Women Safe' }
    ]
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 7: COMMUNITY REPORTS API
   ────────────────────────────────────────────────────────────────────────── */
app.get('/api/reports', (req, res) => {
  try {
    const db = readDB();
    res.json({ status: 'success', count: (db.reports || []).length, reports: db.reports || [] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    const reason = sanitizeInput(req.body.reason || '');
    const locationId = sanitizeInput(req.body.locationId || '');

    if (isNaN(lat) || isNaN(lng) || !reason) {
      return res.status(400).json({ status: 'error', message: 'Valid lat, lng, and reason are required' });
    }

    const db = readDB();
    const newReport = {
      id: 'rep_' + Date.now(),
      lat,
      lng,
      reason,
      time: 'Just now',
      verified: true,
      locationId: locationId || 'custom_point'
    };

    db.reports.unshift(newReport);

    if (locationId) {
      const target = db.locations.find(l => l.id === locationId);
      if (target) {
        if (!target.reports) target.reports = [];
        target.reports.unshift({ reason, time: 'Just now', verified: true });
        target.reportsCount = (target.reportsCount || target.reports.length) + 1;
      }
    }

    await writeDBAsync(db);
    res.status(201).json({ status: 'success', report: newReport, allReports: db.reports });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 8 & 9: USER FAVORITES & SEARCH HISTORY API
   ────────────────────────────────────────────────────────────────────────── */
app.get('/api/user/favorites', (req, res) => {
  res.json({ status: 'success', favorites: usersStore[0].favorites });
});

app.post('/api/user/favorites', (req, res) => {
  const placeName = sanitizeInput(req.body.place || '');
  if (placeName && !usersStore[0].favorites.includes(placeName)) {
    usersStore[0].favorites.push(placeName);
  }
  res.json({ status: 'success', favorites: usersStore[0].favorites });
});

app.get('/api/user/history', (req, res) => {
  res.json({ status: 'success', history: searchHistoryStore });
});

/* ──────────────────────────────────────────────────────────────────────────
   MODULE 10: AI SAFETY CHAT ENDPOINT
   ────────────────────────────────────────────────────────────────────────── */
app.post('/api/ai/chat', (req, res) => {
  try {
    const prompt = sanitizeInput(req.body.prompt || '');
    const location = req.body.location;

    if (!prompt) {
      return res.status(400).json({ status: 'error', message: 'Prompt required' });
    }

    const qLower = prompt.toLowerCase();
    let reply = "";

    if (location && location.name) {
      const loc = location;
      reply = `SafeMap AI Intelligence for **${loc.name}** (${loc.city || 'Worldwide'}):\n\n` +
              `• **Overall Safety Score**: **${loc.score}/100** (${loc.score >= 80 ? 'Safe' : loc.score >= 60 ? 'Moderate' : 'High Risk'})\n` +
              `• **Women Safety**: ${loc.sub?.women || 85}/100 · **Night Safety**: ${loc.sub?.night || 70}/100\n` +
              `• **Primary Crime Concern**: ${loc.crime?.[0]?.label || 'Vehicle Theft'} (${loc.crime?.[0]?.pct || 32}% of recorded events)\n` +
              `• **AI Recommendation**: ${loc.summary || 'Proceed with standard urban awareness.'}`;
    } else if (qLower.includes('gandhipuram') || qLower.includes('9 pm')) {
      reply = `**Gandhipuram Bus Stand** has an Overall Safety Score of **58/100 (Moderate)**. Night Safety drops to **39/100** after 9 PM due to reports of harassment and dim street lighting around the outer bus terminals. **Recommendation**: Use the well-lit main entrance and verified prepaid taxis after dark.`;
    } else if (qLower.includes('route') || qLower.includes('safest')) {
      reply = `The **Safest Route** in Coimbatore covers 6.1 km (24 min ETA) with a **92/100 Route Score**, 96% street lighting, and 88% CCTV surveillance. It avoids interior residential shortcuts that have reduced visibility at night.`;
    } else if (qLower.includes('women') || qLower.includes('highest')) {
      reply = `**RS Puram** currently ranks #1 in Coimbatore for Women Safety (**94/100**) and Night Safety (**82/100**), supported by active residential community reporting and high retail footfall.`;
    } else {
      reply = `**SafeMap AI Geospatial Intelligence**: Our system evaluates multi-layer crime datasets, historical police records, and verified community inputs. For any location on Earth, click its pin on the map or search above to inspect its 7-category safety breakdown and crime distribution cards.`;
    }

    res.json({
      status: 'success',
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 2: AI INTELLIGENCE & REAL-TIME SAFETY ENGINE API ROUTES
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Module 1: Dynamic AI Safety Score ── */
app.get('/api/ai/safety-score', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const cacheKey = `score_${lat.toFixed(3)}_${lng.toFixed(3)}`;
    let result = getCached(cacheKey);
    if (!result) {
      result = calculateDynamicSafetyScore(lat, lng, {
        timeOfDay: new Date().getHours(),
      });
      setCache(cacheKey, result, 120000);
    }
    res.json({ status: 'success', safetyScore: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 2: AI Area Intelligence ── */
app.get('/api/ai/summary', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const locationData = generateSafetyDataForLocation(
      req.query.name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat, lng, req.query.category || 'Map Point', req.query.city || 'Global'
    );
    const intelligence = generateAreaIntelligence(locationData);
    res.json({ status: 'success', intelligence });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 3: Crime Prediction ── */
app.get('/api/prediction', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const timeframe = req.query.timeframe || 'tomorrow';
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const prediction = predictCrimeRisk(lat, lng, timeframe);
    res.json({ status: 'success', prediction });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/prediction/area', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const timeframes = ['today', 'tomorrow', 'weekend', 'night'];
    const predictions = timeframes.map(tf => predictCrimeRisk(lat, lng, tf));
    res.json({ status: 'success', predictions });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 4: Traffic Intelligence ── */
app.get('/api/traffic', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const traffic = getTrafficIntelligence(lat, lng);
    res.json({ status: 'success', traffic });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 5: Weather Intelligence ── */
app.get('/api/weather', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ status: 'error', message: 'Valid lat and lng required' });
    }
    const weather = getWeatherIntelligence(lat, lng);
    res.json({ status: 'success', weather });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 6: Route Intelligence ── */
app.get('/api/routes', (req, res) => {
  try {
    const fromLat = parseFloat(req.query.fromLat);
    const fromLng = parseFloat(req.query.fromLng);
    const toLat = parseFloat(req.query.toLat);
    const toLng = parseFloat(req.query.toLng);
    if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
      return res.status(400).json({ status: 'error', message: 'Valid fromLat, fromLng, toLat, toLng required' });
    }
    const result = calculateRoutes(fromLat, fromLng, toLat, toLng);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 7: Live Alerts ── */
app.get('/api/alerts', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat || 11.0018);
    const lng = parseFloat(req.query.lng || 76.9628);
    const radius = parseFloat(req.query.radius || 5);
    const alerts = getActiveAlerts(lat, lng, radius);
    res.json({ status: 'success', ...alerts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 8: Analytics Dashboard ── */
app.get('/api/analytics', (req, res) => {
  try {
    const city = req.query.city || 'Coimbatore';
    const timeRange = req.query.timeRange || '30d';
    const analytics = getCrimeAnalytics(city, timeRange);
    res.json({ status: 'success', analytics });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 9: Smart Notifications ── */
app.get('/api/notifications', (req, res) => {
  try {
    const userId = req.query.userId || 'usr_1';
    const notifications = getNotifications(userId);
    res.json({ status: 'success', notifications });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/notifications/read', (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ status: 'error', message: 'notificationId required' });
    }
    const result = markAsRead(notificationId);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Module 10: Enhanced AI Chat (replaces basic chat) ── */
app.post('/api/ai/chat/v2', (req, res) => {
  try {
    const prompt = sanitizeInput(req.body.prompt || '');
    const location = req.body.location;
    if (!prompt) {
      return res.status(400).json({ status: 'error', message: 'Prompt required' });
    }
    const result = generateAIChatResponse(prompt, location || null);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Phase 3: AI Route Specific Corridors ── */
app.get('/api/routes/:type', (req, res) => {
  try {
    const { type } = req.params;
    const fromLat = parseFloat(req.query.fromLat || 11.0018);
    const fromLng = parseFloat(req.query.fromLng || 76.9628);
    const toLat = parseFloat(req.query.toLat || 11.0183);
    const toLng = parseFloat(req.query.toLng || 76.9664);
    const { routes } = calculateRoutes(fromLat, fromLng, toLat, toLng);
    const match = routes.find(r => r.key === type.replace('-', '_')) || routes[0];
    res.json({ status: 'success', route: match, allRoutes: routes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Phase 3: Module 11 Safety Journey Recorder ── */
app.post('/api/journey/start', (req, res) => {
  try {
    const result = startJourney(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/journey/end', (req, res) => {
  try {
    const { journeyId } = req.body || {};
    const result = endJourney(journeyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/journey/:id', (req, res) => {
  try {
    const result = getJourneyStatus(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* ── Phase 3: Module 8 AI Travel Assistant (/api/chat alias) ── */
app.post('/api/chat', (req, res) => {
  try {
    const prompt = sanitizeInput(req.body.prompt || '');
    const location = req.body.location;
    if (!prompt) {
      return res.status(400).json({ status: 'error', message: 'Prompt required' });
    }
    const result = generateAIChatResponse(prompt, location || null);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SafeMap AI Server] Phase 2 AI Intelligence API listening on port ${PORT}`);
});
