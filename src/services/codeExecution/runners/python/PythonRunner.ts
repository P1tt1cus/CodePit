import { loadPyodide } from 'pyodide';
import { CodeRunnerInterface, RunResult } from '../../types';

/**
 * Python code runner using Pyodide WebAssembly
 */
export class PythonRunner implements CodeRunnerInterface {
  private static instance: PythonRunner | null = null;
  private pyodide: any = null;
  private isLoading = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): PythonRunner {
    if (!PythonRunner.instance) {
      PythonRunner.instance = new PythonRunner();
    }
    return PythonRunner.instance;
  }

  async initialize(): Promise<void> {
    // If already initialized, return immediately
    if (this.pyodide) return;

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    // Start initialization
    this.isLoading = true;
    this.initPromise = (async () => {
      try {
        // Load Pyodide with specific version
        this.pyodide = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });

        // Set up the Python environment with output capture
        await this.pyodide.runPythonAsync(`
          import sys, io

          class OutputCapture:
              def __init__(self):
                  self.stdout = io.StringIO()
                  self.stderr = io.StringIO()
                  self._stdout = sys.stdout
                  self._stderr = sys.stderr

              def __enter__(self):
                  sys.stdout = self.stdout
                  sys.stderr = self.stderr
                  return self

              def __exit__(self, *args):
                  sys.stdout = self._stdout
                  sys.stderr = self._stderr

              def get_output(self):
                  return self.stdout.getvalue(), self.stderr.getvalue()

          def run_with_capture(code):
              with OutputCapture() as capture:
                  try:
                      exec(code)
                      stdout, stderr = capture.get_output()
                      return {'output': stdout, 'error': stderr}
                  except Exception as e:
                      import traceback
                      return {
                          'output': '',
                          'error': traceback.format_exc()
                      }
        `);
      } finally {
        this.isLoading = false;
      }
    })();

    await this.initPromise;
  }

  isInitialized(): boolean {
    return !!this.pyodide && !this.isLoading;
  }

  async run(code: string): Promise<RunResult> {
    if (!code?.trim()) {
      return { output: '', error: 'No code to execute' };
    }

    try {
      // Ensure Pyodide is initialized
      await this.initialize();

      // Run the code with output capture
      const result = await this.pyodide.runPythonAsync(`
        run_with_capture(${JSON.stringify(code)})
      `);

      return {
        output: result.output || 'Code executed successfully (no output)',
        error: result.error || undefined
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Failed to execute Python code'
      };
    }
  }
}