import type { ApiResponse } from "./ApiResult";

export type QuestionRequest = {
    questionText: string;
    answer: string;
    options: string[];
}

export type QuestionResponse = QuestionRequest;

export type QuestionApiResponse = ApiResponse<QuestionResponse[]>;
