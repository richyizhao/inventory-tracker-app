import type { Category } from "@/features/categories/types/categories"
import type {
  Product,
  ProductFormValues,
} from "@/features/products/types/products"

export function createEmptyProductFormValues(): ProductFormValues {
  return {
    name: "",
    sku: "",
    selectedCategoryName: "",
    selectedSubCategoryName: "",
    totalUnitStock: "0",
    lowStockThreshold: "0",
    buyPrice: "0",
    sellPrice: "0",
    imageUrl: "",
  }
}

export function createProductFormValuesFromProduct(
  product: Product
): ProductFormValues {
  return {
    name: product.name,
    sku: product.sku,
    selectedCategoryName: product.categoryName,
    selectedSubCategoryName: product.subCategoryName ?? "",
    totalUnitStock: `${product.totalUnitStock}`,
    lowStockThreshold: `${product.lowStockThreshold}`,
    buyPrice: `${product.buyPrice}`,
    sellPrice: `${product.sellPrice}`,
    imageUrl: product.imageUrl ?? "",
  }
}

export function findSelectedCategory({
  categories,
  selectedCategoryName,
}: {
  categories: Category[]
  selectedCategoryName: string
}) {
  return categories.find((category) => category.name === selectedCategoryName)
}

export function findSelectedSubCategory({
  category,
  selectedSubCategoryName,
}: {
  category?: Category
  selectedSubCategoryName: string
}) {
  if (!category || !selectedSubCategoryName) {
    return undefined
  }

  return category.subCategories.find(
    (subCategory) => subCategory.name === selectedSubCategoryName
  )
}
