import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import '../styles/components/layout.css';

// Layout usado nas páginas autenticadas.
// O Outlet renderiza Dashboard, Categorias ou Despesas dentro da estrutura principal.
export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
