import { queryOptions } from "@tanstack/react-query";

import {
  getRoles,
  getUsers,
  type Role,
  type UserRecord,
} from "@/features/users/api/users-api";
import { queryKeyFactory } from "@/lib/react-query";

export const userKeys = {
  all: () => queryKeyFactory(["users"] as const),
  list: () => queryKeyFactory([...userKeys.all(), "list"] as const),
  roles: () => queryKeyFactory([...userKeys.all(), "roles"] as const),
};

export function getUsersQueryOptions(token: string) {
  return queryOptions({
    queryKey: userKeys.list(),
    queryFn: () => getUsers(token),
  });
}

export function getUserRolesQueryOptions(token: string) {
  return queryOptions({
    queryKey: userKeys.roles(),
    queryFn: () => getRoles(token),
  });
}

export async function emptyUsersQuery(): Promise<UserRecord[]> {
  return [];
}

export async function emptyUserRolesQuery(): Promise<Role[]> {
  return [];
}
