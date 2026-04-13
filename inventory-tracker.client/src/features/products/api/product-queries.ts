import { queryOptions } from "@tanstack/react-query";

import {
  getCategories,
  getProduct,
  getProductTransactions,
  getProducts,
} from "@/features/products/api/products-api";
import { queryKeyFactory } from "@/lib/react-query";

type ProductListParams = {
  page: number;
  limit: number;
  q?: string;
  categoryId?: string;
  subCategoryId?: string;
  sort: string;
};

export const productKeys = {
  all: () => queryKeyFactory(["products"] as const),
  lists: () => queryKeyFactory([...productKeys.all(), "list"] as const),
  list: (params: ProductListParams) =>
    queryKeyFactory([...productKeys.lists(), params] as const),
  categories: () =>
    queryKeyFactory([...productKeys.all(), "categories"] as const),
  details: () => queryKeyFactory([...productKeys.all(), "detail"] as const),
  detail: (productId: string) =>
    queryKeyFactory([...productKeys.details(), productId] as const),
  transactions: (productId: string) =>
    queryKeyFactory([...productKeys.detail(productId), "transactions"] as const),
};

export function getCategoriesQueryOptions(token: string) {
  return queryOptions({
    queryKey: productKeys.categories(),
    queryFn: () => getCategories(token),
  });
}

export function getProductsQueryOptions(
  token: string,
  input: ProductListParams,
) {
  return queryOptions({
    queryKey: productKeys.list(input),
    queryFn: () => getProducts(token, input),
  });
}

export function getProductQueryOptions(token: string, productId: string) {
  return queryOptions({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProduct(token, productId),
  });
}

export function getProductTransactionsQueryOptions(
  token: string,
  productId: string,
) {
  return queryOptions({
    queryKey: productKeys.transactions(productId),
    queryFn: () => getProductTransactions(token, productId),
  });
}
