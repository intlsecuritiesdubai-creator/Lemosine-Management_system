import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../api/client';

export const useApiQuery = <TData = unknown>(key: string[], config: AxiosRequestConfig) =>
  useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.request<TData>(config);
      return data;
    }
  });
