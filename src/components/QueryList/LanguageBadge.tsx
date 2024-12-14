import React from 'react';
import { CodeLanguage } from '../../types';

interface LanguageBadgeProps {
  language: CodeLanguage;
}

const LANGUAGE_COLORS: Record<CodeLanguage, { bg: string; text: string }> = {
  kql: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-200' },
  sql: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  python: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
  javascript: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
  typescript: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  rust: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-200' },
  cpp: { bg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-800 dark:text-pink-200' },
  c: { bg: 'bg-gray-100 dark:bg-gray-900/50', text: 'text-gray-800 dark:text-gray-200' },
  java: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  go: { bg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-800 dark:text-cyan-200' },
  ruby: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  php: { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-800 dark:text-indigo-200' },
  csharp: { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-800 dark:text-violet-200' },
  html: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-200' },
  css: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  yaml: { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-200' },
  json: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-200' },
  xml: { bg: 'bg-lime-100 dark:bg-lime-900/50', text: 'text-lime-800 dark:text-lime-200' },
  markdown: { bg: 'bg-gray-100 dark:bg-gray-900/50', text: 'text-gray-800 dark:text-gray-200' },
  shell: { bg: 'bg-gray-100 dark:bg-gray-900/50', text: 'text-gray-800 dark:text-gray-200' },
};

export function LanguageBadge({ language }: LanguageBadgeProps) {
  // Ensure language is a valid CodeLanguage
  if (!LANGUAGE_COLORS[language]) {
    return null;
  }

  const colors = LANGUAGE_COLORS[language];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
      {language.toUpperCase()}
    </span>
  );
}