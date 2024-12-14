/**
 * Result of code execution
 */
export interface RunResult {
  output: string;
  error?: string;
}

/**
 * Configuration for code runners
 */
export interface RunnerConfig {
  timeout?: number;
  memoryLimit?: number;
}

/**
 * Base interface for all code runners
 */
export interface CodeRunnerInterface {
  run(code: string, config?: RunnerConfig): Promise<RunResult>;
  initialize(): Promise<void>;
  isInitialized(): boolean;
}