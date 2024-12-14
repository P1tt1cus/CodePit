import React, { useState, useEffect, useCallback } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import { Save } from 'lucide-react';

// Configure Monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

interface QueryEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isEditing: boolean;
}

export function QueryEditor({ initialValue, onChange, onSave, isEditing }: QueryEditorProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      setValue(newValue);
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <h3 className="text-sm font-medium text-gray-700">KQL Editor</h3>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Save size={16} />
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
      <div className="flex-1 min-h-[500px]">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            rulers: [80],
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 10, bottom: 10 },
            folding: true,
            lineDecorationsWidth: 10,
            glyphMargin: false,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="animate-pulse text-gray-500">Loading editor...</div>
            </div>
          }
        />
      </div>
    </div>
  );
}