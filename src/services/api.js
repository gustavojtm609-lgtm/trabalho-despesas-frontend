import axios from 'axios';

// Configuração central do Axios.
// Se existir VITE_API_URL no arquivo .env, ele usa essa URL.
// Caso contrário, usa o backend local na porta 3000.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Antes de cada requisição, o interceptor verifica se existe token salvo.
// Se existir, o token é enviado no cabeçalho Authorization.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@despesas:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se o backend responder 401, o sistema limpa a sessão e volta para o login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@despesas:token');
      localStorage.removeItem('@despesas:user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
