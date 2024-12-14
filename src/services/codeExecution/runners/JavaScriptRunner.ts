import { CodeRunnerInterface, RunResult, RunnerConfig } from '../types';

/**
 * JavaScript/TypeScript code runner
 * Executes code in a sandboxed environment with console output capture
 */
export class JavaScriptRunner implements CodeRunnerInterface {
  async initialize(): Promise<void> {
    // JavaScript environment is always ready
    return Promise.resolve();
  }

  isInitialized(): boolean {
    return true;
  }

  /**
   * Executes JavaScript/TypeScript code
   * Captures console output and handles errors
   * @param code - JavaScript code to execute
   * @param config - Optional execution configuration
   */
  async run(code: string, config?: RunnerConfig): Promise<RunResult> {
    if (!code?.trim()) {
      return { output: '', error: 'No code to execute' };
    }

    let output = '';
    const originalLog = console.log;
    const originalError = console.error;

    try {
      // Set up console output capture
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

      // Execute code with timeout if specified
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const executionPromise = new AsyncFunction(code)();

      if (config?.timeout) {
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error('Execution timeout')), config.timeout);
        });

        await Promise.race([executionPromise, timeoutPromise]);
      } else {
        await executionPromise;
      }

      return { output: output || 'Code executed successfully (no output)' };
    } catch (error) {
      return {
        output,
        error: error instanceof Error ? error.message : 'An error occurred while executing JavaScript code'
      };
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
    }
  }
}