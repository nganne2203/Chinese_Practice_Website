import type { ApiResponse } from "./ApiResult";
import type { PermissionResponse } from "./Permission";

export type RoleRequest = {
    name: string;
    description?: string;
    permissions: string[];
}

export type RoleResponse = {
    name: string;
    description?: string;
    permissions: PermissionResponse[];
}

export type RoleApiResponse = ApiResponse<RoleResponse[]>;