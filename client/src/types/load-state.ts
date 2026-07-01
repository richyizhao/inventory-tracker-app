import type { PaginationMeta } from "@/types/pagination"

export type LoadState<TData> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: TData }

export type PagedLoadState<TItem, TKey extends string> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | ({
      status: "success"
    } & PaginationMeta & {
      [key in TKey]: TItem[]
    })
