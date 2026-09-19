import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

import LiveMap from './components/LiveMap.jsx';
import TopHeader from './components/TopHeader.jsx';
import FloatingLeftControls from './components/FloatingLeftControls.jsx';
import LocationSidePanel from './components/LocationSidePanel.jsx';
import MobileBottomSheet from './components/MobileBottomSheet.jsx';
import RouteComparisonPanel from './components/RouteComparisonPanel.jsx';
import ReportModal from './components/ReportModal.jsx';

/* ── Phase 2: AI Intelligence Components ── */
import AIChatPanel from './components/AIChatPanel.jsx';
import WeatherTrafficBar from './components/WeatherTrafficBar.jsx';
import AlertsPanel from './components/AlertsPanel.jsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx';

/* ── Phase 4: Enterprise Geospatial Suite Modals ── */
import ExportSafetyReportModal from './components/ExportSafetyReportModal.jsx';
import ShareLocationModal from './components/ShareLocationModal.jsx';
import GeofenceAlertModal from './components/GeofenceAlertModal.jsx';

import { useTheme } from './hooks/useTheme.js';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const searchCacheRef = useRef(new Map());

  /* ── 10-Layer GIS Geospatial Visualization Engine State ── */
  const [layerDensity, setLayerDensity] = useState(true);
  const [layerRadius, setLayerRadius] = useState(true);
  const [layerPoints, setLayerPoints] = useState(true);
  const [layerSafeZones, setLayerSafeZones] = useState(true);
  const [layerPolice, setLayerPolice] = useState(true);
  const [layerHospitals, setLayerHospitals] = useState(true);
  const [layerCommunityReports, setLayerCommunityReports] = useState(true);
  const [layerAiPrediction, setLayerAiPrediction] = useState(false);
  const [layerTraffic, setLayerTraffic] = useState(false);
  const [layerSatellite, setLayerSatellite] = useState(false);

  /* Filter state labels */
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [crimeFilter, setCrimeFilter] = useState('All Crimes');
  const [dateRange, setDateRange] = useState('Select Date');
  const [safetyFocus, setSafetyFocus] = useState('All');

  /* Route comparison mode */
  const [routeMode, setRouteMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('safest');
  const [showReport, setShowReport] = useState(false);

  /* ── Phase 2: AI Intelligence State ── */
  const [weatherData, setWeatherData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [aiIntelligence, setAiIntelligence] = useState(null);
  const [dynamicSafetyScore, setDynamicSafetyScore] = useState(null);

  /* ── Phase 4: Enterprise Geospatial Modals State ── */
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);

  /* Detect if screen is mobile/tablet (<1024px) for Apple Maps bottom sheet */
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Commercial Theme Hook: Light | Dark | System Default */
  const { themeMode, setThemeMode } = useTheme();

  /* ── Load locations dataset ───────────────────── */
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('http://localhost:5000/api/locations');
      if (data?.locations) {
        setLocations(data.locations);
        const def = data.locations.find((l) => l.name === 'Coimbatore Junction') || data.locations[0];
        if (def && !activeLocation) {
          setActiveLocation(def);
        }
      }
    } catch (err) {
      setError('Failed to connect to backend server. Using local fallback dataset.');
      const fallback = [
        { id: 1, name: 'Coimbatore Junction', city: 'Coimbatore', score: 86, category: 'Transit Hub', lat: 11.0018, lng: 76.9628 },
        { id: 2, name: 'Gandhipuram Bus Stand', city: 'Coimbatore', score: 78, category: 'Transit Hub', lat: 11.0183, lng: 76.9664 },
        { id: 3, name: 'RS Puram Commercial Area', city: 'Coimbatore', score: 92, category: 'Commercial', lat: 11.0104, lng: 76.9472 },
        { id: 4, name: 'Ukadam Bus Terminus', city: 'Coimbatore', score: 62, category: 'Transit Hub', lat: 10.9925, lng: 76.9614 },
      ];
      setLocations(fallback);
      if (!activeLocation) setActiveLocation(fallback[0]);
    } finally {
      setLoading(false);
    }
  }, [activeLocation]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  /* ── Phase 2: Fetch AI intelligence when active location changes ── */
  useEffect(() => {
    if (!activeLocation?.lat || !activeLocation?.lng) return;
    const lat = activeLocation.lat;
    const lng = activeLocation.lng;
    const name = encodeURIComponent(activeLocation.name || '');
    const city = encodeURIComponent(activeLocation.city || '');
    
    // Fetch alerts
    axios.get(`http://localhost:5000/api/alerts?lat=${lat}&lng=${lng}`)
      .then(({ data }) => setAlertsData(data.alerts || []))
      .catch(() => {});

    const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
    if (searchCacheRef.current.has(cacheKey)) {
      const cached = searchCacheRef.current.get(cacheKey);
      setDynamicSafetyScore(cached.safetyScore);
      setAiIntelligence(cached.intelligence);
      setPredictions(cached.predictions);
      setWeatherData(cached.weather);
      setTrafficData(cached.traffic);
      return;
    }

    setSidebarLoading(true);
    
    Promise.all([
      axios.get(`http://localhost:5000/api/ai/safety-score?lat=${lat}&lng=${lng}`).catch(() => ({ data: {} })),
      axios.get(`http://localhost:5000/api/ai/summary?lat=${lat}&lng=${lng}&name=${name}&city=${city}`).catch(() => ({ data: {} })),
      axios.get(`http://localhost:5000/api/prediction/area?lat=${lat}&lng=${lng}`).catch(() => ({ data: {} })),
      axios.get(`http://localhost:5000/api/weather?lat=${lat}&lng=${lng}`).catch(() => ({ data: {} })),
      axios.get(`http://localhost:5000/api/traffic?lat=${lat}&lng=${lng}`).catch(() => ({ data: {} })),
    ]).then(([safetyRes, summaryRes, predRes, weatherRes, trafficRes]) => {
      const results = {
        safetyScore: safetyRes.data.safetyScore || null,
        intelligence: summaryRes.data.intelligence || null,
        predictions: predRes.data.predictions || [],
        weather: weatherRes.data.weather || null,
        traffic: trafficRes.data.traffic || null,
      };
      
      setDynamicSafetyScore(results.safetyScore);
      setAiIntelligence(results.intelligence);
      setPredictions(results.predictions);
      setWeatherData(results.weather);
      setTrafficData(results.traffic);
      
      searchCacheRef.current.set(cacheKey, results);
    }).finally(() => {
      setSidebarLoading(false);
    });
  }, [activeLocation]);

  const handleMapClick = (latlng) => {
    // Map click handler
  };

  return (
    <div className="w-screen h-screen bg-[#FFFFFF] flex flex-col overflow-hidden select-none font-[Inter,sans-serif]">
      {/* ── 1. COMMERCIAL FIXED TOP HEADER (72px) ───────────────────────── */}
      <TopHeader
        onSelectLocation={(loc) => {
          setActiveLocation(loc);
          setLocations((prev) => {
            const exists = prev.some(
              (l) => l.id === loc.id || (l.lat && loc.lat && Math.abs(l.lat - loc.lat) < 0.0001 && Math.abs(l.lng - loc.lng) < 0.0001)
            );
            return exists ? prev : [loc, ...prev];
          });
          setRouteMode(false);
        }}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        onOpenAlerts={() => setShowAlerts(!showAlerts)}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      {/* ── 2. MAIN WORKSPACE: MAP + RIGHT PANEL (or BOTTOM SHEET) ──────── */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Map Container (78-80% on Desktop, 100% on Tablet/Mobile) */}
        <div className="flex-1 h-full relative z-10">
          {/* Floating Left GIS Controls (Apple Maps / Google Maps style) */}
          <FloatingLeftControls
            layerDensity={layerDensity}
            setLayerDensity={setLayerDensity}
            layerRadius={layerRadius}
            setLayerRadius={setLayerRadius}
            layerPoints={layerPoints}
            setLayerPoints={setLayerPoints}
            layerSafeZones={layerSafeZones}
            setLayerSafeZones={setLayerSafeZones}
            layerPolice={layerPolice}
            setLayerPolice={setLayerPolice}
            layerHospitals={layerHospitals}
            setLayerHospitals={setLayerHospitals}
            layerCommunityReports={layerCommunityReports}
            setLayerCommunityReports={setLayerCommunityReports}
            layerAiPrediction={layerAiPrediction}
            setLayerAiPrediction={setLayerAiPrediction}
            layerTraffic={layerTraffic}
            setLayerTraffic={setLayerTraffic}
            layerSatellite={layerSatellite}
            setLayerSatellite={setLayerSatellite}
            timeFilter={timeFilter}
            crimeFilter={crimeFilter}
            dateRange={dateRange}
            safetyFocus={safetyFocus}
          />

          {/* Core Interactive Map */}
          <LiveMap
            locations={locations}
            activeLocation={activeLocation}
            onSelectLocation={(loc) => {
              setActiveLocation(loc);
              setRouteMode(false);
            }}
            onMapClick={handleMapClick}
            layerDensity={layerDensity}
            layerRadius={layerRadius}
            layerPoints={layerPoints}
            layerSafeZones={layerSafeZones}
            layerPolice={layerPolice}
            layerHospitals={layerHospitals}
            layerCommunityReports={layerCommunityReports}
            layerAiPrediction={layerAiPrediction}
            layerTraffic={layerTraffic}
            mapStyle={layerSatellite ? 'voyager' : 'positron'}
          />

          {/* Phase 2: Floating Weather + Traffic Bar */}
          <WeatherTrafficBar
            weather={weatherData}
            traffic={trafficData}
          />
        </div>

        {/* ── 3. DESKTOP RIGHT INFORMATION PANEL (420px Fixed) ───────────── */}
        {!isMobileOrTablet && activeLocation && (
          <AnimatePresence mode="wait">
            <motion.div
              key={routeMode ? 'route-desktop' : 'place-desktop'}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full w-[420px] shrink-0 z-20 bg-white border-l border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              {!routeMode ? (
                <LocationSidePanel
                  location={activeLocation}
                  sidebarLoading={sidebarLoading}
                  onClose={() => setActiveLocation(null)}
                  onStartRouteMode={() => setRouteMode(true)}
                  onOpenReportModal={() => setShowReport(true)}
                  predictions={predictions}
                  aiIntelligence={aiIntelligence}
                  dynamicSafetyScore={dynamicSafetyScore}
                  weatherData={weatherData}
                  trafficData={trafficData}
                  onOpenShareModal={() => setShowShareModal(true)}
                  onOpenAlertsModal={() => setShowGeofenceModal(true)}
                  onOpenExportModal={() => setShowExportModal(true)}
                />
              ) : (
                <RouteComparisonPanel
                  location={activeLocation}
                  selectedRoute={selectedRoute}
                  onSelectRoute={setSelectedRoute}
                  onBack={() => setRouteMode(false)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Phase 2: Alerts Panel (anchored to top-right) */}
        <AlertsPanel
          alerts={alertsData}
          isOpen={showAlerts}
          onClose={() => setShowAlerts(false)}
        />
      </div>

      {/* ── 4. TABLET & MOBILE BOTTOM SHEET ──────────────────────────────── */}
      {isMobileOrTablet && activeLocation && !routeMode && (
        <MobileBottomSheet
          location={activeLocation}
          onClose={() => setActiveLocation(null)}
          onStartRouteMode={() => setRouteMode(true)}
        />
      )}

      {/* Modals & Overlays */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetLocation={activeLocation}
        onReportSubmitted={() => fetchLocations()}
      />

      {/* Phase 2: Analytics Dashboard Modal */}
      <AnalyticsDashboard
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Phase 2: Floating AI Chat Assistant */}
      <AIChatPanel activeLocation={activeLocation} />

      {/* ── Phase 4: Enterprise Geospatial Suite Modals ── */}
      <ExportSafetyReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        location={activeLocation}
        aiIntelligence={aiIntelligence}
        dynamicSafetyScore={dynamicSafetyScore?.overall}
      />

      <ShareLocationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        location={activeLocation}
      />

      <GeofenceAlertModal
        isOpen={showGeofenceModal}
        onClose={() => setShowGeofenceModal(false)}
        location={activeLocation}
        onAlertConfigured={(cfg) => {
          console.log('Geofence perimeter configured:', cfg);
        }}
      />
    </div>
  );
}
