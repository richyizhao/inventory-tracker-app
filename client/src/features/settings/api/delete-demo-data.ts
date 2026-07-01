import { apiRequest } from "@/lib/api"

type DeleteDemoDataResponse = {
  message: string
}

export function deleteDemoData(token: string) {
  return apiRequest<DeleteDemoDataResponse>("/settings/demo-data", {
    method: "DELETE",
    token,
  })
}
