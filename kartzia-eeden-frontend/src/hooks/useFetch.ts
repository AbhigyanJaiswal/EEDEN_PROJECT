import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoredToken } from '../context/authStore';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>(
  url: string | null,
  options?: Omit<RequestInit, 'signal'>
): UseFetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: !!url,
    error: null,
  });

  // Keep latest options in a ref so they don't re-trigger the effect
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Counter-based refetch so callers can trigger a reload imperatively
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!url) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    // FIX: AbortController — cancels the in-flight request when the component
    // unmounts or url changes, preventing setState on an unmounted component.
    const controller = new AbortController();
    setState({ data: null, isLoading: true, error: null });

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStoredToken() ?? ''}`,
        ...optionsRef.current?.headers,
      },
      ...optionsRef.current,
      signal: controller.signal, // always override signal with ours
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then((data) => {
        // Guard: don't setState if the component already unmounted
        if (!controller.signal.aborted) {
          setState({ data, isLoading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        // Ignore AbortError — it's intentional from our cleanup
        if (controller.signal.aborted) return;
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      });

    // Cleanup: abort the request when component unmounts or url/tick changes
    return () => controller.abort();
  }, [url, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch };
}
