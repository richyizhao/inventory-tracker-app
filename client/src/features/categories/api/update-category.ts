import { apiRequest } from "@/lib/api"

export function updateCategory(
  {
    id,
    name,
  }: {
    id: number
    name: string
  },
  token: string
) {
  return apiRequest<void>("/categories", {
    method: "PUT",
    body: {
      id,
      name,
    },
    token,
  })
}
