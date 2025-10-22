import { type LessonApiResponse, type LessonRequest, type LessonResponse } from "../types/Lesson";
import apiClient from "../utils/apiClient";

const getAllLessons = async () : Promise<LessonResponse[]> => {
    try {
        const response = await apiClient.get<LessonApiResponse>('/api/lessons');
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch lessons: Invalid response code');
        }
        console.log('Fetched lessons:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
}

const getLessonById = async (id : string) : Promise<LessonResponse> => {
    try {
        const response = await apiClient.get<LessonApiResponse>(`/api/lessons/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch lesson: Invalid response code');
        }
        console.log('Fetched lesson:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error fetching lesson:', error);
        throw error;
    }
}

const createLesson = async (field : LessonRequest) : Promise<LessonResponse> => {
    try {
        const response = await apiClient.post<LessonApiResponse>('/api/lessons', field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create lesson: Invalid response code');
        }
        console.log('Created lesson:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error creating lesson:', error);
        throw error;
    }
}

const updateLesson = async (id : string, field : LessonRequest) : Promise<LessonResponse> => {
    try {
        const response = await apiClient.put<LessonApiResponse>(`/api/lessons/${id}`, field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to update lesson: Invalid response code');
        }
        console.log('Updated lesson:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error updating lesson:', error);
        throw error;
    }
}

const deleteLesson = async (id : string) : Promise<void> => {
    try {
        await apiClient.delete(`/api/lessons/${id}`);
    } catch (error : any) {
        console.error('Error deleting lesson:', error);
        throw error;
    }  
}

export const LESSON_API = {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
}