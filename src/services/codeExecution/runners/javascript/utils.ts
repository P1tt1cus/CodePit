/**
 * Utility functions for JavaScript code execution
 */

/**
 * Creates a sandboxed environment for code execution
 * @param code - JavaScript code to execute
 * @returns Sandboxed function
 */
export function createSandbox(code: string): Function {
  // Remove access to global objects
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  return new AsyncFunction(code);
}

/**
 * Sets up console output capture
 * @returns Tuple of [captureOutput function, restoreConsole function]
 */
export function setupConsoleCapture(): [() => string, () => void] {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    output += args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ') + '\n';
  };

  console.error = (...args) => {
    output += 'Error: ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ') + '\n';
  };

  return [
    () => output,
    () => {
      console.log = originalLog;
      console.error = originalError;
    }
  ];
}