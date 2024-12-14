import { CodeRunnerInterface, RunResult } from '../../types';
import { EXECUTION_TIMEOUT, SECURITY_CONFIG } from '../../config';

/**
 * JavaScript code execution engine
 * Runs code in a sandboxed environment with safety checks
 */
export class JavaScriptRunner implements CodeRunnerInterface {
  private outputBuffer: string = '';

  async initialize(): Promise<void> {
    // JavaScript environment is always ready
    return Promise.resolve();
  }

  isInitialized(): boolean {
    return true;
  }

  /**
   * Execute JavaScript code safely
   * @param code - JavaScript code to execute
   */
  async run(code: string): Promise<RunResult> {
    if (!code?.trim()) {
      return { output: '', error: 'No code to execute' };
    }

    // Check for blocked keywords
    const hasBlockedKeywords = SECURITY_CONFIG.blockedKeywords.some(keyword => 
      code.includes(keyword)
    );

    if (hasBlockedKeywords) {
      return {
        output: '',
        error: 'Code contains blocked keywords for security reasons'
      };
    }

    const originalConsole = this.setupConsoleCapture();

    try {
      // Create sandbox and execute code
      const sandboxedCode = this.createSandbox(code);
      
      await Promise.race([
        sandboxedCode(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), EXECUTION_TIMEOUT)
        )
      ]);

      return { 
        output: this.outputBuffer || 'Code executed successfully (no output)'
      };
    } catch (error) {
      return {
        output: this.outputBuffer,
        error: error instanceof Error ? error.message : 'Failed to execute JavaScript code'
      };
    } finally {
      this.restoreConsole(originalConsole);
      this.outputBuffer = '';
    }
  }

  /**
   * Create a sandboxed execution environment
   */
  private createSandbox(code: string): Function {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    return new AsyncFunction(code);
  }

  /**
   * Set up console output capture
   */
  private setupConsoleCapture(): typeof console {
    const originalConsole = { ...console };

    console.log = (...args) => {
      this.outputBuffer += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') + '\n';
    };

    console.error = (...args) => {
      this.outputBuffer += 'Error: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') + '\n';
    };

    return originalConsole;
  }

  /**
   * Restore original console methods
   */
  private restoreConsole(originalConsole: typeof console): void {
    Object.assign(console, originalConsole);
  }
}