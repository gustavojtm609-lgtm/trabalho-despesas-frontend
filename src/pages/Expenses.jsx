import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';
import api from '../services/api.js';
import '../styles/pages/expenses.css';

const today = new Date().toISOString().slice(0, 10);

const initialForm = {
  descricao: '',
  valor: '',
  data: today,
  status: 'PENDENTE',
  categoriaId: '',
};

const initialFilters = {
  categoria: '',
  status: '',
  dataInicio: '',
  dataFim: '',
  valorMin: '',
  valorMax: '',
};

function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState(initialFilters);
  const [editingId, setEditingId] = useState(null);
  const [sort, setSort] = useState({ field: 'data', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const itemsPerPage = 6;

  // Ordenação local da lista. O usuário pode ordenar por data, valor ou descrição.
  const sortedExpenses = useMemo(() => {
    const ordered = [...expenses];
    ordered.sort((a, b) => {
      const valueA = a[sort.field] || '';
      const valueB = b[sort.field] || '';

      if (sort.field === 'valor') {
        return sort.direction === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }

      return sort.direction === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
    return ordered;
  }, [expenses, sort]);

  // Paginação local para não deixar a tabela grande demais.
  const totalPages = Math.max(Math.ceil(sortedExpenses.length / itemsPerPage), 1);
  const paginatedExpenses = sortedExpenses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const loadCategories = useCallback(async () => {
    const { data } = await api.get('/categories');
    setCategories(data || []);
  }, []);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Remove filtros vazios antes de enviar para o backend.
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );

      const { data } = await api.get('/expenses', { params });
      setExpenses(data?.dados || []);
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.mensagem || err.response?.data?.error || 'Erro ao buscar despesas.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    async function start() {
      try {
        // Carrega categorias e despesas assim que a tela abre.
        await Promise.all([loadCategories(), loadExpenses()]);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar informações iniciais.');
      }
    }

    start();
  }, [loadCategories, loadExpenses]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  function handleEdit(expense) {
    // Quando clica em editar, o formulário recebe os dados da despesa.
    setEditingId(expense.id);
    setForm({
      descricao: expense.descricao || '',
      valor: expense.valor || '',
      data: expense.data || today,
      status: expense.status || 'PENDENTE',
      categoriaId: expense.categoriaId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSort(field) {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.descricao.trim() || !form.valor || !form.categoriaId) {
      setError('Preencha descrição, valor e categoria.');
      return;
    }

    if (Number(form.valor) <= 0) {
      setError('O valor precisa ser maior que zero.');
      return;
    }

    const payload = {
      descricao: form.descricao,
      valor: Number(form.valor),
      data: form.data,
      status: form.status,
      categoriaId: form.categoriaId,
    };

    try {
      setSaving(true);

      // Se editingId existe, atualiza. Caso contrário, cria uma nova despesa.
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        setMessage('Despesa atualizada com sucesso!');
      } else {
        await api.post('/expenses', payload);
        setMessage('Despesa cadastrada com sucesso!');
      }

      resetForm();
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.mensagem || err.response?.data?.error || 'Erro ao salvar despesa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta despesa?');
    if (!confirmDelete) return;

    try {
      setError('');
      setMessage('');
      await api.delete(`/expenses/${id}`);
      setMessage('Despesa excluída com sucesso!');
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.mensagem || err.response?.data?.error || 'Erro ao excluir despesa.');
    }
  }

  return (
    <section className="page expenses-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Controle financeiro</p>
          <h1>Despesas</h1>
          <p>Cadastre, edite, exclua, liste e filtre suas despesas.</p>
        </div>
      </div>

      <Alert type="success" message={message} />
      <Alert type="danger" message={error} />

      <div className="content-grid align-start">
        <article className="card expense-form-card">
          <div className="card-header">
            <h2>{editingId ? 'Editar despesa' : 'Nova despesa'}</h2>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Descrição
              <input name="descricao" placeholder="Ex: Mercado" value={form.descricao} onChange={handleFormChange} />
            </label>

            <div className="form-row">
              <label>
                Valor
                <input type="number" step="0.01" min="0" name="valor" placeholder="0,00" value={form.valor} onChange={handleFormChange} />
              </label>

              <label>
                Data
                <input type="date" name="data" value={form.data} onChange={handleFormChange} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Status
                <select name="status" value={form.status} onChange={handleFormChange}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGA">PAGA</option>
                </select>
              </label>

              <label>
                Categoria
                <select name="categoriaId" value={form.categoriaId} onChange={handleFormChange}>
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nome}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
              </button>
              {editingId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>Cancelar</button>
              )}
            </div>
          </form>
        </article>

        <article className="card expense-filters-card">
          <div className="card-header">
            <h2>Filtros</h2>
          </div>

          <form className="form" onSubmit={(event) => { event.preventDefault(); loadExpenses(); }}>
            <div className="form-row">
              <label>
                Categoria
                <select name="categoria" value={filters.categoria} onChange={handleFilterChange}>
                  <option value="">Todas</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Status
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGA">PAGA</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Data inicial
                <input type="date" name="dataInicio" value={filters.dataInicio} onChange={handleFilterChange} />
              </label>

              <label>
                Data final
                <input type="date" name="dataFim" value={filters.dataFim} onChange={handleFilterChange} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Valor mínimo
                <input type="number" step="0.01" name="valorMin" value={filters.valorMin} onChange={handleFilterChange} />
              </label>

              <label>
                Valor máximo
                <input type="number" step="0.01" name="valorMax" value={filters.valorMax} onChange={handleFilterChange} />
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Filtrar</button>
              <button className="btn btn-ghost" type="button" onClick={resetFilters}>Limpar</button>
            </div>
          </form>
        </article>
      </div>

      <article className="card expense-list-card mt-24">
        <div className="card-header">
          <h2>Lista de despesas</h2>
          <span className="badge">{expenses.length} itens</span>
        </div>

        <div className="sort-actions">
          <button className="btn btn-small" onClick={() => handleSort('data')} type="button">Ordenar por data</button>
          <button className="btn btn-small" onClick={() => handleSort('valor')} type="button">Ordenar por valor</button>
          <button className="btn btn-small" onClick={() => handleSort('descricao')} type="button">Ordenar por descrição</button>
        </div>

        {loading ? (
          <Loading text="Buscando despesas..." />
        ) : paginatedExpenses.length === 0 ? (
          <p className="empty-text">Nenhuma despesa encontrada.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.descricao}</td>
                      <td>{expense.category?.nome || 'Sem categoria'}</td>
                      <td><span className={`status status-${expense.status?.toLowerCase()}`}>{expense.status}</span></td>
                      <td>{expense.data}</td>
                      <td>{money(expense.valor)}</td>
                      <td className="actions-cell">
                        <button className="btn btn-small" onClick={() => handleEdit(expense)} type="button">Editar</button>
                        <button className="btn btn-small btn-danger" onClick={() => handleDelete(expense.id)} type="button">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button className="btn btn-small" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} type="button">Anterior</button>
              <span>Página {page} de {totalPages}</span>
              <button className="btn btn-small" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)} type="button">Próxima</button>
            </div>
          </>
        )}
      </article>
    </section>
  );
}
