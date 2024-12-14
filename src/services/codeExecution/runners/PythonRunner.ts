import { loadPyodide } from 'pyodide';
import { CodeRunnerInterface, RunResult, RunnerConfig } from '../types';

/**
 * Python code runner using Pyodide
 * Handles Python code execution in the browser environment
 */
export class PythonRunner implements CodeRunnerInterface {
  private pyodide: any = null;
  private isLoading = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initializes the Pyodide environment
   * Loads required packages and sets up the runtime
   */
  async initialize(): Promise<void> {
    if (this.pyodide) return;

    if (!this.initPromise) {
      this.isLoading = true;
      this.initPromise = (async () => {
        try {
          // Initialize Pyodide with specific version and full distribution
          this.pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
            stdout: (text: string) => {
              // Handle stdout directly during initialization
              console.log(text);
            },
            stderr: (text: string) => {
              // Handle stderr directly during initialization
              console.error(text);
            }
          });

          // Initialize basic Python environment
          await this.pyodide.runPythonAsync(`
            import sys
            import io
            sys.stdout = io.StringIO()
            sys.stderr = io.StringIO()
          `);
        } catch (error) {
          console.error('Failed to initialize Pyodide:', error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      })();
    }

    await this.initPromise;
  }

  isInitialized(): boolean {
    return !!this.pyodide && !this.isLoading;
  }

  /**
   * Executes Python code using Pyodide
   * @param code - Python code to execute
   * @param config - Optional execution configuration
   */
  async run(code: string, config?: RunnerConfig): Promise<RunResult> {
    if (!code?.trim()) {
      return { output: '', error: 'No code to execute' };
    }

    try {
      await this.initialize();

      // Reset stdout and stderr before execution
      await this.pyodide.runPythonAsync(`
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
      `);
      
      // Execute the user's code
      await this.pyodide.runPythonAsync(code);
      
      // Retrieve output and error content
      const stdout = await this.pyodide.runPythonAsync(`sys.stdout.getvalue()`);
      const stderr = await this.pyodide.runPythonAsync(`sys.stderr.getvalue()`);
      
      if (stderr) {
        return { output: stdout, error: stderr };
      }
      
      return { 
        output: stdout || 'Code executed successfully (no output)' 
      };
    } catch (error) {
      // Handle execution errors
      return {
        output: '',
        error: error instanceof Error 
          ? error.message 
          : 'An error occurred while executing Python code'
      };
    }
  }
}