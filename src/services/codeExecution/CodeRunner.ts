import { CodeLanguage } from '../../types';
import { JavaScriptRunner } from './runners/javascript/JavaScriptRunner';

interface RunResult {
  output: string;
  error?: string;
}

/**
 * Main code execution service
 * Manages different language runners and provides a unified interface
 */
export class CodeRunner {
  private static instance: CodeRunner;
  private jsRunner: JavaScriptRunner;
  
  private constructor() {
    this.jsRunner = new JavaScriptRunner();
  }

  static getInstance(): CodeRunner {
    if (!CodeRunner.instance) {
      CodeRunner.instance = new CodeRunner();
    }
    return CodeRunner.instance;
  }

  /**
   * Check if a language is supported for execution
   */
  isLanguageSupported(language: CodeLanguage): boolean {
    return ['javascript', 'typescript'].includes(language);
  }

  /**
   * Execute code in the appropriate runner
   */
  async runCode(code: string, language: CodeLanguage): Promise<RunResult> {
    if (!code?.trim()) {
      return {
        output: '',
        error: 'No code to execute'
      };
    }

    // Currently only supporting JavaScript/TypeScript
    if (!this.isLanguageSupported(language)) {
      return {
        output: '',
        error: `Language ${language} execution is not supported in the browser environment. Only JavaScript/TypeScript execution is currently available.`
      };
    }

    try {
      return await this.jsRunner.run(code);
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Failed to execute code'
      };
    }
  }
}