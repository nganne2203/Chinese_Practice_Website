import type { ApiResponse } from "./ApiResult";
import type { User } from "./User";

export type LoginRequest = {
    userName?: string;
    password?: string;
}

export type RegisterRequest = {
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate?: string;
}

export type RefreshTokenRequest = {
    refreshToken: string;
}

export type IntrospectRequest = {
    accessToken: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
};

export type LoginApiResponse = ApiResponse<LoginResponse>;


export type IntrospectApiResponse = ApiResponse<{
    valid: boolean;
}>

export type RefreshTokenApiResponse = ApiResponse<Omit<LoginResponse, 'user'>>;

export type RegisterApiResponse = ApiResponse<User>;
