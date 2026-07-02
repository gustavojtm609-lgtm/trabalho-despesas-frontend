import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // O token é carregado do localStorage para manter a sessão ativa ao atualizar a página.
  const [token, setToken] = useState(() => localStorage.getItem('@despesas:token'));

  // O usuário também é salvo localmente para mostrar nome/e-mail no menu.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@despesas:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(email, senha) {
    // Chama a rota POST /auth/login do backend.
    const { data } = await api.post('/auth/login', { email, senha });

    // Salva token e usuário para persistir a sessão.
    localStorage.setItem('@despesas:token', data.token);
    localStorage.setItem('@despesas:user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  async function register(nome, email, senha) {
    // Chama a rota POST /users para criar uma nova conta.
    const { data } = await api.post('/users', { nome, email, senha });
    return data;
  }

  function logout() {
    // Remove a sessão salva no navegador.
    localStorage.removeItem('@despesas:token');
    localStorage.removeItem('@despesas:user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar autenticação em qualquer página ou componente.
export function useAuth() {
  return useContext(AuthContext);
}
