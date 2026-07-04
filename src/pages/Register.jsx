import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/pages/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  // Estado local do formulário de cadastro.
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (form.senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      // Primeiro cria o usuário e depois já faz login automaticamente.
      await register(form.nome, form.email, form.senha);
      await login(form.email, form.senha);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar cadastro.');
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
        <h1>Financias</h1>
        <p>Crie sua conta e organize suas despesas</p>
      </section>

      <section className="auth-card">
        <div className="auth-card-title">
          <h2>Criar conta</h2>
          <p>Preencha seus dados para começar</p>
        </div>

        <Alert type="danger" message={error} />

        <form className="form auth-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="nome" placeholder="Seu nome" value={form.nome} onChange={handleChange} />
          </label>

          <label>
            E-mail
            <input type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
          </label>

          <label>
            Senha
            <input type="password" name="senha" placeholder="••••••••" value={form.senha} onChange={handleChange} />
          </label>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {loading && <Loading text="Criando usuário..." />}

        <div className="auth-divider"><span>ou</span></div>

        <Link className="btn btn-outline btn-full" to="/login">
          Fazer login
        </Link>
      </section>

      <footer className="auth-copy">
        © 2024 Finanças Instituição de Pagamento S.A.<br />
        Segurança e criptografia de ponta a ponta.
      </footer>
    </main>
  );
}
