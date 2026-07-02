import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    // BrowserRouter habilita a navegação por rotas no navegador.
    <BrowserRouter>
      {/* ThemeProvider controla o modo claro/escuro em toda a aplicação. */}
      <ThemeProvider>
        {/* AuthProvider guarda usuário, token, login, cadastro e logout. */}
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
