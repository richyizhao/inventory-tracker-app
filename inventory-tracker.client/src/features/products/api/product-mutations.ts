import { mutationOptions } from "@tanstack/react-query";

import {
  createProduct,
  createTransaction,
  deleteProduct,
  getProduct,
  type Product,
  type Transaction,
  type UploadProductImageResponse,
  updateProduct,
  uploadProductImage,
} from "@/features/products/api/products-api";

type CreateProductInput = {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  subCategoryId: string;
  unitCost: number;
  sellingPrice: number;
};

type UpdateProductInput = CreateProductInput & {
  productId: string;
};

type DeleteProductInput = {
  productId: string;
};

type CreateTransactionInput = {
  productId: string;
  type: "In" | "Out" | "Adjustment";
  quantity: number;
  reason: string;
  note: string;
  unitCost?: number;
  expenseAmount?: number;
};

export function createProductMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (input: CreateProductInput) => createProduct(token, input),
  });
}

export function uploadProductImageMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (file: File): Promise<UploadProductImageResponse> =>
      uploadProductImage(token, file),
  });
}

export function updateProductMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: async ({
      productId,
      ...input
    }: UpdateProductInput): Promise<Product> => {
      await updateProduct(token, productId, input);
      return getProduct(token, productId);
    },
  });
}

export function deleteProductMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ productId }: DeleteProductInput) =>
      deleteProduct(token, productId),
  });
}

export function createProductTransactionMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (input: CreateTransactionInput): Promise<Transaction> =>
      createTransaction(token, input),
  });
}
