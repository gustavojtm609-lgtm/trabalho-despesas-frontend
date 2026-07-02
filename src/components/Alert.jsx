import '../styles/components/alert.css';

// Componente simples para mostrar mensagens de sucesso ou erro.
// Se a mensagem vier vazia, ele não renderiza nada na tela.
export default function Alert({ type = 'info', message }) {
  if (!message) return null;

  return <div className={`alert alert-${type}`}>{message}</div>;
}
