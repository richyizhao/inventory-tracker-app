import { mutationOptions } from "@tanstack/react-query";

import {
  changeUserPassword,
  createUser,
  deleteUser,
  updateUserEmail,
  updateUserName,
  updateUserRole,
} from "@/features/users/api/users-api";

export function createUserMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (input: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => createUser(token, input),
  });
}

export function updateUserEmailMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ userId, email }: { userId: string; email: string }) =>
      updateUserEmail(token, userId, { email }),
  });
}

export function updateUserNameMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ userId, name }: { userId: string; name: string }) =>
      updateUserName(token, userId, { name }),
  });
}

export function changeUserPasswordMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => changeUserPassword(token, userId, { newPassword }),
  });
}

export function updateUserRoleMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(token, userId, { role }),
  });
}

export function deleteUserMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ userId }: { userId: string }) => deleteUser(token, userId),
  });
}
