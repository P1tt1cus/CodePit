import React from 'react';

export function EditorLoading() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="animate-pulse text-gray-500">Loading editor...</div>
    </div>
  );
}