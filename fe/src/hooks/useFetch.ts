
import { useCallback, useEffect, useState } from "react";

export interface FetchOptions {
  autoCall?: boolean;
}

export interface FetchReturnType<T> {
  data: T | null;
  loading: boolean;
  error: { message: string } | null;
  initialized: boolean;
  refresh: () => Promise<void>;
  update: (data: Partial<T> | null) => void;
}

// Sửa type của useFetch để nhận một hàm fetch thay vì URL
export const useFetch = <T>(fetcher: () => Promise<T>, options?: FetchOptions): FetchReturnType<T> => {
  const { autoCall = true } = options || {};
  const [data, setData] = useState<T | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string } | null>(null);



  const fetch = useCallback(async () => {

    setLoading(true);
    try {
      const res = await fetcher();
      setData(res);
      setError(null);
      setInitialized(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setData(null);
      setError({ message: error?.response?.data?.message || error?.message });
    }
    setLoading(false);
  }, [fetcher]);

  const update: FetchReturnType<T>["update"] = useCallback(async (newData) => {
    if (newData) return setData((data) => (data ? { ...data, ...newData } : (newData as T)));
    setData(null);
  }, []);

  useEffect(() => {
    if (autoCall) fetch();
  }, [fetch, autoCall]);

  return { data, loading, error, initialized, refresh: fetch, update };
};

export default useFetch;
