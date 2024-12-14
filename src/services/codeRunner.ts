import { loadPyodide } from 'pyodide';
import type { CodeLanguage } from '../types';

interface RunResult {
  output: string;
  error?: string;
}

export class CodeRunner {
  private static instance: CodeRunner;
  private pyodide: any = null;
  private isLoadingPyodide = false;
  private loadPyodidePromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): CodeRunner {
    if (!CodeRunner.instance) {
      CodeRunner.instance = new CodeRunner();
    }
    return CodeRunner.instance;
  }

  async runCode(code: string, language: CodeLanguage): Promise<RunResult> {
    if (!code || !code.trim()) {
      return {
        output: '',
        error: 'No code to execute'
      };
    }

    switch (language) {
      case 'python':
        return this.runPython(code);
      case 'javascript':
      case 'typescript':
        return this.runJavaScript(code);
      default:
        return {
          error: `Language ${language} execution is not supported in the browser environment. Currently supported languages: JavaScript, TypeScript, and Python`,
          output: ''
        };
    }
  }

  private async initPyodide() {
    if (this.pyodide) return;

    if (!this.loadPyodidePromise) {
      this.isLoadingPyodide = true;
      this.loadPyodidePromise = (async () => {
        try {
          this.pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
          });
        } finally {
          this.isLoadingPyodide = false;
        }
      })();
    }

    await this.loadPyodidePromise;
  }

  private async runPython(code: string): Promise<RunResult> {
    try {
      await this.initPyodide();
      
      let output = '';
      const stdout = {
        write: (text: string) => {
          output += text;
        },
        flush: () => {}
      };

      this.pyodide.setStdout(stdout);
      
      await this.pyodide.runPythonAsync(code);
      
      return { output: output || 'Code executed successfully (no output)' };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'An error occurred while executing Python code'
      };
    }
  }

  private async runJavaScript(code: string): Promise<RunResult> {
    try {
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

      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      await new AsyncFunction(code)();

      console.log = originalLog;
      console.error = originalError;

      return { output: output || 'Code executed successfully (no output)' };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'An error occurred while executing JavaScript code'
      };
    }
  }
}