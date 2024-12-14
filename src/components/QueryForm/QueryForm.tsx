import React from 'react';
import { TagInput } from './TagInput';
import { CodeLanguage } from '../../types';

interface QueryFormProps {
  title: string;
  description: string;
  tags: string[];
  language: CodeLanguage;
  error?: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onLanguageChange: (language: CodeLanguage) => void;
}

const LANGUAGE_OPTIONS: { value: CodeLanguage; label: string }[] = [
  { value: 'kql', label: 'KQL (Kusto Query Language)' },
  { value: 'sql', label: 'SQL' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'yaml', label: 'YAML' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'shell', label: 'Shell Script' },
];

export function QueryForm({
  title,
  description,
  tags,
  language,
  error,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  onLanguageChange,
}: QueryFormProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          placeholder="Snippet title"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as CodeLanguage)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="md:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Snippet description"
        />
      </div>

      <div className="md:col-span-2">
        <TagInput tags={tags} onTagsChange={onTagsChange} />
      </div>
    </div>
  );
}