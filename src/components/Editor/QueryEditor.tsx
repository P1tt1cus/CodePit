import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { EditorHeader } from './EditorHeader';
import { EditorLoading } from './EditorLoading';
import { RunButton } from './RunButton';
import { OutputPanel } from './OutputPanel';
import { editorOptions } from './MonacoConfig';
import { CodeLanguage } from '../../types';
import { CodeRunner } from '../../services/codeExecution/CodeRunner';

interface QueryEditorProps {
  initialValue: string;
  language: CodeLanguage;
  onChange: (value: string) => void;
  onSave: () => void;
  isEditing: boolean;
}

export function QueryEditor({ initialValue, language, onChange, onSave, isEditing }: QueryEditorProps) {
  const [value, setValue] = useState(initialValue || '');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>();
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const handleChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      setValue(newValue);
      onChange(newValue);
    }
  }, [onChange]);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const runner = CodeRunner.getInstance();
  const canRun = runner.isLanguageSupported(language);

  const handleRun = async () => {
    if (!canRun || isRunning) return;

    setIsRunning(true);
    setShowOutput(true);
    setOutput('');
    setError(undefined);

    try {
      const result = await runner.runCode(value, language);
      
      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while running the code');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorHeader 
        onSave={onSave} 
        isEditing={isEditing} 
        language={language}
        rightContent={
          canRun && (
            <RunButton
              onRun={handleRun}
              isRunning={isRunning}
              canRun={canRun}
            />
          )
        }
      />
      <div className="flex-1 relative min-h-0">
        {!isEditorReady && <EditorLoading />}
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={handleChange}
          options={{
            ...editorOptions,
            automaticLayout: true,
          }}
          onMount={handleEditorDidMount}
          loading={null}
        />
      </div>
      {showOutput && (
        <OutputPanel
          output={output}
          error={error}
          onClose={() => setShowOutput(false)}
        />
      )}
    </div>
  );
}