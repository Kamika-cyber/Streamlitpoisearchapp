import { Sparkles, Brain } from 'lucide-react';

interface GeneratedAnswerProps {
  text: string;
  query: string;
}

export function GeneratedAnswer({ text, query }: GeneratedAnswerProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-200 p-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-gray-900">Сгенерированный ответ (RAG)</h2>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="bg-white rounded-lg p-5 border border-indigo-100 shadow-sm">
            <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-sans">
              {text}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg border border-indigo-100">
            <div className="text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="font-medium">Архитектура RAG:</span>
              </div>
              <div className="ml-4 text-gray-600">
                User Query → <span className="text-indigo-600 font-medium">Retrieval</span> (поиск по POI + распознавание района/активности) 
                → <span className="text-purple-600 font-medium">Generation</span> (генерация рекомендаций с планом) 
                → Структурированный ответ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}