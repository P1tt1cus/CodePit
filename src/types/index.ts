export type CodeLanguage = 
  | 'kql' 
  | 'sql' 
  | 'python' 
  | 'javascript' 
  | 'typescript'
  | 'rust' 
  | 'cpp' 
  | 'c' 
  | 'java' 
  | 'go'
  | 'ruby'
  | 'php'
  | 'csharp'
  | 'html'
  | 'css'
  | 'yaml'
  | 'json'
  | 'xml'
  | 'markdown'
  | 'shell';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: CodeLanguage;
  markdown: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AIResponse {
  optimizedCode: string;
  comments: string;
  suggestions: string[];
}