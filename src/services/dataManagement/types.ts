import { CodeLanguage } from '../../types';

export interface SnippetExport {
  version: string;
  snippets: Array<{
    id?: string;
    title: string;
    description: string;
    code: string;
    language: CodeLanguage;
    tags: string[];
    createdAt?: number;
    updatedAt?: number;
    markdown?: string;
  }>;
}

export interface SnippetRevision {
  id: string;
  snippetId: string;
  code: string;
  description: string;
  timestamp: number;
  author?: string;
}