import { apiRequest } from "@/lib/api"

type CreateProductResponse = {
  id: number
}

export function createProduct(
  request: {
    name: string
    sku: string
    categoryId: number
    subCategoryId?: number
    totalUnitStock: number
    lowStockThreshold: number
    buyPrice: number
    sellPrice: number
    imageUrl?: string
  },
  token: string
) {
  return apiRequest<CreateProductResponse>("/products", {
    method: "POST",
    body: request,
    token,
  })
}
