import React from 'react';
import { CodeSnippet } from '../../types';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '../../utils/date';
import { LanguageBadge } from '../QueryList/LanguageBadge';

interface SnippetPreviewProps {
  snippet: CodeSnippet;
}

export function SnippetPreview({ snippet }: SnippetPreviewProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {snippet.title}
        </h2>
        <LanguageBadge language={snippet.language} />
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {snippet.description}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
          <pre className="language-{snippet.language}">
            <code>{snippet.code}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Created: {formatDate(snippet.createdAt)}</p>
          <p>Last updated: {formatDate(snippet.updatedAt)}</p>
        </div>

        {snippet.markdown && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Documentation
            </h3>
            <ReactMarkdown className="prose dark:prose-invert max-w-none">
              {snippet.markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}