import React from 'react';
import { LanguageBadge } from '../QueryList/LanguageBadge';
import { CodeLanguage } from '../../types';
import { useQueryStore } from '../../store/queryStore';

interface LanguageStats {
  language: CodeLanguage;
  count: number;
  percentage: number;
  totalChars: number;
  avgChars: number;
}

export function LanguageStats() {
  const { queries } = useQueryStore();

  const stats = React.useMemo(() => {
    const totalSnippets = queries.length;
    const stats = new Map<CodeLanguage, LanguageStats>();

    // Calculate stats for each language
    queries.forEach(query => {
      const existing = stats.get(query.language);
      const codeLength = query.code.length;

      if (existing) {
        existing.count++;
        existing.totalChars += codeLength;
        existing.avgChars = Math.round(existing.totalChars / existing.count);
        existing.percentage = (existing.count / totalSnippets) * 100;
      } else {
        stats.set(query.language, {
          language: query.language,
          count: 1,
          percentage: (1 / totalSnippets) * 100,
          totalChars: codeLength,
          avgChars: codeLength
        });
      }
    });

    // Convert to array and sort by count
    return Array.from(stats.values())
      .sort((a, b) => b.count - a.count);
  }, [queries]);

  if (stats.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No snippets available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(({ language, count, percentage, avgChars }) => (
        <div
          key={language}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <LanguageBadge language={language} />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {percentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Snippets
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {count}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Avg. Length
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {avgChars.toLocaleString()} chars
              </span>
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 dark:bg-blue-600 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}