import { MapPin, Navigation } from 'lucide-react';
import type { POI, Location } from '../types';

interface MapViewProps {
  userLocation: Location;
  pois: POI[];
  radius: number;
}

export function MapView({ userLocation, pois, radius }: MapViewProps) {
  // Вычисляем границы карты
  const allLats = [userLocation.lat, ...pois.map(p => p.lat)];
  const allLons = [userLocation.lon, ...pois.map(p => p.lon)];
  
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLon = Math.min(...allLons);
  const maxLon = Math.max(...allLons);
  
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;
  
  // Простая проекция координат в пиксели (для визуализации)
  const mapWidth = 800;
  const mapHeight = 500;
  const padding = 80;
  
  const latRange = maxLat - minLat || 0.01;
  const lonRange = maxLon - minLon || 0.01;
  
  const projectPoint = (lat: number, lon: number) => {
    const x = ((lon - minLon) / lonRange) * (mapWidth - padding * 2) + padding;
    const y = ((maxLat - lat) / latRange) * (mapHeight - padding * 2) + padding;
    return { x, y };
  };

  const userPos = projectPoint(userLocation.lat, userLocation.lon);
  
  // Вычисляем радиус круга в пикселях
  const radiusInPixels = (radius / latRange) * (mapHeight - padding * 2) * 0.5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-gray-900">Карта: ваше местоположение и найденные POI</h2>
      </div>

      <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

          {/* Radius circle */}
          <circle
            cx={userPos.x}
            cy={userPos.y}
            r={radiusInPixels}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* User location */}
          <g>
            <circle cx={userPos.x} cy={userPos.y} r="12" fill="#3b82f6" />
            <circle cx={userPos.x} cy={userPos.y} r="8" fill="white" />
            <circle cx={userPos.x} cy={userPos.y} r="4" fill="#3b82f6" />
          </g>

          {/* POI markers */}
          {pois.map((poi, idx) => {
            const pos = projectPoint(poi.lat, poi.lon);
            return (
              <g key={poi.id}>
                {/* Marker pin */}
                <path
                  d={`M ${pos.x} ${pos.y - 24} 
                      C ${pos.x - 8} ${pos.y - 24} ${pos.x - 12} ${pos.y - 20} ${pos.x - 12} ${pos.y - 14}
                      C ${pos.x - 12} ${pos.y - 8} ${pos.x} ${pos.y} ${pos.x} ${pos.y}
                      C ${pos.x} ${pos.y} ${pos.x + 12} ${pos.y - 8} ${pos.x + 12} ${pos.y - 14}
                      C ${pos.x + 12} ${pos.y - 20} ${pos.x + 8} ${pos.y - 24} ${pos.x} ${pos.y - 24} Z`}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx={pos.x} cy={pos.y - 14} r="6" fill="white" />
                <text
                  x={pos.x}
                  y={pos.y - 11}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#ef4444"
                >
                  {idx + 1}
                </text>
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#374151"
                  fontWeight="500"
                >
                  {poi.name.length > 20 ? poi.name.substring(0, 20) + '...' : poi.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Ваше местоположение</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Найденные места</span>
          </div>
        </div>

        {/* Coordinates info */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-sm">
          <div className="text-gray-600 mb-1">Центр карты:</div>
          <div className="text-gray-900">{centerLat.toFixed(4)}, {centerLon.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
}
