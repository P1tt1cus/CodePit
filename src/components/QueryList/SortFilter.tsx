import React from 'react';

interface SortFilterProps {
  sortBy: 'newest' | 'oldest' | 'title';
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
}

export function SortFilter({ sortBy, onSortChange }: SortFilterProps) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
      className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="title">By Title</option>
    </select>
  );
}