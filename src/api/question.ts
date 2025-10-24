import type { QuestionApiResponse, QuestionRequest, QuestionResponse } from "../types/Question";
import apiClient from "../utils/apiClient";

const deleteQuestion = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/api/quizzes/questions/${id}`);
        console.log('Deleted question with id:', id);
    } catch (error: any) {
        console.error('Error deleting question:', error);
        throw error;
    }
}

const getQuestionById = async (id: string): Promise<QuestionResponse> => {
    try {
        const response = await apiClient.get<QuestionApiResponse>(`/api/quizzes/questions/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch question: Invalid response code');
        }
        return response.data.result[0];
    } catch (error: any) {
        console.error('Error fetching question:', error);
        throw error;
    }
}

const createQuestion = async (field: QuestionRequest, quiId : string): Promise<QuestionResponse> => {
    try {
        const response = await apiClient.post<QuestionApiResponse>(`/api/quizzes/${quiId}/questions`, field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create question: Invalid response code');
        }
        return response.data.result[0];
    } catch (error: any) {
        console.error('Error creating question:', error);
        throw error;
    }
}
const updateQuestion = async (id: string, field: QuestionRequest): Promise<void> => {
    try {
        await apiClient.put(`/api/quizzes/questions/${id}`, field);
        console.log('Updated question with id:', id);
    } catch (error: any) {
        console.error('Error updating question:', error);
        throw error;
    }
}

export const QUESTION_API = {
    deleteQuestion,
    getQuestionById,
    createQuestion,
    updateQuestion
}