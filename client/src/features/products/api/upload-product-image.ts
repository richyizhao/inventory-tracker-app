import { apiRequest } from "@/lib/api"

type UploadProductImageResponse = {
  imageUrl: string
}

export function uploadProductImage(file: File, token: string) {
  const formData = new FormData()
  formData.append("image", file)

  return apiRequest<UploadProductImageResponse>("/products/image", {
    method: "POST",
    body: formData,
    token,
  })
}
