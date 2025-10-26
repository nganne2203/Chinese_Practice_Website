import { useState, useEffect } from 'react';
import { message, Form } from 'antd';
import { QUIZ_API } from '../api/quiz';
import { useLessons } from './useLessons';
import { useAuth } from '../contexts/AuthContext';
import type { QuizRequest, QuizDetailResponse } from '../types/Quiz';
import dayjs from 'dayjs';

export const useQuizManagement = () => {
    const { lessons } = useLessons();
    const { user } = useAuth();

    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<QuizDetailResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchAllQuizzes();
    }, []);

    const fetchAllQuizzes = async () => {
        setLoading(true);
        try {
            const data = await QUIZ_API.getAllQuizzes();
            setQuizzes(data);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch quizzes');
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

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


    const safeDateConversion = (dateString: string | null): dayjs.Dayjs | null => {
        if (!dateString || dateString === '') {
            return null;
        }

        try {
            const date = dayjs(dateString);
            return date.isValid() ? date : null;
        } catch {
            return null;
        }
    };

    const handleLessonChange = (lessonId: string | null) => {
        setSelectedLessonId(lessonId);
        if (lessonId) {
            fetchQuizzesByLesson(lessonId);
        } else {
            fetchAllQuizzes();
        }
    };

    const openCreateModal = () => {
        setEditingQuiz(null);
        form.setFieldsValue({ lessonId: selectedLessonId });
        setIsModalOpen(true);
    };

    const openEditModal = (quiz: QuizDetailResponse) => {
        setEditingQuiz(quiz);
        form.setFieldsValue({
            title: quiz.title,
            type: quiz.type,
            lessonId: quiz.lesson.id,
            durationInMinutes: quiz.durationInMinutes,
            timed: quiz.timed,
            startTime: quiz.startTime ? quiz.startTime.replace('Z', '') : null,
            endTime: quiz.endTime ? quiz.endTime.replace('Z', '') : null,
            attemptLimit: quiz.attemptLimit,
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
            const processedValues = { ...values };
            if (!values.timed) {
                processedValues.startTime = null;
                processedValues.endTime = null;
            }

            const payload: QuizRequest = {
                ...processedValues,
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
            } else {
                fetchAllQuizzes();
            }
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (quiz: QuizDetailResponse) => {
        try {
            await QUIZ_API.deleteQuiz(quiz.id);
            message.success('Quiz deleted successfully');
            if (selectedLessonId) {
                fetchQuizzesByLesson(selectedLessonId);
            } else {
                fetchAllQuizzes();
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
        safeDateConversion,
        fetchAllQuizzes
    };
};