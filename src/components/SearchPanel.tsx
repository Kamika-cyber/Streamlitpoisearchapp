import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { getDistrictCoordinates } from '../utils/rag-logic';
import type { SearchParams } from '../types';

interface SearchPanelProps {
  params: SearchParams;
  onParamsChange: (params: SearchParams) => void;
  onSearch: () => void;
  totalPOIs: number;
}

const categories = [
  'Все',
  'Кафе',
  'Рестораны',
  'Фастфуд',
  'Пиццерии',
  'Парки',
  'Фитнес-центры',
  'Школы танцев',
  'Аптеки',
  'Клиники',
  'Медцентры',
  'Бутики',
  'Магазины одежды',
  'Обувные магазины',
];

const moods = [
  'Любое',
  'Спокойно',
  'Активно',
  'С детьми',
  'Романтично',
  'Ночное',
];

const districts = [
  { name: 'Есиль', query: 'Я в районе Есиль' },
  { name: 'Сарыарка', query: 'Я в районе Сарыарка' },
  { name: 'Центр', query: 'Я в центре города' },
];

export function SearchPanel({ params, onParamsChange, onSearch, totalPOIs }: SearchPanelProps) {
  const updateParam = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    onParamsChange({ ...params, [key]: value });
  };

  const handleDistrictClick = (districtQuery: string) => {
    updateParam('query', districtQuery);
    const coords = getDistrictCoordinates(districtQuery);
    if (coords) {
      onParamsChange({
        ...params,
        query: districtQuery,
        userLat: coords.lat,
        userLon: coords.lon,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-gray-900 mb-6">Параметры поиска</h2>

      <div className="space-y-5">
        {/* Quick District Buttons */}
        <div>
          <Label>Быстрый выбор района</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {districts.map((district) => (
              <Button
                key={district.name}
                variant="outline"
                size="sm"
                onClick={() => handleDistrictClick(district.query)}
                className="text-xs"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {district.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Query */}
        <div>
          <Label htmlFor="query">Ваш запрос</Label>
          <Input
            id="query"
            placeholder="напр.: хочу в супермаркет"
            value={params.query}
            onChange={e => updateParam('query', e.target.value)}
            className="mt-1.5"
          />
          <p className="text-xs text-gray-500 mt-1">
            Примеры: "хочу в супермаркет", "прогуляться в парке"
          </p>
        </div>

        {/* User Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lat">Широта</Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={params.userLat}
              onChange={e => updateParam('userLat', parseFloat(e.target.value) || 51.1285)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="lon">Долгота</Label>
            <Input
              id="lon"
              type="number"
              step="0.0001"
              value={params.userLon}
              onChange={e => updateParam('userLon', parseFloat(e.target.value) || 71.4100)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Radius */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Радиус поиска</Label>
            <span className="text-gray-900">{params.radius.toFixed(1)} км</span>
          </div>
          <Slider
            value={[params.radius]}
            onValueChange={([value]) => updateParam('radius', value)}
            min={0.2}
            max={10}
            step={0.2}
            className="mt-1.5"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select value={params.category} onValueChange={value => updateParam('category', value)}>
            <SelectTrigger id="category" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mood */}
        <div>
          <Label htmlFor="mood">Настроение/режим</Label>
          <Select value={params.mood} onValueChange={value => updateParam('mood', value)}>
            <SelectTrigger id="mood" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {moods.map(mood => (
                <SelectItem key={mood} value={mood}>
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Top K */}
        <div>
          <Label htmlFor="topK">Количество вариантов</Label>
          <Input
            id="topK"
            type="number"
            min="1"
            max="10"
            value={params.topK}
            onChange={e => updateParam('topK', parseInt(e.target.value) || 3)}
            className="mt-1.5"
          />
        </div>

        {/* Search Button */}
        <Button onClick={onSearch} className="w-full">
          <Search className="w-4 h-4 mr-2" />
          Найти рядом
        </Button>

        {/* Dataset Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-gray-600">Всего POI в базе: {totalPOIs}</div>
        </div>
      </div>
    </div>
  );
}