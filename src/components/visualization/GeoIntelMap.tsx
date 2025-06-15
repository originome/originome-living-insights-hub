
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";

interface MicroAnomaly {
  id: string;
  latitude: number;
  longitude: number;
  type: 'thermal' | 'pollution' | 'atmospheric' | 'electromagnetic';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  description: string;
  detectedAt: Date;
  radius: number;
  confidence: number;
  compoundFactors: string[];
}

interface GeoIntelMapProps {
  center: { lat: number; lng: number };
  anomalies: MicroAnomaly[];
  viewMode: 'heatmap' | 'markers' | 'compound';
  onAnomalySelect: (anomaly: MicroAnomaly | null) => void;
  selectedAnomaly: MicroAnomaly | null;
}

// Set Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoib3JpZ2lub21lIiwiYSI6ImNtYnd0enNlajB3cnYybXBxMXZhZXl2eXoifQ.pHmSai2O3d9uh4E_xTUPkw';

const GeoIntelMap: React.FC<GeoIntelMapProps> = ({
  center,
  anomalies,
  viewMode,
  onAnomalySelect,
  selectedAnomaly
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [center.lng, center.lat],
      zoom: 12,
      pitch: 45,
      bearing: 0
    });

    // Wait for style to load before setting mapLoaded to true
    map.current.on('style.load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, [center]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing layers and sources
    if (map.current.getLayer('anomaly-markers')) {
      map.current.removeLayer('anomaly-markers');
    }
    if (map.current.getLayer('anomaly-heatmap')) {
      map.current.removeLayer('anomaly-heatmap');
    }
    if (map.current.getSource('anomalies')) {
      map.current.removeSource('anomalies');
    }

    // Prepare GeoJSON data
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: anomalies.map(anomaly => ({
        type: 'Feature' as const,
        properties: {
          id: anomaly.id,
          type: anomaly.type,
          severity: anomaly.severity,
          riskScore: anomaly.riskScore,
          description: anomaly.description,
          confidence: anomaly.confidence
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [anomaly.longitude, anomaly.latitude]
        }
      }))
    };

    // Add source
    map.current.addSource('anomalies', {
      type: 'geojson',
      data: geojsonData
    });

    // Add appropriate layer based on view mode
    if (viewMode === 'heatmap' || viewMode === 'compound') {
      // Add heatmap layer
      map.current.addLayer({
        id: 'anomaly-heatmap',
        type: 'heatmap',
        source: 'anomalies',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'riskScore'],
            0, 0,
            100, 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 30
          ]
        }
      });
    }

    if (viewMode === 'markers' || viewMode === 'compound') {
      // Add marker layer
      map.current.addLayer({
        id: 'anomaly-markers',
        type: 'circle',
        source: 'anomalies',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'riskScore'],
            0, 5,
            100, 15
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'severity'], 'critical'], '#dc2626',
            ['==', ['get', 'severity'], 'high'], '#ea580c',
            ['==', ['get', 'severity'], 'moderate'], '#d97706',
            '#2563eb'
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'id'], selectedAnomaly?.id || ''], '#ffffff',
            'transparent'
          ]
        }
      });

      // Add click handler for markers
      map.current.on('click', 'anomaly-markers', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const anomaly = anomalies.find(a => a.id === feature.properties?.id);
          if (anomaly) {
            onAnomalySelect(anomaly);
            
            // Create popup
            new mapboxgl.Popup({ offset: 25 })
              .setLngLat([anomaly.longitude, anomaly.latitude])
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)} Anomaly</h3>
                  <p class="text-xs text-gray-600 mt-1">${anomaly.description}</p>
                  <div class="mt-2 text-xs">
                    <div>Risk Score: <strong>${anomaly.riskScore}</strong></div>
                    <div>Confidence: <strong>${anomaly.confidence.toFixed(0)}%</strong></div>
                  </div>
                </div>
              `)
              .addTo(map.current!);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'anomaly-markers', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'anomaly-markers', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    }

  }, [anomalies, viewMode, selectedAnomaly, mapLoaded]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-sm">
          <div className="font-semibold text-slate-900">Live Detection Status</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-700">Scanning: {anomalies.length} anomalies</span>
          </div>
          <div className="text-xs text-slate-600">
            View: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-slate-900">Risk Severity</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoIntelMap;
