import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';
import api from '../services/api.js';
import '../styles/pages/dashboard.css';

// Função auxiliar para formatar valores em reais.
function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [byCategory, setByCategory] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calcula o maior valor para transformar os gastos por categoria em barras proporcionais.
  const maxCategoryValue = useMemo(() => {
    return Math.max(...byCategory.map((item) => Number(item.total)), 1);
  }, [byCategory]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Promise.all permite buscar todas as informações do dashboard ao mesmo tempo.
      const [totalResponse, countResponse, categoryResponse, expensesResponse] = await Promise.all([
        api.get('/dashboard/total-expenses'),
        api.get('/dashboard/expenses-count'),
        api.get('/dashboard/expenses-by-category'),
        api.get('/expenses'),
      ]);

      setTotal(totalResponse.data.total || 0);
      setCount(countResponse.data.quantidade || 0);
      setByCategory(categoryResponse.data || []);

      // Pega as últimas 5 despesas cadastradas para mostrar no resumo.
      const expenses = expensesResponse.data?.dados || [];
      const ordered = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatestExpenses(ordered.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.mensagem || err.response?.data?.error || 'Erro ao carregar dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <Loading text="Carregando dashboard..." />;

  return (
    <section className="page dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resumo financeiro</p>
          <h1>Dashboard</h1>
          <p>Acompanhe os gastos cadastrados no sistema.</p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboard} type="button">Atualizar</button>
      </div>

      <Alert type="danger" message={error} />

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total de gastos</span>
          <strong>{money(total)}</strong>
          <small>Soma das despesas cadastradas</small>
        </article>

        <article className="stat-card">
          <span>Quantidade de despesas</span>
          <strong>{count}</strong>
          <small>Total de registros encontrados</small>
        </article>
      </div>

      <div className="content-grid">
        <article className="card">
          <div className="card-header">
            <h2>Gastos por categoria</h2>
          </div>

          {byCategory.length === 0 ? (
            <p className="empty-text">Nenhum gasto por categoria encontrado.</p>
          ) : (
            <div className="chart-list">
              {byCategory.map((item) => (
                <div className="chart-row" key={item.categoria}>
                  <div className="chart-label">
                    <span>{item.categoria}</span>
                    <strong>{money(item.total)}</strong>
                  </div>
                  <div className="chart-track">
                    <div className="chart-bar" style={{ width: `${(Number(item.total) / maxCategoryValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-header">
            <h2>Últimas despesas</h2>
          </div>

          {latestExpenses.length === 0 ? (
            <p className="empty-text">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <div className="mini-list">
              {latestExpenses.map((expense) => (
                <div className="mini-item" key={expense.id}>
                  <div>
                    <strong>{expense.descricao}</strong>
                    <span>{expense.category?.nome || 'Sem categoria'} • {expense.data}</span>
                  </div>
                  <p>{money(expense.valor)}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
