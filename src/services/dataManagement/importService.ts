import { useQueryStore } from '../../store/queryStore';
import { CodeLanguage, CodeSnippet } from '../../types';
import { SnippetExport } from './types';
import { saveQuery, clearStorage } from '../storage';

export async function importSnippets(file: File, replaceExisting: boolean = false): Promise<void> {
  try {
    const content = await file.text();
    const importData: SnippetExport = JSON.parse(content);
    
    if (!importData.version || !Array.isArray(importData.snippets)) {
      throw new Error('Invalid import file format');
    }

    const store = useQueryStore.getState();

    // Clear existing snippets if replacing
    if (replaceExisting) {
      await clearStorage();
    }

    // Import each snippet
    for (const snippet of importData.snippets) {
      // Generate new IDs for imported snippets to avoid conflicts
      const newId = crypto.randomUUID();
      const timestamp = Date.now();

      const newSnippet: CodeSnippet = {
        id: newId,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language as CodeLanguage,
        tags: snippet.tags || [],
        markdown: `# ${snippet.title}\n\n${snippet.description}\n\n\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // Check for duplicate titles if not replacing
      if (!replaceExisting && store.findDuplicateTitle(snippet.title)) {
        console.warn(`Skipping duplicate snippet: ${snippet.title}`);
        continue;
      }

      // Save directly to storage
      await saveQuery(newId, newSnippet);
    }

    // Reload queries after import
    await store.loadQueries();
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Failed to import snippets. Please check the file format and try again.');
  }
}