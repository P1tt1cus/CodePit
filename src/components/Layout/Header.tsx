import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, Plus, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Header() {
  const navigate = useNavigate();

  const handleNewSnippet = () => {
    navigate('/editor');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                CodePit
              </h1>
            </div>
            <nav className="flex space-x-4">
              <NavLink
                to="/editor"
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  )
                }
              >
                Editor
              </NavLink>
              <NavLink
                to="/snippets"
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  )
                }
              >
                Snippets
              </NavLink>
              <NavLink
                to="/management"
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  )
                }
              >
                Management
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={handleNewSnippet}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg 
                       hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 
                       transition-colors"
            >
              <Plus size={20} />
              New Snippet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}