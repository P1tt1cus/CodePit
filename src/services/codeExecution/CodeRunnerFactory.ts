import { CodeLanguage } from '../../types';
import { CodeRunnerInterface } from './types';
import { PythonRunner } from './runners/python/PythonRunner';
import { JavaScriptRunner } from './runners/javascript/JavaScriptRunner';

/**
 * Factory for creating code runners
 */
export class CodeRunnerFactory {
  private static runners: Map<string, CodeRunnerInterface> = new Map();

  static getRunner(language: CodeLanguage): CodeRunnerInterface | null {
    // Handle TypeScript as JavaScript
    const normalizedLang = language === 'typescript' ? 'javascript' : language;
    
    if (this.runners.has(normalizedLang)) {
      return this.runners.get(normalizedLang)!;
    }

    let runner: CodeRunnerInterface | null = null;
    
    switch (normalizedLang) {
      case 'python':
        runner = PythonRunner.getInstance();
        break;
      case 'javascript':
        runner = new JavaScriptRunner();
        break;
    }

    if (runner) {
      this.runners.set(normalizedLang, runner);
    }

    return runner;
  }

  static isLanguageSupported(language: CodeLanguage): boolean {
    return ['python', 'javascript', 'typescript', 'c'].includes(language);
  }

  static cleanup(): void {
    this.runners.clear();
  }
}