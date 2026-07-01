export const CATEGORIES_REFRESH_EVENT = "categories:refresh"
export const DASHBOARD_REFRESH_EVENT = "dashboard:refresh"
export const PRODUCTS_REFRESH_EVENT = "products:refresh"
export const ROLES_REFRESH_EVENT = "roles:refresh"
export const TRANSACTIONS_REFRESH_EVENT = "transactions:refresh"
export const USERS_REFRESH_EVENT = "users:refresh"

function dispatchRefresh(eventName: string) {
  window.dispatchEvent(new Event(eventName))
}

export function dispatchCategoriesRefresh() {
  dispatchRefresh(CATEGORIES_REFRESH_EVENT)
}

export function dispatchDashboardRefresh() {
  dispatchRefresh(DASHBOARD_REFRESH_EVENT)
}

export function dispatchProductsRefresh() {
  dispatchRefresh(PRODUCTS_REFRESH_EVENT)
}

export function dispatchRolesRefresh() {
  dispatchRefresh(ROLES_REFRESH_EVENT)
}

export function dispatchTransactionsRefresh() {
  dispatchRefresh(TRANSACTIONS_REFRESH_EVENT)
}

export function dispatchUsersRefresh() {
  dispatchRefresh(USERS_REFRESH_EVENT)
}
