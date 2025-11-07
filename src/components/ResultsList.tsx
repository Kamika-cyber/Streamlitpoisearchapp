import { MapPin, Clock, Star, Phone, Navigation2, Download } from 'lucide-react';
import { Button } from './ui/button';
import type { POI } from '../types';

interface ResultsListProps {
  pois: POI[];
}

export function ResultsList({ pois }: ResultsListProps) {
  if (pois.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 mb-2">Ничего не найдено</h3>
        <p className="text-gray-600">Попробуйте изменить параметры поиска или увеличить радиус</p>
      </div>
    );
  }

  const handleExport = () => {
    const csv = [
      ['Название', 'Категория', 'Адрес', 'Рейтинг', 'Расстояние (км)', 'Широта', 'Долгота'],
      ...pois.map(poi => [
        poi.name,
        poi.category,
        poi.address,
        poi.rating.toString(),
        poi.distance_km?.toFixed(2) || '',
        poi.lat.toString(),
        poi.lon.toString(),
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'search_results.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Результаты поиска ({pois.length})</h2>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Скачать CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pois.map((poi, idx) => (
          <div
            key={poi.id}
            className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{poi.name}</h3>
                  <div className="text-sm text-gray-600">{poi.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-amber-900">{poi.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{poi.address}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{poi.hours}</span>
              </div>
              {poi.phone && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{poi.phone}</span>
                </div>
              )}
              {poi.distance_km !== undefined && (
                <div className="flex items-start gap-2 text-sm">
                  <Navigation2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-600 font-medium">
                    ~{poi.distance_km.toFixed(2)} км от вас
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Почему рекомендуем:</span> подходит по категории ({poi.category}) и близости
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
