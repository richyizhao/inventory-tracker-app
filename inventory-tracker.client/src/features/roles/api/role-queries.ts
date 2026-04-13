import { queryOptions } from "@tanstack/react-query";

import { getRoles, type Role } from "@/features/roles/api/roles-api";
import { queryKeyFactory } from "@/lib/react-query";

export const roleKeys = {
  all: () => queryKeyFactory(["roles"] as const),
  list: () => queryKeyFactory([...roleKeys.all(), "list"] as const),
};

export function getRolesQueryOptions(token: string) {
  return queryOptions({
    queryKey: roleKeys.list(),
    queryFn: () => getRoles(token),
  });
}

export async function emptyRolesQuery(): Promise<Role[]> {
  return [];
}
