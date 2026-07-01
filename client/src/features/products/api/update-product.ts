import { apiRequest } from "@/lib/api"

export function updateProduct(
  request: {
    id: number
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
  return apiRequest<void>("/products", {
    method: "PUT",
    body: request,
    token,
  })
}
