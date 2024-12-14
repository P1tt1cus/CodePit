// Application-wide constants
export const APP_NAME = 'CodePit';
export const APP_VERSION = '1.0.0';
export const STORAGE_PREFIX = 'codepit:snippet:';

// Editor configuration
export const EDITOR_CONFIG = {
  fontSize: 14,
  tabSize: 2,
  insertSpaces: true,
  minimap: { enabled: false },
  lineNumbers: 'on',
  rulers: [80],
  wordWrap: 'on',
  padding: { top: 10, bottom: 10 },
  folding: true,
};

// Code execution configuration
export const CODE_EXECUTION = {
  timeout: 10000, // 10 seconds
  memoryLimit: 128 * 1024 * 1024, // 128MB
};

// Pyodide configuration
export const PYODIDE_CONFIG = {
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
  fullStdLib: true,
};