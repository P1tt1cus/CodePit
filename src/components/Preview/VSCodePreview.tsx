import React from 'react';
import { CodeSnippet } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '../../utils/date';
import { LanguageBadge } from '../QueryList/LanguageBadge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useThemeStore } from '../../store/themeStore';
import { MONACO_LANGUAGE_MAP } from '../../config/languages';
import { Copy, Check } from 'lucide-react';

interface VSCodePreviewProps {
  snippet: CodeSnippet;
}

export function VSCodePreview({ snippet }: VSCodePreviewProps) {
  const theme = useThemeStore(state => state.theme);
  const [copied, setCopied] = React.useState(false);

  // Create a modified markdown that ensures spacing between description and code
  const formattedMarkdown = React.useMemo(() => {
    const parts = snippet.markdown.split('```');
    if (parts.length >= 3) {
      // Add extra newlines before the code block
      parts[0] = parts[0].trim() + '\n\n';
      return parts.join('```');
    }
    return snippet.markdown;
  }, [snippet.markdown]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* VS Code-style preview header */}
      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Preview: {snippet.title}
          </span>
          <LanguageBadge language={snippet.language} />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {formatDate(snippet.updatedAt)}
        </div>
      </div>

      {/* VS Code-style markdown content */}
      <div className="p-6">
        <div className="prose dark:prose-invert 
                      prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                      prose-p:text-gray-700 dark:prose-p:text-gray-300
                      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                      prose-em:text-gray-800 dark:prose-em:text-gray-300
                      prose-code:text-gray-800 dark:prose-code:text-gray-300
                      prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                      prose-pre:bg-transparent dark:prose-pre:bg-transparent
                      prose-pre:text-gray-800 dark:prose-pre:text-gray-200
                      prose-a:text-blue-600 dark:prose-a:text-blue-400
                      prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                      prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                      prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                      prose-ol:text-gray-700 dark:prose-ol:text-gray-300
                      prose-li:text-gray-700 dark:prose-li:text-gray-300
                      [&>*]:mb-4 last:[&>*]:mb-0
                      max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : MONACO_LANGUAGE_MAP[snippet.language] || 'text';
                const codeString = String(children).replace(/\n$/, '');

                return inline ? (
                  <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <div className="relative group not-prose mt-6">
                    <div className="absolute top-0 right-0 flex items-center gap-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-bl font-mono z-10">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {language}
                      </span>
                      <button
                        onClick={() => handleCopy(codeString)}
                        className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      style={theme === 'dark' ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.375rem',
                        padding: '1rem',
                        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      }}
                      PreTag="div"
                      showLineNumbers={true}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-6 text-gray-900 dark:text-gray-100">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              a: ({ children, href }) => (
                <a 
                  href={href}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700 dark:text-gray-300">
                  {children}
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                  {children}
                </td>
              ),
            }}
          >
            {formattedMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}