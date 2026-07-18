import type { UserRole } from '../enums/user-role.enum.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface JwtAccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthUserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResult {
  user: AuthUserResponse;
  token: string;
  expiresIn: string;
}
