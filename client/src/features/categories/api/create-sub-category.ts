import { apiRequest } from "@/lib/api"

type CreateSubCategoryResponse = {
  id: number
}

export function createSubCategory(
  {
    categoryId,
    name,
  }: {
    categoryId: number
    name: string
  },
  token: string
) {
  return apiRequest<CreateSubCategoryResponse>("/categories/subcategories", {
    method: "POST",
    body: {
      categoryId,
      name,
    },
    token,
  })
}
