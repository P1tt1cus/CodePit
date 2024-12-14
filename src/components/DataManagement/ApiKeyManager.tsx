import React from 'react';
import { Key, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ApiKey {
  service: string;
  key: string;
  addedAt: number;
}

export function ApiKeyManager() {
  const [keys, setKeys] = React.useState<ApiKey[]>([]);
  const [showKey, setShowKey] = React.useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Load keys on mount
  React.useEffect(() => {
    const loadKeys = async () => {
      try {
        const storedKeys = localStorage.getItem('codepit:api-keys');
        if (storedKeys) {
          setKeys(JSON.parse(storedKeys));
        }
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    };
    loadKeys();
  }, []);

  const saveKey = async () => {
    if (!newKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    try {
      // Check if a key for this service already exists
      const existingKeyIndex = keys.findIndex(k => k.service === 'github-copilot');
      let updatedKeys: ApiKey[];

      if (existingKeyIndex >= 0) {
        // Update existing key
        updatedKeys = keys.map((key, index) => 
          index === existingKeyIndex 
            ? { ...key, key: newKey, addedAt: Date.now() }
            : key
        );
      } else {
        // Add new key
        updatedKeys = [...keys, { 
          service: 'github-copilot', 
          key: newKey,
          addedAt: Date.now()
        }];
      }

      localStorage.setItem('codepit:api-keys', JSON.stringify(updatedKeys));
      setKeys(updatedKeys);
      setNewKey('');
      setError(null);
    } catch (error) {
      setError('Failed to save API key');
    }
  };

  const deleteKey = (index: number) => {
    const updatedKeys = keys.filter((_, i) => i !== index);
    localStorage.setItem('codepit:api-keys', JSON.stringify(updatedKeys));
    setKeys(updatedKeys);
  };

  const toggleKeyVisibility = (service: string) => {
    setShowKey(prev => ({ ...prev, [service]: !prev[service] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <Key className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            API Keys
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your API keys for various services
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub Copilot API Key
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type={showKey['github-copilot'] ? 'text' : 'password'}
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your GitHub Copilot API key"
                error={error}
                className="pr-10"
              />
              <button
                onClick={() => toggleKeyVisibility('github-copilot')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showKey['github-copilot'] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button
              onClick={saveKey}
              icon={<Save size={16} />}
            >
              {keys.some(k => k.service === 'github-copilot') ? 'Update Key' : 'Save Key'}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {keys.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Stored Keys
              </h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {keys.map((key, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.service.replace('-', ' ')}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded font-mono text-gray-600 dark:text-gray-300">
                        {showKey[key.service] ? key.key : '••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.service)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showKey[key.service] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(key.addedAt).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKey(index)}
                    icon={<Trash2 size={16} />}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}