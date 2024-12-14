import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-md border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
          "placeholder-gray-500 dark:placeholder-gray-400",
          "focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400",
          "disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}