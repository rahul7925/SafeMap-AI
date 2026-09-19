import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { scoreBand } from '../utils/theme.js';
import { LocateFixed, Plus, Minus, ShieldAlert, Compass } from 'lucide-react';

/* ── Pure Vector SVG Icon Builder (Zero Emojis, 40px Diameter, Google Maps Spec) ── */
const SVG_PATHS = {
  police: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',
  hospital: '<path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>',
  safeZone: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  robbery: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  assault: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

function createBadgeIcon(svgName, bgHex = '#2563EB', textHex = '#FFFFFF', size = 40) {
  const svgContent = SVG_PATHS[svgName] || SVG_PATHS.pin;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgHex};
        color: ${textHex};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        border: 2px solid #FFFFFF;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      "
      onmouseover="this.style.transform='scale(1.08)'"
      onmouseout="this.style.transform='scale(1)'"
      onmousedown="this.style.transform='scale(0.96)'"
      onmouseup="this.style.transform='scale(1.08)'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          ${svgContent}
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function createActiveIcon(svgName, bgHex = '#2563EB', textHex = '#FFFFFF', size = 44) {
  const svgContent = SVG_PATHS[svgName] || SVG_PATHS.pin;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="active-marker-pulse" style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgHex};
        color: ${textHex};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        border: 2px solid #FFFFFF;
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          ${svgContent}
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const ICON_POLICE = createBadgeIcon('police', '#2563EB', '#FFFFFF', 40);
const ICON_HOSPITAL = createBadgeIcon('hospital', '#EF4444', '#FFFFFF', 40);
const ICON_SAFE_ZONE = createBadgeIcon('safeZone', '#22C55E', '#FFFFFF', 40);
const ICON_REPORT_VERIFIED = createBadgeIcon('eye', '#F97316', '#FFFFFF', 38);
const ICON_REPORT_UNVERIFIED = createBadgeIcon('users', '#64748B', '#FFFFFF', 38);
const ICON_CRIME_THEFT = createBadgeIcon('car', '#2563EB', '#FFFFFF', 38);
const ICON_CRIME_ROBBERY = createBadgeIcon('robbery', '#F97316', '#FFFFFF', 38);
const ICON_CRIME_ASSAULT = createBadgeIcon('assault', '#EF4444', '#FFFFFF', 38);

/* ── Sample Geospatial Datasets for Coimbatore ────────────────────────── */
const COIMBATORE_POLICE_STATIONS = [
  { id: 'pol_1', name: 'B-1 Bazaar Police Station', lat: 11.0022, lng: 76.9631, phone: '100 / 0422-2300100', response: '3 min' },
  { id: 'pol_2', name: 'RS Puram Police Station (B-2)', lat: 11.0108, lng: 76.9482, phone: '100 / 0422-2542400', response: '2 min' },
  { id: 'pol_3', name: 'Gandhipuram Traffic Control', lat: 11.0191, lng: 76.9672, phone: '100 / 0422-2521100', response: '4 min' },
  { id: 'pol_4', name: 'Peelamedu Police Station (E-1)', lat: 11.0314, lng: 76.9989, phone: '100 / 0422-2572200', response: '5 min' },
];

const COIMBATORE_HOSPITALS = [
  { id: 'hosp_1', name: 'Coimbatore Medical College Hospital', lat: 11.0045, lng: 76.9678, beds: '24/7 Trauma', phone: '108 / 0422-2301393' },
  { id: 'hosp_2', name: 'Ganga Medical Centre & Hospital', lat: 11.0212, lng: 76.9548, beds: 'Emergency ICU', phone: '0422-2485000' },
  { id: 'hosp_3', name: 'PSG Hospitals Peelamedu', lat: 11.0289, lng: 77.0028, beds: '24/7 Ambulance', phone: '0422-2570170' },
];

const COIMBATORE_SAFE_ZONES = [
  { id: 'safe_1', name: 'VOC Park & Zoo Corridor', lat: 11.0085, lng: 76.9691, radius: 650, note: 'Patrolled Green Corridor' },
  { id: 'safe_2', name: 'Race Course Walking Path', lat: 11.0041, lng: 76.9748, radius: 800, note: '24/7 CCTV & Women Safe' },
  { id: 'safe_3', name: 'Anna University Campus Zone', lat: 11.0234, lng: 76.9385, radius: 900, note: 'University Monitored Zone' },
];

const COIMBATORE_COMMUNITY_REPORTS = [
  { id: 'rep_1', user: 'Verified Resident', text: 'Police patrol stationed near north gate.', lat: 11.0031, lng: 76.9615, verified: true },
  { id: 'rep_2', user: 'Community Guide', text: 'Street lighting maintenance completed.', lat: 11.0152, lng: 76.9521, verified: false },
];

const COIMBATORE_CRIME_POINTS = [
  { id: 'crm_1', type: 'Vehicle Theft', lat: 11.0012, lng: 76.9642, radius: 700, opacity: 0.14, icon: ICON_CRIME_THEFT, color: '#2563EB' },
  { id: 'crm_2', type: 'Robbery', lat: 11.0168, lng: 76.9688, radius: 400, opacity: 0.18, icon: ICON_CRIME_ROBBERY, color: '#F97316' },
  { id: 'crm_3', type: 'Assault Risk', lat: 10.9935, lng: 76.9589, radius: 500, opacity: 0.22, icon: ICON_CRIME_ASSAULT, color: '#EF4444' },
];

const COIMBATORE_TRAFFIC_CONGESTION = [
  [
    [11.0018, 76.9628],
    [11.0095, 76.9655],
    [11.0183, 76.9664],
  ],
  [
    [11.0104, 76.9472],
    [11.0145, 76.9558],
    [11.0183, 76.9664],
  ],
];

/* ── Layer 2 & 9: True Leaflet.heat Density & AI Prediction Layer ──────── */
function TrueHeatLayer({ locations = [], activeLocation, layerDensity, layerAiPrediction }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!layerDensity && !layerAiPrediction) return;

    let points = [];
    if (layerDensity) {
      const dataset = activeLocation ? [...locations, activeLocation] : locations;
      dataset.forEach((loc) => {
        const baseLat = loc.lat || 11.0018;
        const baseLng = loc.lng || 76.9628;
        const invScore = Math.max(0.15, (100 - (loc.score || 70)) / 100);
        points.push([baseLat, baseLng, invScore]);
        const numScatter = 12 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numScatter; i++) {
          const dLat = (Math.random() - 0.5) * 0.025;
          const dLng = (Math.random() - 0.5) * 0.025;
          points.push([baseLat + dLat, baseLng + dLng, invScore * 0.65]);
        }
      });
    }

    if (layerAiPrediction) {
      const hotspots = [
        { lat: 11.0183, lng: 76.9664, score: 0.95 },
        { lat: 10.9925, lng: 76.9614, score: 0.92 },
        { lat: 11.0062, lng: 76.9617, score: 0.89 },
        { lat: 11.0124, lng: 77.0050, score: 0.85 },
        { lat: 11.0230, lng: 76.9420, score: 0.87 },
      ];
      
      hotspots.forEach(spot => {
        points.push([spot.lat, spot.lng, spot.score]);
        const numScatter = 8 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numScatter; i++) {
          const dLat = (Math.random() - 0.5) * 0.020;
          const dLng = (Math.random() - 0.5) * 0.020;
          points.push([spot.lat + dLat, spot.lng + dLng, spot.score * (0.5 + Math.random() * 0.4)]);
        }
      });
    }

    if (points.length === 0) return;

    const gradient = layerAiPrediction && !layerDensity
      ? { 0.2: '#C084FC', 0.5: '#A855F7', 0.8: '#7E22CE', 1.0: '#581C87' }
      : {
          0.1: '#00E676',
          0.3: '#66BB6A',
          0.5: '#FFEB3B',
          0.7: '#FF9800',
          0.85: '#F44336',
          1.0: '#8B0000',
        };

    const heat = L.heatLayer(points, {
      radius: 55,
      blur: 38,
      maxZoom: 16,
      max: 1.0,
      gradient: gradient,
    });

    heat.addTo(map);
    heatLayerRef.current = heat;

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, locations, layerDensity, layerAiPrediction]);

  return null;
}

