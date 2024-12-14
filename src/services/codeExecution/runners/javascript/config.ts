/**
 * Configuration for JavaScript code execution
 */
export const JS_TIMEOUT = 10000; // 10 seconds execution timeout

export const SANDBOX_GLOBALS = {
  // Add any allowed global objects here
  console: true,
  setTimeout: true,
  clearTimeout: true,
  Promise: true
};