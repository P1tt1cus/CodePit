/**
 * Utility functions for Python code execution
 */

/**
 * Initializes the Python environment with required imports and configurations
 * @param pyodide - Pyodide instance
 */
export async function initializePythonEnvironment(pyodide: any): Promise<void> {
  await pyodide.runPythonAsync(`
import sys
import io
import traceback

def setup_io():
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()

def get_output():
    stdout = sys.stdout.getvalue()
    stderr = sys.stderr.getvalue()
    setup_io()  # Reset for next execution
    return stdout, stderr

def reset_io():
    setup_io()

# Initial setup
setup_io()
  `);
}

/**
 * Formats Python error messages for better readability
 * @param error - Python error message
 * @returns Formatted error message
 */
export function formatPythonError(error: string): string {
  // Remove internal Pyodide stack traces
  const lines = error.split('\n');
  const relevantLines = lines.filter(line => 
    !line.includes('pyodide') && 
    !line.includes('wasm') &&
    !line.includes('asyncio') &&
    !line.includes('_pyodide') &&
    !line.includes('eval_code_async')
  );
  
  return relevantLines.join('\n').trim();
}