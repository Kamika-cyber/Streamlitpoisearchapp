import type { POI } from '../types';
import { districtCoordinates } from '../data/poi-data';

// Формула Haversine для расчета расстояния между двумя точками на Земле
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0; // Радиус Земли в км
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Распознавание района из запроса
export function recognizeDistrict(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  for (const [district, coords] of Object.entries(districtCoordinates)) {
    if (lowerQuery.includes(district)) {
      return district;
    }
  }
  
  return null;
}

// Распознавание активности из запроса
export function recognizeActivity(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  const activities: Record<string, string[]> = {
    'кафе': ['кафе', 'кофе', 'перекусить', 'попить кофе', 'выпить кофе'],
    'ресторан': ['ресторан', 'поесть', 'пообедать', 'поужинать', 'покушать'],
    'фастфуд': ['фастфуд', 'fast food', 'бургер', 'быстро поесть', 'mcdonalds', 'kfc'],
    'пиццерия': ['пицца', 'пиццерия', 'pizza'],
    'парк': ['парк', 'прогулк', 'прогуляться', 'отдохнуть на природе', 'погулять'],
    'фитнес': ['спорт', 'тренировка', 'фитнес', 'качалка', 'спортзал', 'тренажерный зал'],
    'танцы': ['танц', 'танцевал', 'хореограф'],
    'аптека': ['аптека', 'лекарство', 'медикамент', 'таблетки'],
    'клиника': ['клиника', 'врач', 'доктор', 'лечение', 'болен', 'поликлиника'],
    'медцентр': ['медцентр', 'медицинский центр', 'диагностика', 'обследование'],
    'бутик': ['бутик', 'дизайнер', 'модная одежда'],
    'магазин одежды': ['одежда', 'одежды', 'купить одежду', 'магазин одежды', 'футболк', 'платье'],
    'обувь': ['обувь', 'туфли', 'кроссовки', 'ботинки', 'купить обувь'],
  };
  
  for (const [activity, keywords] of Object.entries(activities)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      return activity;
    }
  }
  
  return null;
}

