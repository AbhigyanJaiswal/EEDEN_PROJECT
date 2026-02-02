import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>(
  url: string | null,
  options?: RequestInit
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!url) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    setState({ data: null, isLoading: true, error: null });

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
