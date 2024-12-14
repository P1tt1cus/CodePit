import { loader } from '@monaco-editor/react';

// Configure Monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

export const editorOptions = {
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
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: true,
  autoIndent: 'full',
  snippetSuggestions: 'inline',
} as const;