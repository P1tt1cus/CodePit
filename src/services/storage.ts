import { get, set, del, entries } from 'idb-keyval';
import { CodeSnippet } from '../types';

const STORAGE_PREFIX = 'codepit:snippet:';

export async function saveQuery(id: string, query: CodeSnippet): Promise<void> {
  try {
    await set(`${STORAGE_PREFIX}${id}`, query);
  } catch (error) {
    console.error('Failed to save query:', error);
    throw new Error('Failed to save snippet to storage');
  }
}

export async function deleteQuery(id: string): Promise<void> {
  try {
    await del(`${STORAGE_PREFIX}${id}`);
  } catch (error) {
    console.error('Failed to delete query:', error);
    throw new Error('Failed to delete snippet from storage');
  }
}

export async function loadAllQueries(): Promise<CodeSnippet[]> {
  try {
    const allEntries = await entries();
    return allEntries
      .filter(([key]) => key.toString().startsWith(STORAGE_PREFIX))
      .map(([, value]) => value as CodeSnippet)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Failed to load queries:', error);
    throw new Error('Failed to load snippets from storage');
  }
}

export async function clearStorage(): Promise<void> {
  try {
    const allEntries = await entries();
    const snippetKeys = allEntries
      .filter(([key]) => key.toString().startsWith(STORAGE_PREFIX))
      .map(([key]) => key);
    
    await Promise.all(snippetKeys.map(key => del(key)));
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw new Error('Failed to clear storage');
  }
}