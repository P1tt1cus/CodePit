import React from 'react';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { CodeSnippet } from '../../types';
import { QueryTags } from './QueryTags';
import { LanguageBadge } from './LanguageBadge';

interface QueryItemProps {
  query: CodeSnippet;
  isSelected: boolean;
  onSelect: (query: CodeSnippet) => void;
  onDelete: (id: string) => Promise<void>;
}

export function QueryItem({ query, isSelected, onSelect, onDelete }: QueryItemProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await onDelete(query.id);
      } catch (error) {
        console.error('Failed to delete query:', error);
        alert('Failed to delete query. Please try again.');
      }
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative group ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/50' : ''
      }`}
      onClick={() => onSelect(query)}
    >
      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" />
      </button>
      <div className="flex items-start justify-between pr-8">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{query.title}</h3>
        <LanguageBadge language={query.language} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{query.description}</p>
      <QueryTags tags={query.tags} />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Updated {format(query.updatedAt, 'PPP p')}
      </p>
    </div>
  );
}