import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  // Recupera o tema salvo para manter a escolha do usuário.
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('@despesas:theme') === 'dark';
  });

  useEffect(() => {
    // data-theme é usado pelo CSS para trocar as variáveis de cor.
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('@despesas:theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook para acessar e alternar o tema nas telas.
export function useTheme() {
  return useContext(ThemeContext);
}