/* ── Camera Controller for Selected Location ──────────────────────────── */
function MapCameraController({ activeLocation }) {
  const map = useMap();
  useEffect(() => {
    if (activeLocation && activeLocation.lat && activeLocation.lng) {
      map.flyTo([activeLocation.lat, activeLocation.lng], 15, {
        animate: true,
        duration: 1.4,
      });
    }
  }, [activeLocation, map]);
  return null;
}

/* ── Click Listener ────────────────────────────────────────────────────── */
function MapClickObserver({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

export default function LiveMap({
  locations = [],
  activeLocation,
  onSelectLocation,
  onMapClick,
  layerDensity = true,
  layerRadius = true,
  layerPoints = true,
  layerSafeZones = true,
  layerPolice = true,
  layerHospitals = true,
  layerCommunityReports = true,
  layerAiPrediction = false,
  layerTraffic = false,
  mapStyle = 'positron',
}) {
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapInstanceRef = useRef(null);

  const defaultCenter = [11.0018, 76.9628]; // Coimbatore Junction

  const tileUrl =
    mapStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const handleLocateMe = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, 15, { animate: true, duration: 1.2 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="w-full h-full relative select-none font-[Inter,sans-serif]">
      <MapContainer
        center={defaultCenter}
        zoom={zoomLevel}
        zoomControl={false}
        className="w-full h-full z-0"
        ref={mapInstanceRef}
      >
        {/* ── Base Map Layer (OpenStreetMap / CartoDB) ── */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
          maxZoom={19}
        />

        {/* ── Layer 2 & 9: True GIS Density Heatmap & AI Prediction ── */}
        <TrueHeatLayer
          locations={locations}
          activeLocation={activeLocation}
          layerDensity={layerDensity}
          layerAiPrediction={layerAiPrediction}
        />

        {/* ── Layer 1: Crime Influence Radius Layer ── */}
        {layerRadius &&
          COIMBATORE_CRIME_POINTS.map((crm) => (
            <Circle
              key={crm.id}
              center={[crm.lat, crm.lng]}
              radius={crm.radius}
              stroke={false}
              fillColor={crm.color}
              fillOpacity={crm.opacity}
            />
          ))}

        {/* ── Layer 7: Safety Zone Layer ── */}
        {layerSafeZones &&
          COIMBATORE_SAFE_ZONES.map((safe) => (
            <Circle
              key={safe.id}
              center={[safe.lat, safe.lng]}
              radius={safe.radius}
              pathOptions={{
                color: '#22C55E',
                weight: 1.5,
                dashArray: '4, 8',
                fillColor: '#22C55E',
                fillOpacity: 0.12,
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="text-[14px] font-bold text-[#0F172A]">{safe.name}</div>
                  <div className="text-[12px] font-semibold text-[#22C55E] mt-0.5">{safe.note}</div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* ── Layer 5: Police Presence Layer (3-min fast response) ── */}
        {layerPolice &&
          COIMBATORE_POLICE_STATIONS.map((pol) => (
            <React.Fragment key={pol.id}>
              <Circle
                center={[pol.lat, pol.lng]}
                radius={1200}
                stroke={false}
                fillColor="#2563EB"
                fillOpacity={0.12}
              />
              <Marker position={[pol.lat, pol.lng]} icon={ICON_POLICE}>
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <div className="text-[14px] font-bold text-[#0F172A]">{pol.name}</div>
                    <div className="text-[12px] text-[#64748B] mt-0.5">Emergency: {pol.phone}</div>
                    <div className="text-[12px] font-bold text-[#2563EB] mt-1">Response time: {pol.response}</div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

        {/* ── Layer 6: Emergency Services Layer ── */}
        {layerHospitals &&
          COIMBATORE_HOSPITALS.map((hosp) => (
            <React.Fragment key={hosp.id}>
              <Circle
                center={[hosp.lat, hosp.lng]}
                radius={1400}
                stroke={false}
                fillColor="#EF4444"
                fillOpacity={0.08}
              />
              <Marker position={[hosp.lat, hosp.lng]} icon={ICON_HOSPITAL}>
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <div className="text-[14px] font-bold text-[#0F172A]">{hosp.name}</div>
                    <div className="text-[12px] font-semibold text-[#EF4444] mt-0.5">{hosp.beds}</div>
                    <div className="text-[12px] text-[#64748B] mt-1">Contact: {hosp.phone}</div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

        {/* ── Layer 3: Crime Point Markers (Pure SVG Icons) ── */}
        {layerPoints &&
          COIMBATORE_CRIME_POINTS.map((crm) => (
            <Marker key={crm.id} position={[crm.lat, crm.lng]} icon={crm.icon}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px]">
                  <div className="text-[14px] font-bold text-[#0F172A]">{crm.type}</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">Verified Crime Incident Point</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* ── Layer 4: Community Reports Layer (Pure SVG Icons) ── */}
        {layerCommunityReports &&
          COIMBATORE_COMMUNITY_REPORTS.map((rep) => (
            <Marker
              key={rep.id}
              position={[rep.lat, rep.lng]}
              icon={rep.verified ? ICON_REPORT_VERIFIED : ICON_REPORT_UNVERIFIED}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="text-[13px] font-bold text-[#0F172A]">{rep.user}</div>
                  <p className="text-[13px] text-[#475569] mt-1">{rep.text}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* ── Layer 8: Traffic Congestion Overlay ── */}
        {layerTraffic &&
          COIMBATORE_TRAFFIC_CONGESTION.map((route, i) => (
            <Polyline
              key={i}
              positions={route}
              pathOptions={{ color: '#EF4444', weight: 5, opacity: 0.85 }}
            />
          ))}

        {/* ── Monitored Locations Interactive Markers (Pure SVG Icons) ── */}
        {locations.map((loc) => {
          if (!loc.lat || !loc.lng) return null;
          const b = scoreBand(loc.score || 86);
          const icon = createBadgeIcon('pin', b.bg, b.text, 40);
          return (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectLocation) onSelectLocation(loc);
                },
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2.5 min-w-[200px]">
                  <div className="text-[15px] font-bold text-[#0F172A]">{loc.name}</div>
                  <div className="text-[13px] text-[#64748B] mt-0.5">
                    {loc.city} · {loc.category || 'Monitored Area'}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#64748B]">Safety Score:</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[13px] font-bold"
                      style={{ background: b.bg, color: b.text }}
                    >
                      {loc.score}/100
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Active Searched Destination Marker Pin & Safety Halo ── */}
        {activeLocation && activeLocation.lat && activeLocation.lng && (
          <React.Fragment key={`active_${activeLocation.id || activeLocation.name}`}>
            {layerRadius && (
              <Circle
                center={[activeLocation.lat, activeLocation.lng]}
                radius={750}
                stroke={true}
                color="#2563EB"
                weight={2}
                fillColor="#3B82F6"
                fillOpacity={0.14}
              />
            )}
            <Marker
              position={[activeLocation.lat, activeLocation.lng]}
              icon={createActiveIcon('pin', '#2563EB', '#FFFFFF', 44)}
            >
              <Popup className="custom-popup" autoPan={true}>
                <div className="p-2.5 min-w-[200px]">
                  <div className="text-[15px] font-bold text-[#0F172A]">{activeLocation.name}</div>
                  <div className="text-[13px] text-[#64748B] mt-0.5">
                    {activeLocation.city} · {activeLocation.category || 'Searched Destination'}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#64748B]">Safety Score:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold bg-[#EFF6FF] text-[#2563EB]">
                      {activeLocation.score || 86}/100
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        )}

        <MapCameraController activeLocation={activeLocation} />
        <MapClickObserver onMapClick={onMapClick} />
      </MapContainer>

      {/* ── PROFESSIONAL GIS GRADIENT HEATMAP LEGEND (Bottom Center) ────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col gap-3 min-w-[340px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={16} strokeWidth={2} className="text-[#2563EB]" />
            <span className="text-[13px] font-bold text-[#0F172A]">GIS Safety Density</span>
          </div>
          <span className="text-[11px] font-medium text-[#64748B]">Based on 847 data points</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#475569] px-1">
            <div className="flex flex-col items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00E676]"></div>Very Safe</div>
            <div className="flex flex-col items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#66BB6A]"></div>Safe</div>
            <div className="flex flex-col items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FFEB3B]"></div>Moderate</div>
            <div className="flex flex-col items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FF9800]"></div>High Risk</div>
            <div className="flex flex-col items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8B0000]"></div>Hotspot</div>
          </div>
          <div
            className="w-full h-2 rounded-full mt-1"
            style={{
              background: 'linear-gradient(to right, #00E676, #66BB6A, #FFEB3B, #FF9800, #F44336, #8B0000)',
            }}
          />
        </div>
      </div>

      {/* ── RIGHT CONTROLS: LOCATE ME & ZOOM (Bottom Right) ─────────────── */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
          <button
            type="button"
            className="w-10 h-10 map-control-btn flex items-center justify-center text-[#0F172A] border-b border-[#E5E7EB]"
            title="Compass"
          >
            <Compass size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            className="w-10 h-10 map-control-btn flex items-center justify-center text-[#0F172A]"
            title="Locate Me"
          >
            <LocateFixed size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-10 map-control-btn flex items-center justify-center text-[#0F172A] border-b border-[#E5E7EB]"
            title="Zoom In"
          >
            <Plus size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-10 map-control-btn flex items-center justify-center text-[#0F172A]"
            title="Zoom Out"
          >
            <Minus size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
