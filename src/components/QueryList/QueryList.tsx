import React, { useEffect } from 'react';
import { useQueryStore } from '../../store/queryStore';
import { CodeSnippet } from '../../types';
import { SearchBar } from './SearchBar';
import { QueryItem } from './QueryItem';

interface QueryListProps {
  onQuerySelect: (query: CodeSnippet) => void;
  selectedId: string | null;
  onQueryDelete?: (id: string) => void;
}

export function QueryList({ onQuerySelect, selectedId, onQueryDelete }: QueryListProps) {
  const { queries, searchTerm, setSearchTerm, isLoading, deleteQuery, loadQueries } = useQueryStore();

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  const filteredQueries = React.useMemo(() => {
    if (!queries || queries.length === 0) return [];
    
    const searchTerms = (searchTerm || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return queries;
    
    return queries.filter((query) => {
      if (!query) return false;
      
      return searchTerms.every(term => {
        const matchesTag = query.tags?.some(tag => 
          tag && tag.toLowerCase().includes(term)
        );

        const matchesTitle = query.title?.toLowerCase().includes(term);
        const matchesDescription = query.description?.toLowerCase().includes(term);
        const matchesLanguage = query.language?.toLowerCase().includes(term);

        return matchesTag || matchesTitle || matchesDescription || matchesLanguage;
      });
    });
  }, [queries, searchTerm]);

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
      <div className="flex-1 overflow-y-auto">
        {filteredQueries.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No matching snippets found' : 'No snippets yet'}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <QueryItem
              key={query.id}
              query={query}
              isSelected={query.id === selectedId}
              onSelect={() => onQuerySelect(query)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}