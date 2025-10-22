import type { ApiResponse } from "./ApiResult";
import type { LessonResponse } from "./Lesson";

export type VocabularyRequest = {
    hanzi: string;
    pinyin: string;
    meaning: string;
    exampleSentence?: string;
    lessonId: string;
}

export type VocabularyResponse = {
    id: string;
    hanzi: string;
    pinyin: string;
    meaning: string;
    exampleSentence?: string;
    lesson: LessonResponse;
}

export type VocabularyApiResponse = ApiResponse<VocabularyResponse[]>;