import React from 'react';
import { useQueryStore } from '../../store/queryStore';
import { CodeLanguage } from '../../types';
import { SearchBar } from './SearchBar';
import { QueryItem } from './QueryItem';
import { SortFilter } from './SortFilter';

interface SnippetsViewProps {
  onQuerySelect: (id: string) => void;
  selectedId: string | null;
  onQueryDelete?: (id: string) => void;
}

export function SnippetsView({ onQuerySelect, selectedId, onQueryDelete }: SnippetsViewProps) {
  const { queries, searchTerm, setSearchTerm, isLoading, deleteQuery } = useQueryStore();
  const [selectedLanguage, setSelectedLanguage] = React.useState<CodeLanguage | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'title'>('newest');

  const languageGroups = React.useMemo(() => {
    if (!queries || queries.length === 0) return new Map();

    const groups = new Map<CodeLanguage | 'all', typeof queries>();
    groups.set('all', queries);

    queries.forEach(query => {
      const langQueries = groups.get(query.language) || [];
      groups.set(query.language, [...langQueries, query]);
    });

    return groups;
  }, [queries]);

  const filteredAndSortedQueries = React.useMemo(() => {
    const queriesForLanguage = languageGroups.get(selectedLanguage) || [];
    let filtered = queriesForLanguage;

    if (searchTerm) {
      const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
      filtered = queriesForLanguage.filter(query => 
        searchTerms.every(term => {
          const matchesTag = query.tags?.some(tag => tag.toLowerCase().includes(term));
          const matchesTitle = query.title.toLowerCase().includes(term);
          const matchesDescription = query.description.toLowerCase().includes(term);
          const matchesLanguage = query.language.toLowerCase().includes(term);
          return matchesTag || matchesTitle || matchesDescription || matchesLanguage;
        })
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.updatedAt - a.updatedAt;
        case 'oldest':
          return a.updatedAt - b.updatedAt;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [languageGroups, selectedLanguage, searchTerm, sortBy]);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuery(id);
      if (onQueryDelete) {
        onQueryDelete(id);
      }
    } catch (error) {
      console.error('Failed to delete query:', error);
      alert('Failed to delete query. Please try again.');
    }
  };

  const languages = Array.from(languageGroups.keys())
    .filter(lang => lang !== 'all')
    .sort();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Loading snippets...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <div className="grid grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as CodeLanguage | 'all')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                     shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <SortFilter sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedQueries.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No matching snippets found' : 'No snippets yet'}
          </div>
        ) : (
          filteredAndSortedQueries.map((query) => (
            <QueryItem
              key={query.id}
              query={query}
              isSelected={query.id === selectedId}
              onSelect={() => onQuerySelect(query.id)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}