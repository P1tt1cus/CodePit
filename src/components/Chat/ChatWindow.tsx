import React, { useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { optimizeCode } from '../../services/aiService';
import { CodeLanguage } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ChatWindowProps {
  currentQuery: string;
  language: CodeLanguage;
}

export function ChatWindow({ currentQuery, language }: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    isOpen, 
    messages, 
    isLoading,
    toggleChat, 
    addMessage, 
    setLoading 
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, 'user');
    setLoading(true);

    try {
      const response = await optimizeCode({
        code: currentQuery,
        language,
        prompt: userMessage,
      });

      const aiResponse = `Here's my analysis of your ${language.toUpperCase()} code:

${response.comments}

Optimized Code:
\`\`\`${language}
${response.optimizedCode}
\`\`\`

Suggestions:
${response.suggestions.map(s => `- ${s}`).join('\n')}`;

      addMessage(aiResponse, 'assistant');
    } catch (error) {
      addMessage('Sorry, I encountered an error while processing your request.', 'assistant');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-blue-600 dark:border-blue-400 flex justify-between items-center bg-blue-500 dark:bg-blue-600 text-white">
        <h3 className="font-medium">AI Assistant</h3>
        <button onClick={toggleChat} className="hover:bg-blue-600 dark:hover:bg-blue-700 p-1 rounded transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about your ${language} code...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            icon={<Send className="h-5 w-5" />}
          />
        </div>
      </form>
    </div>
  );
}