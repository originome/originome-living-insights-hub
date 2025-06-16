
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VulnerabilityAsset {
  id: string;
  name: string;
  type: 'substation' | 'feeder_line' | 'transformer' | 'transmission_tower';
  latitude: number;
  longitude: number;
  riskScore: number;
  failureProbability: number;
  criticalFactors: string[];
  recommendedPlaybook: string;
}

interface StormTrackPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  category: number;
  windSpeed: number;
}

interface HurricaneVelocityMapProps {
  vulnerabilityData: VulnerabilityAsset[];
  stormTrack: StormTrackPoint[];
  onAssetSelect: (assetId: string) => void;
  selectedAsset: string | null;
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoib3JpZ2lub21lIiwiYSI6ImNtYnd0enNlajB3cnYybXBxMXZhZXl2eXoifQ.pHmSai2O3d9uh4E_xTUPkw';

const HurricaneVelocityMap: React.FC<HurricaneVelocityMapProps> = ({
  vulnerabilityData,
  stormTrack,
  onAssetSelect,
  selectedAsset
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-82.0, 28.0], // Florida Gulf Coast default
      zoom: 8,
      pitch: 20,
      bearing: 0
    });

    map.current.on('style.load', () => {
      setMapLoaded(true);
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing layers
    ['asset-markers', 'storm-track', 'vulnerability-heatmap'].forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });
    
    ['assets', 'storm', 'vulnerability-zones'].forEach(sourceId => {
      if (map.current!.getSource(sourceId)) {
        map.current!.removeSource(sourceId);
      }
    });

    // Add vulnerability zones (heatmap)
    const vulnerabilityZones = {
      type: 'FeatureCollection' as const,
      features: vulnerabilityData.map(asset => ({
        type: 'Feature' as const,
        properties: {
          riskScore: asset.riskScore,
          failureProbability: asset.failureProbability
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [asset.longitude, asset.latitude]
        }
      }))
    };

    map.current.addSource('vulnerability-zones', {
      type: 'geojson',
      data: vulnerabilityZones
    });

    map.current.addLayer({
      id: 'vulnerability-heatmap',
      type: 'heatmap',
      source: 'vulnerability-zones',
      maxzoom: 12,
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
          12, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,255,0)',
          0.2, 'rgba(0,255,255,0.3)',
          0.4, 'rgba(0,255,0,0.5)',
          0.6, 'rgba(255,255,0,0.7)',
          0.8, 'rgba(255,165,0,0.8)',
          1, 'rgba(255,0,0,1)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 5,
          12, 50
        ]
      }
    });

    // Add storm track
    if (stormTrack.length > 0) {
      const stormTrackGeoJSON = {
        type: 'FeatureCollection' as const,
        features: [{
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: stormTrack.map(point => [point.longitude, point.latitude])
          }
        }]
      };

      map.current.addSource('storm', {
        type: 'geojson',
        data: stormTrackGeoJSON
      });

      map.current.addLayer({
        id: 'storm-track',
        type: 'line',
        source: 'storm',
        paint: {
          'line-color': '#ff0000',
          'line-width': 4,
          'line-dasharray': [2, 2]
        }
      });
    }

    // Add asset markers
    const assetsGeoJSON = {
      type: 'FeatureCollection' as const,
      features: vulnerabilityData.map(asset => ({
        type: 'Feature' as const,
        properties: {
          id: asset.id,
          name: asset.name,
          type: asset.type,
          riskScore: asset.riskScore,
          failureProbability: asset.failureProbability,
          criticalFactors: asset.criticalFactors.join(', ')
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [asset.longitude, asset.latitude]
        }
      }))
    };

    map.current.addSource('assets', {
      type: 'geojson',
      data: assetsGeoJSON
    });

    map.current.addLayer({
      id: 'asset-markers',
      type: 'circle',
      source: 'assets',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'riskScore'],
          0, 6,
          100, 20
        ],
        'circle-color': [
          'case',
          ['>=', ['get', 'riskScore'], 80], '#dc2626', // Critical - Red
          ['>=', ['get', 'riskScore'], 60], '#ea580c', // High - Orange
          ['>=', ['get', 'riskScore'], 40], '#d97706', // Moderate - Amber
          '#059669' // Low - Green
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': [
          'case',
          ['==', ['get', 'id'], selectedAsset || ''], 4,
          2
        ],
        'circle-stroke-color': [
          'case',
          ['==', ['get', 'id'], selectedAsset || ''], '#ffffff',
          '#000000'
        ]
      }
    });

    // Add click handler
    map.current.on('click', 'asset-markers', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const assetId = feature.properties?.id;
        if (assetId && feature.geometry && feature.geometry.type === 'Point') {
          onAssetSelect(assetId);
          
          // Type-cast geometry to Point to access coordinates
          const pointGeometry = feature.geometry as GeoJSON.Point;
          
          // Create popup
          new mapboxgl.Popup({ offset: 25 })
            .setLngLat([pointGeometry.coordinates[0], pointGeometry.coordinates[1]])
            .setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-sm">${feature.properties?.name}</h3>
                <p class="text-xs text-gray-600 capitalize">${feature.properties?.type.replace('_', ' ')}</p>
                <div class="mt-2 space-y-1">
                  <div class="text-xs">
                    <span class="font-semibold">Risk Score:</span> 
                    <span class="text-red-600 font-bold">${feature.properties?.riskScore}</span>
                  </div>
                  <div class="text-xs">
                    <span class="font-semibold">Failure Probability:</span> 
                    <span class="font-bold">${feature.properties?.failureProbability}%</span>
                  </div>
                  <div class="text-xs">
                    <span class="font-semibold">Critical Factors:</span>
                    <p class="text-gray-700 mt-1">${feature.properties?.criticalFactors}</p>
                  </div>
                </div>
              </div>
            `)
            .addTo(map.current!);
        }
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'asset-markers', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'asset-markers', () => {
      map.current!.getCanvas().style.cursor = '';
    });

  }, [vulnerabilityData, stormTrack, selectedAsset, mapLoaded]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-slate-900">Asset Risk Levels</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Critical (80-100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>High (60-79)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
              <span>Moderate (40-59)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Low (0-39)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span>Storm Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-sm">
          <div className="font-semibold text-slate-900">Hurricane Operations</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-slate-700">Tracking {vulnerabilityData.length} assets</span>
          </div>
          <div className="text-xs text-slate-600">
            Click assets for Pre-Landfall Playbooks
          </div>
        </div>
      </div>
    </div>
  );
};

export default HurricaneVelocityMap;
