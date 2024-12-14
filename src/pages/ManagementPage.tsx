import React from 'react';
import { ImportExportButtons } from '../components/DataManagement/ImportExportButtons';
import { ApiKeyManager } from '../components/DataManagement/ApiKeyManager';
import { LanguageStats } from '../components/DataManagement/LanguageStats';
import { useQueryStore } from '../store/queryStore';
import { SnippetsView } from '../components/QueryList/SnippetsView';
import { useNavigate } from 'react-router-dom';

export function ManagementPage() {
  const navigate = useNavigate();
  const { queries } = useQueryStore();

  const handleQuerySelect = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const stats = React.useMemo(() => {
    const totalSnippets = queries.length;
    const uniqueLanguages = new Set(queries.map(q => q.language)).size;
    const totalTags = new Set(queries.flatMap(q => q.tags)).size;

    return {
      totalSnippets,
      uniqueLanguages,
      totalTags,
    };
  }, [queries]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Snippet Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Snippets
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {stats.totalSnippets}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
              Languages Used
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">
              {stats.uniqueLanguages}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Total Tags
            </h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {stats.totalTags}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Language Distribution
          </h3>
          <LanguageStats />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Import/Export
          </h3>
          <ImportExportButtons />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <ApiKeyManager />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Snippet Overview
          </h3>
          <SnippetsView
            onQuerySelect={handleQuerySelect}
            selectedId={null}
          />
        </div>
      </div>
    </div>
  );
}