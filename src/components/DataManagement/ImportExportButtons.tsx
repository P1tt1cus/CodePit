import React from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { exportSnippets, downloadSnippets } from '../../services/dataManagement/exportService';
import { importSnippets } from '../../services/dataManagement/importService';
import { useQueryStore } from '../../store/queryStore';

export function ImportExportButtons() {
  const { loadQueries, queries } = useQueryStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleExport = async () => {
    if (queries.length === 0) {
      alert('No snippets to export');
      return;
    }

    try {
      setIsExporting(true);
      const data = await exportSnippets();
      downloadSnippets(data);
    } catch (error) {
      console.error('Failed to export snippets:', error);
      alert('Failed to export snippets. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (queries.length > 0) {
      setShowConfirm(true);
    } else {
      handleImport(file, false);
    }
  };

  const handleImport = async (file: File, replaceExisting: boolean) => {
    try {
      setIsImporting(true);
      await importSnippets(file, replaceExisting);
      await loadQueries();
      alert('Snippets imported successfully!');
    } catch (error) {
      console.error('Failed to import snippets:', error);
      alert(error instanceof Error ? error.message : 'Failed to import snippets. Please check the file format and try again.');
    } finally {
      setIsImporting(false);
      setShowConfirm(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json"
        className="hidden"
      />
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload size={16} />}
          isLoading={isImporting}
          disabled={isImporting || isExporting}
        >
          Import
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          icon={<Download size={16} />}
          isLoading={isExporting}
          disabled={isImporting || isExporting || queries.length === 0}
        >
          Export
        </Button>
      </div>

      {showConfirm && selectedFile && (
        <div className="absolute top-full mt-2 right-0 w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-start gap-2 mb-4">
            <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You have existing snippets. Do you want to:
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleImport(selectedFile, false)}
            >
              Merge
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleImport(selectedFile, true)}
            >
              Replace All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowConfirm(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}