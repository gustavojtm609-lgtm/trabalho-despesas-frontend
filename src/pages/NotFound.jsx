import { Link } from 'react-router-dom';
import '../styles/pages/auth.css';
import '../styles/pages/not-found.css';

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card center not-found-card">
        <span className="auth-logo small">!</span>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe no sistema.</p>
        <Link className="btn btn-primary btn-full" to="/">Voltar ao dashboard</Link>
      </section>
    </main>
  );
}
