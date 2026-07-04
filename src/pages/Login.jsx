import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/pages/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado local do formulário de login.
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Validação simples antes de chamar a API.
    if (!form.email || !form.senha) {
      setError('Preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.senha);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand" aria-label="Apresentação do sistema">
        <span className="auth-logo">
  <i className="ph ph-wallet"></i>
</span>
        <h1>Finanças</h1>
        <p>Gestão inteligente para o seu dinheiro</p>
      </section>

      <section className="auth-card">
        <div className="auth-card-title">
          <h2>Bem-vindo</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <Alert type="danger" message={error} />

        <form className="form auth-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            <span className="label-row">
              Senha
              <Link to="/login" className="forgot-link">Esqueceu a senha?</Link>
            </span>
            <input
              type="password"
              name="senha"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
            />
          </label>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {loading && <Loading text="Validando acesso..." />}

        <div className="auth-divider"><span>ou</span></div>

        <Link className="btn btn-outline btn-full" to="/cadastro">
          Criar conta
        </Link>
      </section>

      <footer className="auth-copy">
        © 2024 Finanças Instituição de Pagamento S.A.<br />
        Segurança e criptografia de ponta a ponta.
      </footer>
    </main>
  );
}
