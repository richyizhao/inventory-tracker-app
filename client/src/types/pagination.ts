export type PagedResponse<TItem> = {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type PaginationMeta = {
  page: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
