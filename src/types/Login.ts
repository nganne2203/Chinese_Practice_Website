export type FieldType = {
  userName?: string;
  password?: string;
}

export type LoginResponse = {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
  };
}

export type JWTPayload = {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  scope: string;
}

export type User = {
  username: string;
  role: string;
  isAuthenticated: boolean;
}
