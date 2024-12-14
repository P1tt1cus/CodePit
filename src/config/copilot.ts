// GitHub Copilot configuration
export const COPILOT_CONFIG = {
  apiEndpoint: 'https://api.github.com/copilot',
  version: '1.0',
  // API key will be loaded from environment variables
  getApiKey: () => process.env.GITHUB_COPILOT_TOKEN,
};

// Copilot prompt templates
export const COPILOT_PROMPTS = {
  analyze: (language: string, code: string) => 
    `Analyze this ${language} code and suggest improvements:\n\n${code}`,
  optimize: (language: string, code: string) =>
    `Suggest performance optimizations for this ${language} code:\n\n${code}`,
  document: (language: string, code: string) =>
    `Generate comprehensive documentation for this ${language} code:\n\n${code}`,
};