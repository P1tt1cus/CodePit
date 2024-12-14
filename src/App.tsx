import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { EditorPage } from './pages/EditorPage';
import { SnippetsPage } from './pages/SnippetsPage';
import { ManagementPage } from './pages/ManagementPage';
import { useThemeStore } from './store/themeStore';

function App() {
  const theme = useThemeStore(state => state.theme);

  // Apply theme on mount and when it changes
  React.useEffect(() => {
    // Set dark mode class on document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/editor" replace />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="snippets" element={<SnippetsPage />} />
          <Route path="management" element={<ManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;