import { COPILOT_CONFIG } from '../../config/copilot';

export class CopilotAuthService {
  private static instance: CopilotAuthService;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): CopilotAuthService {
    if (!CopilotAuthService.instance) {
      CopilotAuthService.instance = new CopilotAuthService();
    }
    return CopilotAuthService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  getApiKey(): string | null {
    return this.apiKey || COPILOT_CONFIG.getApiKey();
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }
}