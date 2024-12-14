import React from 'react';
import { Loader2, X } from 'lucide-react';
import { CopilotService } from '../../services/copilot/CopilotService';
import { CodeLanguage } from '../../types';
import { Button } from '../common/Button';

interface CopilotPanelProps {
  code: string;
  language: CodeLanguage;
  onClose: () => void;
}

export function CopilotPanel({ code, language, onClose }: CopilotPanelProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [explanation, setExplanation] = React.useState<string>('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const copilot = CopilotService.getInstance();
      const response = await copilot.getSuggestions(code, language);
      setSuggestions(response.suggestions);
      setExplanation(response.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-blue-500 dark:bg-blue-600 text-white">
        <h3 className="font-medium">Code Analysis</h3>
        <button onClick={onClose} className="hover:bg-blue-600 dark:hover:bg-blue-700 p-1 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full"
          icon={isLoading ? <Loader2 className="animate-spin" /> : undefined}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Code'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error ? (
          <div className="text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {explanation && (
              <div className="prose dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    >
                      <span className="text-blue-500 dark:text-blue-400">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}