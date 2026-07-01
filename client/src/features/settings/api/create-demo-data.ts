import { apiRequest } from "@/lib/api"

type CreateDemoDataResponse = {
  message: string
}

export function createDemoData(token: string) {
  return apiRequest<CreateDemoDataResponse>("/settings/demo-data", {
    method: "POST",
    token,
  })
}
