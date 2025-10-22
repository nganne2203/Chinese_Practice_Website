import type { ApiResponse } from "./ApiResult";
import type { HskLevelResponse } from "./HskLevel";

export type UnitRequest = {
    title: string;
    unitNumber: number;
    levelId: string;
}

export type UnitResponse = {
    id: string;
    title: string;
    unitNumber: number;
    level: HskLevelResponse;
}

export type UnitApiResponse = ApiResponse<UnitResponse[]>;