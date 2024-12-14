import React from 'react';
import { X } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  error?: string;
  onClose: () => void;
}

export function OutputPanel({ output, error, onClose }: OutputPanelProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Output
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 font-mono text-sm overflow-auto max-h-48">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : output ? (
          <pre>{output}</pre>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">No output</div>
        )}
      </div>
    </div>
  );
}