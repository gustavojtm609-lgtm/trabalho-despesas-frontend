import { useCallback, useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';
import api from '../services/api.js';
import '../styles/pages/categories.css';

const initialForm = {
  nome: '',
  descricao: '',
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Busca a listagem de categorias no backend.
      const { data } = await api.get('/categories');
      setCategories(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar categorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleEdit(category) {
    // Preenche o formulário com os dados da categoria escolhida.
    setEditingId(category.id);
    setForm({
      nome: category.nome || '',
      descricao: category.descricao || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.nome.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    try {
      setSaving(true);

      // Se editingId existe, atualiza. Caso contrário, cadastra uma nova categoria.
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setMessage('Categoria atualizada com sucesso!');
      } else {
        await api.post('/categories', form);
        setMessage('Categoria cadastrada com sucesso!');
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta categoria?');
    if (!confirmDelete) return;

    try {
      setError('');
      setMessage('');
      await api.delete(`/categories/${id}`);
      setMessage('Categoria excluída com sucesso!');
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível excluir. Verifique se a categoria possui despesas vinculadas.');
    }
  }

  return (
    <section className="page categories-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Organização</p>
          <h1>Categorias</h1>
          <p>Cadastre, edite, exclua e liste categorias de despesas.</p>
        </div>
      </div>

      <Alert type="success" message={message} />
      <Alert type="danger" message={error} />

      <div className="content-grid align-start">
        <article className="card category-form-card">
          <div className="card-header">
            <h2>{editingId ? 'Editar categoria' : 'Nova categoria'}</h2>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Nome da categoria
              <input name="nome" placeholder="Ex: Alimentação" value={form.nome} onChange={handleChange} />
            </label>

            <label>
              Descrição
              <textarea name="descricao" placeholder="Descreva o tipo de gasto" value={form.descricao} onChange={handleChange} />
            </label>

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

        <article className="card category-list-card">
          <div className="card-header">
            <h2>Lista de categorias</h2>
            <span className="badge">{categories.length} itens</span>
          </div>

          {loading ? (
            <Loading text="Buscando categorias..." />
          ) : categories.length === 0 ? (
            <p className="empty-text">Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.nome}</td>
                      <td>{category.descricao || '-'}</td>
                      <td className="actions-cell">
                        <button className="btn btn-small" onClick={() => handleEdit(category)} type="button">Editar</button>
                        <button className="btn btn-small btn-danger" onClick={() => handleDelete(category.id)} type="button">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
