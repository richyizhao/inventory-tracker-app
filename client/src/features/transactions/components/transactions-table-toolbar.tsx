import { FilterSelect } from "@/components/common/filter-select"
import { SearchInput } from "@/components/common/search-input"
import { Toolbar } from "@/components/common/toolbar"
import type { TransactionSort } from "@/features/transactions/types/transactions"

export function TransactionsTableToolbar({
  search,
  selectedSort,
  selectedType,
  setSearch,
  setSelectedSort,
  setSelectedType,
}: {
  search: string
  selectedSort: TransactionSort
  selectedType: string
  setSearch: (value: string) => void
  setSelectedSort: (value: TransactionSort) => void
  setSelectedType: (value: string) => void
}) {
  return (
    <Toolbar
      search={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search product, user, or note"
        />
      }
      filters={
        <>
          <FilterSelect
            value={selectedType}
            onChange={setSelectedType}
            placeholder="Filter by type"
            options={[
              { label: "All types", value: "all types" },
              { label: "Stock in", value: "IN" },
              { label: "Stock out", value: "OUT" },
              { label: "Adjustment", value: "ADJUSTMENT" },
            ]}
          />
          <FilterSelect
            value={selectedSort}
            onChange={(value) => {
              if (value === "newest" || value === "updated") {
                setSelectedSort(value)
              }
            }}
            placeholder="Sort transactions"
            options={[
              { label: "latest created", value: "newest" },
              { label: "latest updated", value: "updated" },
            ]}
          />
        </>
      }
    />
  )
}
