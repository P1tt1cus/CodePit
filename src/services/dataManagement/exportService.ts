import { useQueryStore } from '../../store/queryStore';
import { SnippetExport } from './types';

export async function exportSnippets(): Promise<string> {
  const store = useQueryStore.getState();
  const queries = store.queries;

  if (!queries || queries.length === 0) {
    throw new Error('No snippets to export');
  }

  const exportData: SnippetExport = {
    version: '1.0.0',
    snippets: queries.map(snippet => ({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags,
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
      markdown: snippet.markdown,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadSnippets(data: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `codepit-snippets-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}