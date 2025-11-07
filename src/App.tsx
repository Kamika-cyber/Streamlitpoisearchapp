import { useState } from 'react';
import { SearchPanel } from './components/SearchPanel';
import { MapView } from './components/MapView';
import { ResultsList } from './components/ResultsList';
import { GeneratedAnswer } from './components/GeneratedAnswer';
import { poiData } from './data/poi-data';
import { searchPOI, generateAnswer } from './utils/rag-logic';
import type { POI, SearchParams } from './types';

export default function App() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    userLat: 51.1285,
    userLon: 71.4100,
    radius: 2.0,
    topK: 3,
    category: 'Все',
    mood: 'Любое',
  });

  const [results, setResults] = useState<POI[]>([]);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const foundPOIs = searchPOI(
      poiData,
      searchParams.userLat,
      searchParams.userLon,
      searchParams.query,
      searchParams.radius,
      searchParams.topK,
      searchParams.category,
      searchParams.mood
    );
    
    setResults(foundPOIs);
    setGeneratedText(generateAnswer(foundPOIs, searchParams.query));
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-gray-900">AstanaWalk RAG — Ассистент прогулок по Астане</h1>
              <p className="text-gray-600">Демо Retrieval + Generation: поиск по POI + генерация рекомендаций</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel - Left Sidebar */}
          <div className="lg:col-span-1">
            <SearchPanel
              params={searchParams}
              onParamsChange={setSearchParams}
              onSearch={handleSearch}
              totalPOIs={poiData.length}
            />
          </div>

          {/* Results - Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {!hasSearched ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-gray-900 mb-2">Начните поиск</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Заполните параметры в левой панели и нажмите «Найти рядом» для демонстрации RAG-системы
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 mb-1">Mega Silk Way</div>
                    <div className="text-gray-500">51.1325, 71.4030</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 mb-1">EXPO</div>
                    <div className="text-gray-500">51.0909, 71.4180</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 mb-1">Байтерек</div>
                    <div className="text-gray-500">51.1280, 71.4300</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Map */}
                <MapView
                  userLocation={{ lat: searchParams.userLat, lon: searchParams.userLon }}
                  pois={results}
                  radius={searchParams.radius}
                />

                {/* Generated Answer */}
                <GeneratedAnswer text={generatedText} query={searchParams.query} />

                {/* Results List */}
                <ResultsList pois={results} />
              </>
            )}
          </div>
        </div>

        {/* Footer Hints */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-3">Подсказки для демонстрации</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Используйте примерные координаты: Mega Silk Way ≈ (51.1325, 71.4030), EXPO ≈ (51.0909, 71.4180), Байтерек ≈ (51.1280, 71.4300)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Для роута/микро-маршрута: увеличьте радиус до 3–4 км и выберите несколько мест</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>На защите покажите: (1) поиск → (2) генерация ответов → (3) карту и карточки мест</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
