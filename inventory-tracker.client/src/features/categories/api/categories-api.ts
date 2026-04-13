import { request } from "@/lib/http";

export type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
};

export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};

export function getCategories(token: string) {
  return request<Category[]>("/Categories", { token });
}

export function createCategory(token: string, input: { name: string }) {
  return request<Category>("/Categories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function createSubCategory(
  token: string,
  input: { categoryId: string; name: string },
) {
  return request<SubCategory>("/Categories/subcategories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteCategory(token: string, categoryId: string) {
  return request<void>(`/Categories/${categoryId}`, {
    method: "DELETE",
    token,
  });
}

export function deleteSubCategory(token: string, subCategoryId: string) {
  return request<void>(`/Categories/subcategories/${subCategoryId}`, {
    method: "DELETE",
    token,
  });
}
