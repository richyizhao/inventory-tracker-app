export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roles: string[];
  permissions: string[];
};

export type AuthResponse = {
  token: string;
  expiresAtUtc: string;
  user: AuthUser;
};

export type UpdateProfileInput = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
};
