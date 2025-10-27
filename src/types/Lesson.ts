import type { ApiResponse } from "./ApiResult";
import type { UnitResponse } from "./Unit";

export type LessonRequest = {
    title: string;
    description?: string;
    unitId: string;
}

export type LessonResponse = {
    id: string;
    title: string;
    description?: string;
    unit: UnitResponse;
}

export type LessonApiResponse = ApiResponse<LessonResponse[]>;
export type SingleLessonApiResponse = ApiResponse<LessonResponse>;