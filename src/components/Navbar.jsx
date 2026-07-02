import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import '../styles/components/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="brand-area">
        <span className="auth-logo">
  <i className="ph ph-wallet"></i>
</span>
        <div>
          <strong className="brand">Finanças</strong>
          <p className="user-text">Olá, {user?.nome || user?.email || 'usuário'}</p>
        </div>
      </div>

      {/* NavLink adiciona a classe active automaticamente na rota atual. */}
      <nav className="nav-links" aria-label="Menu principal">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
        <NavLink to="/despesas">Despesas</NavLink>
      </nav>

      <div className="topbar-actions">
        <button className="btn btn-ghost" onClick={toggleTheme} type="button">
          {darkMode ? 'Modo claro' : 'Modo escuro'}
        </button>
        <button className="btn btn-danger" onClick={logout} type="button">
          Sair
        </button>
      </div>
    </header>
  );
}
