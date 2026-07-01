import type { PagedLoadState } from "@/types/load-state"
import type { PagedResponse } from "@/types/pagination"

export type Product = {
  id: number
  name: string
  sku: string
  categoryId: number
  categoryName: string
  subCategoryId: number | null
  subCategoryName: string | null
  totalUnitStock: number
  lowStockThreshold: number
  isLowStock: boolean
  buyPrice: number
  sellPrice: number
  totalUnitInventoryValue: number
  imageUrl: string | null
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type ProductSort =
  | "newest"
  | "stock-low-high"
  | "name-a-z"
  | "sku-a-z"

export type ProductFormValues = {
  name: string
  sku: string
  selectedCategoryName: string
  selectedSubCategoryName: string
  totalUnitStock: string
  lowStockThreshold: string
  buyPrice: string
  sellPrice: string
  imageUrl: string
}

export type PagedProductsResponse = PagedResponse<Product>

export type ProductsLoadState = PagedLoadState<Product, "products">
