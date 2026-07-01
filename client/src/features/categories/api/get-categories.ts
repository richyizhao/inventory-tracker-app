import { apiRequest } from "@/lib/api"
import type { Category } from "@/features/categories/types/categories"

function compareByName(left: { name: string }, right: { name: string }) {
  return left.name.localeCompare(right.name, undefined, {
    sensitivity: "base",
  })
}

export async function getCategories(token: string) {
  const categories = await apiRequest<Category[]>("/categories", {
    token,
  })

  return [...categories].sort(compareByName).map((category) => ({
    ...category,
    subCategories: [...category.subCategories].sort(compareByName),
  }))
}
