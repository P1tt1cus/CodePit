import { CodeLanguage } from '../../types';
import { LANGUAGE_CONTEXTS } from '../../config/languages';

interface CopilotResponse {
  suggestions: string[];
  explanation: string;
}

export class CopilotService {
  private static instance: CopilotService;

  private constructor() {}

  static getInstance(): CopilotService {
    if (!CopilotService.instance) {
      CopilotService.instance = new CopilotService();
    }
    return CopilotService.instance;
  }

  async getSuggestions(code: string, language: CodeLanguage): Promise<CopilotResponse> {
    try {
      // Since we can't directly access GitHub Copilot API in the browser,
      // we'll use a simulated response based on code analysis
      const context = LANGUAGE_CONTEXTS[language];
      const suggestions = this.analyzeSuggestions(code, language);
      
      return {
        suggestions: suggestions,
        explanation: `Analysis of your ${context} code suggests the following improvements:`,
      };
    } catch (error) {
      console.error('Copilot analysis error:', error);
      throw new Error('Failed to analyze code');
    }
  }

  private analyzeSuggestions(code: string, language: CodeLanguage): string[] {
    const suggestions: string[] = [];
    
    // Basic code analysis
    if (!code.includes('//') && !code.includes('/*')) {
      suggestions.push('Consider adding comments to explain complex logic');
    }

    if (code.includes('console.log')) {
      suggestions.push('Remove or replace debug console.log statements');
    }

    // Language-specific suggestions
    switch (language) {
      case 'javascript':
      case 'typescript':
        if (code.includes('var ')) {
          suggestions.push('Replace "var" with "const" or "let" for better scoping');
        }
        if (!code.includes('try') && !code.includes('catch')) {
          suggestions.push('Consider adding error handling with try/catch blocks');
        }
        break;

      case 'python':
        if (!code.includes('def ')) {
          suggestions.push('Consider breaking down the code into functions for better organization');
        }
        if (code.includes('except:')) {
          suggestions.push('Avoid bare except clauses; catch specific exceptions');
        }
        break;

      case 'sql':
      case 'kql':
        if (!code.toLowerCase().includes('where')) {
          suggestions.push('Consider adding filters to optimize query performance');
        }
        break;
    }

    return suggestions;
  }
}