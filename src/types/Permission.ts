import type { ApiResponse } from "./ApiResult";

export type PermissionRequest = {
    name: string;
    description?: string;
}

export type PermissionResponse = PermissionRequest;

export type PermissionApiResponse = ApiResponse<PermissionResponse[]>;