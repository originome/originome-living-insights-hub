import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MicroAnomalyData } from '@/services/satelliteDataService';

// IMPORTANT: You need to add your Mapbox public token here for the map to work.
// You can get a free token from https://www.mapbox.com/
// For production, it's recommended to store this in a secure way, like Supabase secrets.
mapboxgl.accessToken = 'pk.eyJ1Ijoib3JpZ2lub21lIiwiYSI6ImNtYnd0enNlajB3cnYybXBxMXZhZXl2eXoifQ.pHmSai2O3d9uh4E_xTUPkw';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  anomalies: MicroAnomalyData[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude, anomalies }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current || !mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_PUBLIC_TOKEN') return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [longitude, latitude],
      zoom: 12,
      pitch: 45,
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;
      
      anomalies.forEach((anomaly, index) => {
        if (!map.current) return;
        // Since anomaly data doesn't contain coordinates, we add a random offset to the main location for visualization purposes.
        const anomalyLng = longitude + (Math.random() - 0.5) * 0.05;
        const anomalyLat = latitude + (Math.random() - 0.5) * 0.05;

        const sourceId = `anomaly-source-${index}`;
        map.current.addSource(sourceId, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': { 'type': 'Point', 'coordinates': [anomalyLng, anomalyLat] },
              'properties': {}
            }]
          }
        });
        
        let color = '#3b82f6';
        switch (anomaly.severity) {
            case 'critical': color = '#ef4444'; break;
            case 'high': color = '#f97316'; break;
            case 'moderate': color = '#eab308'; break;
        }

        const layerId = `anomaly-layer-${index}`;
        map.current.addLayer({
          'id': layerId,
          'type': 'circle',
          'source': sourceId,
          'paint': {
            'circle-radius': anomaly.affectedRadius / 25,
            'circle-color': color,
            'circle-opacity': 0.6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });

        map.current.on('click', layerId, (e) => {
          if(!e.features || e.features.length === 0 || !map.current) return;
          const coordinates = (e.features[0].geometry as any).coordinates.slice();
          const description = `
            <div class="p-2 bg-gray-800 text-white rounded-lg shadow-lg max-w-xs" style="font-family: sans-serif;">
              <h3 class="font-bold text-md capitalize">${anomaly.anomalyType} Anomaly</h3>
              <p><strong>Severity:</strong> <span style="color:${color}; text-transform: capitalize; font-weight: bold;">${anomaly.severity}</span></p>
              <p><strong>Risk Score:</strong> ${anomaly.riskScore.toFixed(0)}</p>
              <p><strong>Affected Radius:</strong> ${anomaly.affectedRadius}m</p>
            </div>
          `;
          
          new mapboxgl.Popup({ closeButton: false, className: 'mapbox-popup-custom' })
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);
        });

        map.current.on('mouseenter', layerId, () => {
          if(map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', layerId, () => {
          if(map.current) map.current.getCanvas().style.cursor = '';
        });
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]); // We only want to re-initialize the map if lat/lon changes. Anomalies are added dynamically.

  useEffect(() => {
    if (!map.current?.isStyleLoaded()) return;

    // This effect handles dynamic updates of anomalies without re-initializing the map
    // For now, we add them on load, but this structure allows for future real-time updates.

  }, [anomalies]);


  if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_PUBLIC_TOKEN') {
    return (
       <div className="h-96 w-full rounded-lg shadow-lg bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
          <p className="text-sm">Please add your Mapbox public access token in <br/><code className="bg-gray-700 p-1 rounded">src/components/InteractiveMap.tsx</code> to display the map.</p>
          <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline mt-2 inline-block">Get your free token</a>
        </div>
      </div>
    )
  }

  return <div ref={mapContainer} className="h-96 w-full rounded-lg shadow-lg bg-gray-800" />;
};

export default InteractiveMap;
