import { useCallback, useEffect, useState } from 'react';

// Hook genérico para controlar requisições assíncronas.
// Ele centraliza data, loading e error, evitando repetição de código.
export function useApi(requestFunction, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError('');
        const response = await requestFunction(...params);
        setData(response);
        return response;
      } catch (err) {
        const message = err.response?.data?.mensagem || err.response?.data?.error || 'Erro ao carregar dados.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData, setError };
}
