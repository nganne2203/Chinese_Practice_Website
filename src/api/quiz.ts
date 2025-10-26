import { type QuizApiResponse, type QuizDetailApiResponse, type QuizDetailResponse, type QuizRequest, type QuizResponse, type QuizResultApiResponse, type QuizResultResponse, type QuizSubmissionRequest } from "../types/Quiz";
import apiClient from "../utils/apiClient";

const deleteQuiz = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/api/quizzes/${id}`);
        console.log('Deleted quiz with id:', id);
    } catch (error: any) {
        console.error('Error deleting quiz:', error);
        throw error;
    }
}

const getQuizById = async (id: string): Promise<QuizResponse> => {
    try {
        const response = await apiClient.get<QuizApiResponse>(`/api/quizzes/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch quiz: Invalid response code');
        }
        console.log('Fetched quiz:', response.data.result);
        return response.data.result[0];
    } catch (error: any) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
}

const getAllQuizzes = async ():Promise<QuizDetailResponse[]> => {
    try {
        const response = await apiClient.get<QuizDetailApiResponse>("/api/quizzes");
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch all quizzes: Invalid response code');
        }
        console.log('Fetched all quizzes:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching all quizzes:', error);
        throw error;
    }
}

const getQuizByLesson = async (lessonId: string): Promise<QuizDetailResponse[]> => {
    try {
        const response = await apiClient.get<QuizDetailApiResponse>(`/api/quizzes/lesson/${lessonId}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch quizzes by lesson: Invalid response code');
        }
        console.log('Fetched quizzes by lesson:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching quizzes by lesson:', error);
        throw error;
    }
}

const createQuiz = async (field: QuizRequest): Promise<QuizDetailResponse> => {
    try {
        const response = await apiClient.post<QuizDetailApiResponse>('/api/quizzes', field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create quiz: Invalid response code');
        }
        console.log('Created quiz:', response.data.result);
        return response.data.result[0];
    } catch (error: any) {
        console.error('Error creating quiz:', error);
        throw error;
    }
}

const updateQuiz = async (id: string, field: QuizRequest): Promise<void> => {
    try {
        await apiClient.put(`/api/quizzes/${id}`, field);
        console.log('Updated quiz with id:', id);
    } catch (error: any) {
        console.error('Error updating quiz:', error);
        throw error;
    }
}

const startQuiz = async (quizId : string, userId: string): Promise<void> => {
    try {
        await apiClient.post(`/api/quizzes/${quizId}/start/${userId}`);
        console.log('Started quiz with id:', quizId, 'for user:', userId);
    } catch (error: any) {
        console.error('Error starting quiz:', error);
        throw error;
    }
}

const submitQuiz = async (quizId: string, quizSubmitRequest: QuizSubmissionRequest) : Promise<QuizResultResponse> => {
    try {
        const response = await apiClient.post<QuizResultApiResponse>(`/api/quizzes/${quizId}/submit`, quizSubmitRequest);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to submit quiz: Invalid response code');
        }
        console.log('Submitted quiz result:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.error('Error submitting quiz:', error);
        throw error;
    }
}

export const QUIZ_API = {
    deleteQuiz,
    getQuizById,
    getQuizByLesson,
    createQuiz,
    updateQuiz,
    startQuiz,
    getAllQuizzes,
    submitQuiz
}