// Retrieval: поиск POI по критериям
export function searchPOI(
  data: POI[],
  userLat: number,
  userLon: number,
  query: string = '',
  maxDistanceKm: number = 2.0,
  topK: number = 5,
  categoryFilter: string | null = null,
  mood: string | null = null
): POI[] {
  const q = query.toLowerCase().trim();
  
  // Распознаем район из запроса
  const district = recognizeDistrict(q);
  
  // Распознаем активность
  const activity = recognizeActivity(q);
  
  // Текстовый поиск
  let candidates = data.filter(poi => {
    if (!q) return true;
    
    const matchesText = 
      poi.name.toLowerCase().includes(q) ||
      poi.category.toLowerCase().includes(q) ||
      poi.subcategory.toLowerCase().includes(q) ||
      poi.address.toLowerCase().includes(q);
    
    // Если распознан район, фильтруем по адресу
    const matchesDistrict = district ? poi.address.toLowerCase().includes(district) : true;
    
    // Если распознана активность, фильтруем по категории
    const matchesActivity = activity ? 
      poi.category.toLowerCase().includes(activity) || 
      poi.subcategory.toLowerCase().includes(activity) : 
      true;
    
    return matchesText || matchesDistrict || matchesActivity;
  });

  // Вычисляем расстояние
  candidates = candidates.map(poi => ({
    ...poi,
    distance_km: haversine(userLat, userLon, poi.lat, poi.lon),
  }));

  // Фильтр по категории
  if (categoryFilter && categoryFilter !== 'Все') {
    candidates = candidates.filter(
      poi =>
        poi.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        poi.subcategory.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }

  // Фильтр по настроению
  if (mood && mood !== 'Любое') {
    const moodMap: Record<string, string[]> = {
      'Спокойно': ['тих', 'уют', 'кафе', 'кофе', 'библиотек'],
      'Активно': ['спорт', 'парк', 'велосипед', 'велопрокат', 'бег', 'йога'],
      'С детьми': ['детск', 'семей', 'океанариум', 'музей', 'развлечен'],
      'Романтично': ['вид', 'террас', 'ресторан', 'panorama', 'sky'],
      'Ночное': ['ноч', 'бар', 'музык', 'клуб'],
    };

    const keywords = moodMap[mood] || [];
    if (keywords.length > 0) {
      const moodMatches = candidates.filter(poi =>
        keywords.some(
          kw =>
            poi.name.toLowerCase().includes(kw) ||
            poi.category.toLowerCase().includes(kw) ||
            poi.subcategory.toLowerCase().includes(kw) ||
            poi.address.toLowerCase().includes(kw)
        )
      );
      if (moodMatches.length > 0) {
        candidates = moodMatches;
      }
    }
  }

  // Фильтр по расстоянию
  candidates = candidates.filter(poi => (poi.distance_km || 0) <= maxDistanceKm);

  // Сортировка по расстоянию и рейтингу
  candidates.sort((a, b) => {
    const distDiff = (a.distance_km || 0) - (b.distance_km || 0);
    if (Math.abs(distDiff) > 0.1) return distDiff;
    return b.rating - a.rating;
  });

  return candidates.slice(0, topK);
}

// Генерация плана посещения на основе категории
function generateVisitPlan(poi: POI): string {
  const category = poi.category.toLowerCase();
  const subcategory = poi.subcategory.toLowerCase();
  
  if (category.includes('кафе')) {
    return 'Зайдите на 30–40 минут, выпейте кофе и насладитесь атмосферой.';
  }
  
  if (category.includes('ресторан')) {
    return 'Запланируйте 1–1.5 часа на обед или ужин, насладитесь кухней и атмосферой.';
  }
  
  if (category.includes('фастфуд')) {
    return 'Быстрое посещение на 15–20 минут для перекуса.';
  }
  
  if (category.includes('пиццер')) {
    return 'Зайдите на 40–60 минут, закажите пиццу и насладитесь вкусом.';
  }
  
  if (category.includes('парк')) {
    if (subcategory.includes('детск')) {
      return 'Прогулка на 30–45 минут, потом можно посетить маленькое кафе в парке или отдохнуть на детской площадке.';
    }
    return 'Прогулка на 40–60 минут, затем можно отдохнуть на лавочках или в близлежащем кафе.';
  }
  
  if (category.includes('фитнес')) {
    return 'Посвятите 1–2 часа активному отдыху и тренировке.';
  }
  
  if (category.includes('танц')) {
    return 'Посетите занятие на 1–1.5 часа, улучшите свои танцевальные навыки.';
  }
  
  if (category.includes('аптек')) {
    return 'Зайдите на 5–10 минут, купите необходимые лекарства.';
  }
  
  if (category.includes('клиник') || category.includes('медцентр')) {
    return 'Запишитесь на прием, визит займет от 30 минут до 1 часа в зависимости от процедур.';
  }
  
  if (category.includes('бутик') || category.includes('одежд') || category.includes('обувн')) {
    return 'Уделите 30–60 минут на выбор и примерку, подберите то, что вам нужно.';
  }
  
  return 'Посетите это место и насладитесь атмосферой.';
}

// Генерация объяснения, почему место подходит
function generateReason(poi: POI, query: string): string {
  const category = poi.category.toLowerCase();
  const distance = poi.distance_km ? poi.distance_km.toFixed(1) : '—';
  
  const reasons: string[] = [];
  
  if (category.includes('кафе')) {
    reasons.push('уютное место с приятной атмосферой для отдыха и кофе');
  } else if (category.includes('ресторан')) {
    reasons.push('отличное место для обеда или ужина с хорошей кухней');
  } else if (category.includes('фастфуд')) {
    reasons.push('быстрое и удобное место для перекуса');
  } else if (category.includes('пиццер')) {
    reasons.push('вкусная пицца и приятная атмосфера');
  } else if (category.includes('парк')) {
    reasons.push('красивое зеленое место, идеально подходит для прогулок и отдыха на природе');
  } else if (category.includes('фитнес')) {
    reasons.push('современный фитнес-центр с хорошим оборудованием');
  } else if (category.includes('танц')) {
    reasons.push('профессиональная школа танцев с опытными преподавателями');
  } else if (category.includes('аптек')) {
    reasons.push('удобное место для покупки лекарств и медикаментов');
  } else if (category.includes('клиник')) {
    reasons.push('качественная медицинская помощь от профессионалов');
  } else if (category.includes('медцентр')) {
    reasons.push('современный медицинский центр с полным комплексом услуг');
  } else if (category.includes('бутик')) {
    reasons.push('эксклюзивная дизайнерская одежда высокого качества');
  } else if (category.includes('одежд')) {
    reasons.push('большой выбор модной одежды на любой вкус');
  } else if (category.includes('обувн')) {
    reasons.push('качественная обувь с широким ассортиментом');
  } else {
    reasons.push(`подходит по категории (${poi.category})`);
  }
  
  if (parseFloat(distance) < 0.5) {
    reasons.push('находится очень близко');
  } else if (parseFloat(distance) < 1) {
    reasons.push('находится в шаговой доступности');
  }
  
  return reasons.join(', ') + '.';
}

// Generation: генерация текстового ответа на основе найденных POI
export function generateAnswer(pois: POI[], userQuery: string): string {
  const district = recognizeDistrict(userQuery);
  const activity = recognizeActivity(userQuery);
  
  if (pois.length === 0) {
    return `Запрос: ${userQuery}
Распознанное местоположение: ${district || 'не определено'}
Распознанное время: None
Распознанная активность: ${activity || 'не определено'}

Не удалось найти подходящих мест по запросу.`;
  }

  const pieces: string[] = [];
  
  pieces.push(`Запрос: ${userQuery}`);
  pieces.push(`Распознанное местоположение: ${district || 'не определено'}`);
  pieces.push(`Распознанное время: None`);
  pieces.push(`Распознанная активность: ${activity || 'не определено'}`);
  pieces.push('');
  pieces.push('Рекомендации:');
  pieces.push('');

  pois.forEach((poi, index) => {
    const name = poi.name;
    const dist = poi.distance_km ? poi.distance_km.toFixed(1) : '—';
    const rating = poi.rating.toFixed(1);
    const reason = generateReason(poi, userQuery);
    const plan = generateVisitPlan(poi);

    const card = `${index + 1}. ${poi.category} '${name}' — ${dist} км. Рейтинг: ${rating}. Почему: ${reason} План: ${plan}`;
    pieces.push(card);
    pieces.push('');
  });

  pieces.push('Источник: данные POI');

  return pieces.join('\n');
}

// Получить все уникальные категории
export function getAllCategories(data: POI[]): string[] {
  const categories = new Set<string>();
  data.forEach(poi => {
    if (poi.category) categories.add(poi.category);
  });
  return Array.from(categories).sort();
}

// Определить координаты по названию района
export function getDistrictCoordinates(query: string): { lat: number; lon: number } | null {
  const district = recognizeDistrict(query);
  if (district && districtCoordinates[district]) {
    return districtCoordinates[district];
  }
  return null;
}