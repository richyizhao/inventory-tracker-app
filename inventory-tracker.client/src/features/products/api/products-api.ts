import { request } from "@/lib/http";

export type PagedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};

export type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  quantity: number;
  unitCost: number;
  sellingPrice: number;
  inventoryValue: number;
  category: Category;
  subCategory: SubCategory;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  productId: string;
  productName: string;
  type: "In" | "Out" | "Adjustment" | string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  expenseAmount: number;
  totalCost: number;
  userId: string;
  userName: string;
  userEmail: string;
  note: string;
  createdAt: string;
};

export type UploadProductImageResponse = {
  imageUrl: string;
};

function withQuery(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export function getCategories(token: string) {
  return request<Category[]>("/Categories", { token });
}

export function getProducts(
  token: string,
  input: {
    page: number;
    limit: number;
    q?: string;
    categoryId?: string;
    subCategoryId?: string;
    sort: string;
  },
) {
  return request<PagedResult<Product>>(
    withQuery("/Products", {
      page: input.page,
      limit: input.limit,
      q: input.q,
      category_id: input.categoryId,
      sub_category_id: input.subCategoryId,
      sort: input.sort,
    }),
    { token },
  );
}

export function getProduct(token: string, productId: string) {
  return request<Product>(`/Products/${productId}`, { token });
}

export function getProductTransactions(token: string, productId: string) {
  return request<Transaction[]>(`/Products/${productId}/transactions`, {
    token,
  });
}

export function createProduct(
  token: string,
  input: {
    name: string;
    sku: string;
    description: string;
    imageUrl: string;
    subCategoryId: string;
    unitCost: number;
    sellingPrice: number;
  },
) {
  return request<Product>("/Products", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function uploadProductImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request<UploadProductImageResponse>("/Products/upload-image", {
    method: "POST",
    token,
    body: formData,
  });
}

export function updateProduct(
  token: string,
  productId: string,
  input: {
    name: string;
    sku: string;
    description: string;
    imageUrl: string;
    subCategoryId: string;
    unitCost: number;
    sellingPrice: number;
  },
) {
  return request<void>(`/Products/${productId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteProduct(token: string, productId: string) {
  return request<void>(`/Products/${productId}`, {
    method: "DELETE",
    token,
  });
}

export function createTransaction(
  token: string,
  input: {
    productId: string;
    type: "In" | "Out" | "Adjustment";
    quantity: number;
    reason: string;
    note: string;
    unitCost?: number;
    expenseAmount?: number;
  },
) {
  return request<Transaction>("/Transactions", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}
