import { get, set, del, entries } from 'idb-keyval';
import { CodeSnippet } from '../types';

const STORAGE_PREFIX = 'codepit:snippet:';

export async function saveQuery(id: string, query: CodeSnippet): Promise<void> {
  await set(`${STORAGE_PREFIX}${id}`, query);
}

export async function deleteQuery(id: string): Promise<void> {
  await del(`${STORAGE_PREFIX}${id}`);
}

export async function loadAllQueries(): Promise<CodeSnippet[]> {
  const allEntries = await entries();
  return allEntries
    .filter(([key]) => key.toString().startsWith(STORAGE_PREFIX))
    .map(([, value]) => value as CodeSnippet)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}