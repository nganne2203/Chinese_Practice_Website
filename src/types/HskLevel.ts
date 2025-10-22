import type { ApiResponse } from "./ApiResult";

export type HskLevelRequest ={
    name: string;
}

export type HskLevelResponse = {
    id: string;
    name: string;
}

export type HskLevelApiResponse = ApiResponse<HskLevelResponse[]>;