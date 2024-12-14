import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryStore } from '../store/queryStore';
import { CodeLanguage, CodeSnippet } from '../types';
import { SearchBar } from '../components/QueryList/SearchBar';
import { QueryItem } from '../components/QueryList/QueryItem';
import { VSCodePreview } from '../components/Preview/VSCodePreview';

export function SnippetsPage() {
  const navigate = useNavigate();
  const { queries, searchTerm, setSearchTerm, deleteQuery } = useQueryStore();
  const [selectedSnippet, setSelectedSnippet] = React.useState<CodeSnippet | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<CodeLanguage | 'all'>('all');

  const languages = React.useMemo(() => {
    const uniqueLanguages = new Set(queries.map(q => q.language));
    return Array.from(uniqueLanguages).sort();
  }, [queries]);

  const filteredQueries = React.useMemo(() => {
    let filtered = queries;

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(q => q.language === selectedLanguage);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(query =>
        query.title.toLowerCase().includes(search) ||
        query.description.toLowerCase().includes(search) ||
        query.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [queries, selectedLanguage, searchTerm]);

  const handleSelect = (query: CodeSnippet) => {
    setSelectedSnippet(query);
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col h-full">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
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
                  isSelected={selectedSnippet?.id === query.id}
                  onSelect={() => handleSelect(query)}
                  onDelete={deleteQuery}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        {selectedSnippet ? (
          <VSCodePreview snippet={selectedSnippet} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg p-6">
            <p className="text-gray-500 dark:text-gray-400">
              Select a snippet to preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
}