import { FilterSelect } from "@/components/custom/filter-select"
import { SearchInput } from "@/components/custom/search-input"
import { Toolbar } from "@/components/custom/toolbar"
import {
  ALL_CATEGORIES_FILTER_VALUE,
  ALL_SUB_CATEGORIES_FILTER_VALUE,
} from "@/config/app-config"
import type { Category } from "@/features/categories/types/categories"
import type { ProductSort } from "@/features/products/types/products"

export function ProductsTableToolbar({
  categories,
  search,
  selectedCategoryName,
  selectedSubCategoryKey,
  selectedSort,
  setSearch,
  setSelectedCategoryName,
  setSelectedSubCategoryKey,
  setSelectedSort,
}: {
  categories: Category[]
  search: string
  selectedCategoryName: string
  selectedSubCategoryKey: string
  selectedSort: ProductSort
  setSearch: (value: string) => void
  setSelectedCategoryName: (value: string) => void
  setSelectedSubCategoryKey: (value: string) => void
  setSelectedSort: (value: ProductSort) => void
}) {
  const selectedCategory = categories.find(
    (category) => category.name === selectedCategoryName
  )
  const visibleSubCategories =
    selectedCategoryName === ALL_CATEGORIES_FILTER_VALUE
      ? categories.flatMap((category) =>
          category.subCategories.map((subCategory) => ({
            categoryName: category.name,
            id: subCategory.id,
            name: subCategory.name,
          }))
        )
      : (selectedCategory?.subCategories ?? []).map((subCategory) => ({
          categoryName: selectedCategory?.name ?? "",
          id: subCategory.id,
          name: subCategory.name,
        }))

  return (
    <Toolbar
      search={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search product name or SKU"
        />
      }
      filters={
        <>
          <FilterSelect
          value={selectedCategoryName}
          onChange={setSelectedCategoryName}
          placeholder="Filter by category"
          options={[
            { label: "All categories", value: ALL_CATEGORIES_FILTER_VALUE },
            ...categories.map((category) => ({
              label: category.name,
              value: category.name,
            })),
          ]}
        />
        <FilterSelect
          value={selectedSubCategoryKey}
          onChange={setSelectedSubCategoryKey}
          placeholder="Filter by sub-category"
          triggerClassName="w-full sm:w-56"
          options={[
            {
              label: "All sub-categories",
              value: ALL_SUB_CATEGORIES_FILTER_VALUE,
            },
            ...visibleSubCategories.map((subCategory) => ({
              label: subCategory.name,
              value: `${subCategory.id}:${subCategory.name}`,
            })),
          ]}
        />
        <FilterSelect
          value={selectedSort}
          onChange={(value) => {
            if (
              value === "newest" ||
              value === "stock-low-high" ||
              value === "name-a-z" ||
              value === "sku-a-z"
            ) {
              setSelectedSort(value)
            }
          }}
          placeholder="Sort products"
          triggerClassName="w-full sm:w-52"
          options={[
            { label: "latest created", value: "newest" },
            { label: "stock low to high", value: "stock-low-high" },
            { label: "name A-Z", value: "name-a-z" },
            { label: "SKU A-Z", value: "sku-a-z" },
          ]}
        />
      </>
      }
    />
  )
}
