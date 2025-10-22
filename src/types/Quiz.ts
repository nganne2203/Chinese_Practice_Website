
import type { ApiResponse } from './ApiResult';
import type { LessonResponse } from './Lesson';
import type { QuestionResponse } from './Question';
import type { User } from './User';

export type QuizRequest = {
    title: string;
    type: string;
    lessonId: string;
    createdById: string;
}

export type QuizResponse = {
    id: string;
    title: string;
    type: string;
    lesson: LessonResponse;
    createdBy: User;
}

export type QuizDetailResponse = QuizResponse & {
    questions: QuestionResponse[];
}

export type QuizApiResponse = ApiResponse<QuizResponse[]>;

export type QuizDetailApiResponse = ApiResponse<QuizDetailResponse>;