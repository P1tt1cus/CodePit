import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useQueryStore } from '../store/queryStore';
import { format } from 'date-fns';
import { KQLQuery } from '../types';

interface QueryListProps {
  onQuerySelect: (query: KQLQuery) => void;
  selectedId: string | null;
}

export function QueryList({ onQuerySelect, selectedId }: QueryListProps) {
  const { queries, searchTerm, setSearchTerm, isLoading, deleteQuery } = useQueryStore(state => ({
    queries: state.queries,
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    isLoading: state.isLoading,
    deleteQuery: state.deleteQuery,
  }));

  const filteredQueries = React.useMemo(() => {
    if (!queries) return [];
    const search = (searchTerm || '').toLowerCase();
    return queries.filter((query) =>
      query.title.toLowerCase().includes(search) ||
      query.description.toLowerCase().includes(search) ||
      query.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }, [queries, searchTerm]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await deleteQuery(id);
      } catch (error) {
        console.error('Failed to delete query:', error);
        alert('Failed to delete query. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading queries...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search queries..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredQueries.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No queries found
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div
              key={query.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer relative group ${
                selectedId === query.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onQuerySelect(query)}
            >
              <button
                onClick={(e) => handleDelete(e, query.id)}
                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
              </button>
              <h3 className="font-medium pr-8">{query.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{query.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {query.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Updated {format(query.updatedAt, 'PPP')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}