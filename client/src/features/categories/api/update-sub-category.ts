import { apiRequest } from "@/lib/api"

export function updateSubCategory(
  {
    id,
    categoryId,
    name,
  }: {
    id: number
    categoryId: number
    name: string
  },
  token: string
) {
  return apiRequest<void>("/categories/subcategories", {
    method: "PUT",
    body: {
      id,
      categoryId,
      name,
    },
    token,
  })
}
