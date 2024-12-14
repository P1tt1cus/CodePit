import { get, set } from 'idb-keyval';
import { SnippetRevision } from './types';

export async function saveRevision(snippetId: string, code: string, description: string): Promise<void> {
  const revisions: SnippetRevision[] = await get(`revisions:${snippetId}`) || [];
  
  const newRevision: SnippetRevision = {
    id: crypto.randomUUID(),
    snippetId,
    code,
    description,
    timestamp: Date.now(),
  };

  await set(`revisions:${snippetId}`, [...revisions, newRevision]);
}

export async function getRevisions(snippetId: string): Promise<SnippetRevision[]> {
  const revisions: SnippetRevision[] = await get(`revisions:${snippetId}`) || [];
  return revisions.sort((a, b) => b.timestamp - a.timestamp);
}

export async function restoreRevision(snippetId: string, revisionId: string): Promise<SnippetRevision | null> {
  const revisions = await getRevisions(snippetId);
  return revisions.find(rev => rev.id === revisionId) || null;
}