/**
 * Configuration for code execution environment
 */

// Default timeout for code execution (in milliseconds)
export const EXECUTION_TIMEOUT = 10000; // 10 seconds

// Memory limits for code execution (in bytes)
export const MEMORY_LIMITS = {
  javascript: 128 * 1024 * 1024, // 128MB
  typescript: 128 * 1024 * 1024, // 128MB
};

// Console output limits
export const OUTPUT_LIMITS = {
  maxLength: 10000, // Maximum characters in output
  maxLines: 1000,   // Maximum number of lines
};

// Security settings
export const SECURITY_CONFIG = {
  allowedGlobals: [
    'console',
    'setTimeout',
    'clearTimeout',
    'Promise',
    'Array',
    'Object',
    'String',
    'Number',
    'Math'
  ],
  blockedKeywords: [
    'require',
    'import',
    'export',
    'eval',
    'Function',
    'process'
  ]
};