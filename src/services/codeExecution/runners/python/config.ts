/**
 * Configuration for Python code execution
 */
export const PYODIDE_CONFIG = {
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
  fullStdLib: true,
  packages: [],
  env: {
    HOME: '/home/pyodide',
    PYTHONPATH: '/home/pyodide'
  },
  stdout: (text: string) => console.log(text),
  stderr: (text: string) => console.error(text)
};

export const PYTHON_TIMEOUT = 30000; // 30 seconds execution timeout