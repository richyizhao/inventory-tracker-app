import { apiRequest } from "@/lib/api"

type CreateCategoryResponse = {
  id: number
}

export function createCategory(name: string, token: string) {
  return apiRequest<CreateCategoryResponse>("/categories", {
    method: "POST",
    body: { name },
    token,
  })
}
