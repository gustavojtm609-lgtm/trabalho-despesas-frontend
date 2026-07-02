import '../styles/components/loading.css';

// Loading visual usado enquanto a API está carregando informações.
export default function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading">
      <span className="spinner" />
      <p>{text}</p>
    </div>
  );
}
