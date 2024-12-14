import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QueryEditor } from '../components/Editor/QueryEditor';
import { QueryForm } from '../components/QueryForm/QueryForm';
import { ChatWindow } from '../components/Chat/ChatWindow';
import { QueryList } from '../components/QueryList/QueryList';
import { RevisionHistory } from '../components/DataManagement/RevisionHistory';
import { useQueryStore } from '../store/queryStore';
import { CodeLanguage, CodeSnippet } from '../types';
import { saveRevision } from '../services/dataManagement/revisionService';

const DEFAULT_SNIPPET: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt' | 'markdown'> = {
  title: '',
  description: '',
  code: '',
  language: 'javascript',
  tags: [],
};

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const { queries, addQuery, updateQuery, deleteQuery } = useQueryStore();

  const [currentSnippet, setCurrentSnippet] = React.useState<typeof DEFAULT_SNIPPET>(DEFAULT_SNIPPET);

  // Load query data when ID changes
  React.useEffect(() => {
    if (id) {
      const query = queries.find(q => q.id === id);
      if (query) {
        setCurrentSnippet({
          title: query.title,
          description: query.description,
          code: query.code,
          language: query.language,
          tags: query.tags,
        });
      }
    } else {
      setCurrentSnippet(DEFAULT_SNIPPET);
    }
  }, [id, queries]);

  const handleQuerySelect = (query: CodeSnippet) => {
    navigate(`/editor/${query.id}`);
  };

  const handleQueryDelete = async (queryId: string) => {
    if (queryId === id) {
      navigate('/editor');
    }
  };

  const handleTitleChange = (title: string) => {
    setError(null);
    setCurrentSnippet(prev => ({ ...prev, title }));
  };

  const handleSave = async () => {
    if (!currentSnippet.title) {
      setError('Please enter a title for the snippet');
      return;
    }

    try {
      const markdown = `# ${currentSnippet.title}\n\n${currentSnippet.description}\n\n\`\`\`${currentSnippet.language}\n${currentSnippet.code}\n\`\`\``;
      
      if (id) {
        await updateQuery(id, {
          ...currentSnippet,
          markdown,
        });
        await saveRevision(id, currentSnippet.code, currentSnippet.description);
      } else {
        await addQuery({
          ...currentSnippet,
          markdown,
        });
      }

      navigate('/snippets');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save snippet. Please try again.');
      }
    }
  };

  const handleRestoreRevision = (code: string, description: string) => {
    setCurrentSnippet(prev => ({
      ...prev,
      code,
      description,
    }));
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <QueryList
          onQuerySelect={handleQuerySelect}
          selectedId={id || null}
          onQueryDelete={handleQueryDelete}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
            <QueryForm
              title={currentSnippet.title}
              description={currentSnippet.description}
              tags={currentSnippet.tags}
              language={currentSnippet.language}
              error={error}
              onTitleChange={handleTitleChange}
              onDescriptionChange={(description) => setCurrentSnippet((prev) => ({ ...prev, description }))}
              onTagsChange={(tags) => setCurrentSnippet((prev) => ({ ...prev, tags }))}
              onLanguageChange={(language) => setCurrentSnippet((prev) => ({ ...prev, language }))}
            />
            {id && (
              <RevisionHistory
                snippetId={id}
                onRestore={handleRestoreRevision}
              />
            )}
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <QueryEditor
            initialValue={currentSnippet.code}
            language={currentSnippet.language}
            onChange={(code) => setCurrentSnippet((prev) => ({ ...prev, code }))}
            onSave={handleSave}
            isEditing={!!id}
          />
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow 
        currentQuery={currentSnippet.code} 
        language={currentSnippet.language}
      />
    </div>
  );
}