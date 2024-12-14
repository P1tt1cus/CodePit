import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
}

interface ChatActions {
  toggleChat: () => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  addMessage: (content, role) => set((state) => ({
    messages: [...state.messages, {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: Date.now(),
    }],
  })),

  clearMessages: () => set({ messages: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));