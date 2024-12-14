import React from 'react';
import { Save, MessageSquare } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { CodeLanguage } from '../../types';

interface EditorHeaderProps {
  onSave: () => void;
  isEditing: boolean;
  language: CodeLanguage;
  rightContent?: React.ReactNode;
}

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  kql: 'KQL',
  sql: 'SQL',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  rust: 'Rust',
  cpp: 'C++',
  c: 'C',
  java: 'Java',
  go: 'Go',
  ruby: 'Ruby',
  php: 'PHP',
  csharp: 'C#',
  html: 'HTML',
  css: 'CSS',
  yaml: 'YAML',
  json: 'JSON',
  xml: 'XML',
  markdown: 'Markdown',
  shell: 'Shell Script',
};

export function EditorHeader({ onSave, isEditing, language, rightContent }: EditorHeaderProps) {
  const toggleChat = useChatStore((state) => state.toggleChat);

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {LANGUAGE_LABELS[language]} Editor
      </h3>
      <div className="flex gap-2">
        <button
          onClick={toggleChat}
          className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <MessageSquare size={16} />
          AI Assistant
        </button>
        {rightContent}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Save size={16} />
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
}