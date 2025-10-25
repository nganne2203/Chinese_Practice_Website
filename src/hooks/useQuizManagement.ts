import { useState } from 'react';
import { message, Form } from 'antd';
import { QUIZ_API } from '../api/quiz';
import { useLessons } from './useLessons';
import { useAuth } from '../contexts/AuthContext';
import type { QuizResponse, QuizRequest } from '../types/Quiz';

export const useQuizManagement = () => {
    const { lessons } = useLessons();
    const { user } = useAuth();

    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<QuizResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    const [form] = Form.useForm();

    const fetchQuizzesByLesson = async (lessonId: string) => {
        setLoading(true);
        try {
            const data = await QUIZ_API.getQuizByLesson(lessonId);
            setQuizzes(data);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch quizzes');
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonChange = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        fetchQuizzesByLesson(lessonId);
    };

    const openCreateModal = () => {
        setEditingQuiz(null);
        form.setFieldsValue({ lessonId: selectedLessonId });
        setIsModalOpen(true);
    };

    const openEditModal = (quiz: QuizResponse) => {
        setEditingQuiz(quiz);
        form.setFieldsValue({
            title: quiz.title,
            type: quiz.type,
            lessonId: quiz.lesson.id,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
        form.resetFields();
    };

    const handleSubmit = async (values: Omit<QuizRequest, 'createdById'>) => {
        if (!user) {
            message.error('User not authenticated');
            return;
        }

        setSubmitting(true);
        try {
            const payload: QuizRequest = {
                ...values,
                createdById: user.id,
            };

            if (editingQuiz) {
                await QUIZ_API.updateQuiz(editingQuiz.id, payload);
                message.success('Quiz updated successfully');
            } else {
                await QUIZ_API.createQuiz(payload);
                message.success('Quiz created successfully');
            }

            closeModal();
            if (selectedLessonId) {
                fetchQuizzesByLesson(selectedLessonId);
            }
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (quiz: QuizResponse) => {
        try {
            await QUIZ_API.deleteQuiz(quiz.id);
            message.success('Quiz deleted successfully');
            if (selectedLessonId) {
                fetchQuizzesByLesson(selectedLessonId);
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to delete quiz');
        }
    };

    return {
        quizzes,
        lessons,
        loading,
        submitting,
        editingQuiz,
        selectedLessonId,
        isModalOpen,
        form,
        handleLessonChange,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
};