import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Layout from '../components/Layout.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Categories from '../pages/Categories.jsx';
import Expenses from '../pages/Expenses.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    // Todas as rotas do projeto ficam centralizadas neste arquivo.
    <Routes>
      {/* Rotas públicas: podem ser acessadas sem login. */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* Rotas protegidas: só aparecem quando existe token salvo no localStorage. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/despesas" element={<Expenses />} />
        </Route>
      </Route>

      {/* Qualquer endereço inexistente cai nesta página. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
