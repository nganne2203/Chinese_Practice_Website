import type { ApiResponse } from "./ApiResult";
import type { RoleResponse } from "./Role";

export type User = {
    id: string;
    userName: string;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    email: string | null;
    roles: RoleResponse[];
    createdAt: string;
    updatedAt: string;
}

export type UserUpdateRoleRequest = {
    roles: string[];
}

export type UserChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
}

export type UserUpdateProfileRequest = {
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
}

export type UserRequest = {
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate?: string;
}

export type UserApiResponse = ApiResponse<User[]>;
export type SingleUserApiResponse = ApiResponse<User>;