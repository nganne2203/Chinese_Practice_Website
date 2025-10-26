
import type { ApiResponse } from './ApiResult';
import type { LessonResponse } from './Lesson';
import type { QuestionResponse } from './Question';
import type { User } from './User';

export type QuizRequest = {
    title: string;
    type: string;
    lessonId: string;
    createdById: string;
    durationInMinutes: number | null;
    timed: boolean;
    startTime: string | null;
    endTime: string | null;
    attemptLimit: number | null;
}

export type QuizDetailResponse = {
    id: string;
    title: string;
    type: string;
    lesson: LessonResponse;
    createdBy: User;
    durationInMinutes: number | null;
    timed: boolean;
    startTime: string | null;
    endTime: string | null;
    attemptLimit: number | null;
}

export type QuizSubmissionRequest = {
    userId: string;
    answers: Record<string, string>;
}

export type QuizResponse =  QuizDetailResponse& {
    questions: QuestionResponse[];
}

export type QuizResultResponse = {
    score: number;
    totalQuestions: number;
    completedAt: string;
}

export type QuizResultApiResponse = ApiResponse<QuizResultResponse>;

export type QuizApiResponse = ApiResponse<QuizResponse[]>;

export type QuizDetailApiResponse = ApiResponse<QuizDetailResponse[]>;

