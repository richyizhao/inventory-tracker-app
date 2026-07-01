export type CategorySubCategory = {
  id: number
  name: string
  productCount: number
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type Category = {
  id: number
  name: string
  productCount: number
  createdAtUtc: string
  updatedAtUtc: string | null
  subCategories: CategorySubCategory[]
}
