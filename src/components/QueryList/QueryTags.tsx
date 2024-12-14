import React from 'react';

interface QueryTagsProps {
  tags: string[];
}

export function QueryTags({ tags }: QueryTagsProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}