import React from 'react';
import { History } from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/date';
import { getRevisions, restoreRevision } from '../../services/dataManagement/revisionService';
import { SnippetRevision } from '../../services/dataManagement/types';

interface RevisionHistoryProps {
  snippetId: string;
  onRestore: (code: string, description: string) => void;
}

export function RevisionHistory({ snippetId, onRestore }: RevisionHistoryProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [revisions, setRevisions] = React.useState<SnippetRevision[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadRevisions = async () => {
    setIsLoading(true);
    try {
      const history = await getRevisions(snippetId);
      setRevisions(history);
    } catch (error) {
      console.error('Failed to load revisions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (revisionId: string) => {
    const revision = await restoreRevision(snippetId, revisionId);
    if (revision) {
      onRestore(revision.code, revision.description);
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadRevisions();
    }
  }, [isOpen, snippetId]);

  if (!snippetId) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<History size={16} />}
      >
        History
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Revision History</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading revisions...
              </div>
            ) : revisions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No revisions found
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {revisions.map((revision) => (
                  <div key={revision.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(revision.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(revision.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}