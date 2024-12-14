import { create } from 'zustand';
import { CodeSnippet } from '../types';
import { saveQuery, deleteQuery, loadAllQueries } from './storage';

interface QueryState {
  queries: CodeSnippet[];
  searchTerm: string;
  isLoading: boolean;
}

interface QueryActions {
  setSearchTerm: (term: string) => void;
  addQuery: (query: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuery: (id: string, query: Partial<CodeSnippet>) => Promise<void>;
  deleteQuery: (id: string) => Promise<void>;
  loadQueries: () => Promise<void>;
  findDuplicateTitle: (title: string, excludeId?: string) => boolean;
}

const initialState: QueryState = {
  queries: [],
  searchTerm: '',
  isLoading: true,
};

export const useQueryStore = create<QueryState & QueryActions>((set, get) => ({
  ...initialState,

  setSearchTerm: (term) => set({ searchTerm: term || '' }),

  findDuplicateTitle: (title: string, excludeId?: string) => {
    const { queries } = get();
    if (!title) return false;
    
    return queries.some(query => 
      query && query.title && 
      query.title.toLowerCase() === title.toLowerCase() && 
      query.id !== excludeId
    );
  },

  addQuery: async (queryData) => {
    const { queries, findDuplicateTitle } = get();
    
    if (!queryData.title) {
      throw new Error('Title is required');
    }

    if (findDuplicateTitle(queryData.title)) {
      throw new Error('A snippet with this title already exists');
    }

    try {
      const id = crypto.randomUUID();
      const timestamp = Date.now();
      const newQuery: CodeSnippet = {
        ...queryData,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await saveQuery(id, newQuery);
      set({ queries: [...queries, newQuery] });
    } catch (error) {
      console.error('Failed to add query:', error);
      throw error;
    }
  },

  updateQuery: async (id, queryData) => {
    const { queries, findDuplicateTitle } = get();
    const query = queries.find((q) => q.id === id);
    if (!query) throw new Error('Query not found');

    if (queryData.title && findDuplicateTitle(queryData.title, id)) {
      throw new Error('A snippet with this title already exists');
    }

    try {
      const updatedQuery = {
        ...query,
        ...queryData,
        updatedAt: Date.now(),
      };

      await saveQuery(id, updatedQuery);
      set({
        queries: queries.map((q) => (q.id === id ? updatedQuery : q)),
      });
    } catch (error) {
      console.error('Failed to update query:', error);
      throw error;
    }
  },

  deleteQuery: async (id) => {
    try {
      await deleteQuery(id);
      set((state) => ({
        queries: state.queries.filter((q) => q.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete query:', error);
      throw error;
    }
  },

  loadQueries: async () => {
    try {
      set({ isLoading: true });
      const queries = await loadAllQueries();
      set({ queries, isLoading: false });
    } catch (error) {
      console.error('Failed to load queries:', error);
      set({ queries: [], isLoading: false });
    }
  },
}));

// Initialize queries on store creation
useQueryStore.getState().loadQueries();