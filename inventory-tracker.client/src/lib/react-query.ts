import {
  QueryClient,
  type DefaultOptions,
  type QueryKey,
} from "@tanstack/react-query";

import { ApiError } from "@/lib/http";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    retry(failureCount, error) {
      if (error instanceof ApiError && error.status < 500) {
        return false;
      }

      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false,
  },
};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions,
  });
}

export function queryKeyFactory<T extends QueryKey>(key: T) {
  return key;
}
