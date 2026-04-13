export function hasRole(roles: string[] | undefined, role: string) {
  return roles?.some((item) => item.toLowerCase() === role.toLowerCase()) ?? false;
}

export function hasAnyRole(roles: string[] | undefined, expected: string[]) {
  return expected.some((role) => hasRole(roles, role));
}

