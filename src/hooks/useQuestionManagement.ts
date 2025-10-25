import { useState } from 'react';
import { message, Form } from 'antd';
import { QUESTION_API } from '../api/question';
import { QUIZ_API } from '../api/quiz';
import { useLessons } from './useLessons';
import type { QuestionResponse, QuestionRequest } from '../types/Question';
import type { QuizResponse } from '../types/Quiz';

export const useQuestionManagement = () => {
    const { lessons } = useLessons();

    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    const [form] = Form.useForm();

    const fetchQuizzesByLesson = async (lessonId: string) => {
        try {
            const data = await QUIZ_API.getQuizByLesson(lessonId);
            setQuizzes(data);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch quizzes');
            setQuizzes([]);
        }
    };

    const fetchQuestionsByQuiz = async (quizId: string) => {
        setLoading(true);
        try {
            const quizDetail = await QUIZ_API.getQuizById(quizId);
            setQuestions(quizDetail.questions || []);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonChange = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setSelectedQuizId(null);
        setQuestions([]);
        fetchQuizzesByLesson(lessonId);
    };

    const handleQuizChange = (quizId: string) => {
        setSelectedQuizId(quizId);
        fetchQuestionsByQuiz(quizId);
    };

    const openCreateModal = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const openEditModal = (question: QuestionResponse) => {
        setEditingQuestion(question);
        form.setFieldsValue({
            questionText: question.questionText,
            answer: question.answer,
            options: question.options,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        form.resetFields();
    };

    const handleSubmit = async (values: QuestionRequest) => {
        setSubmitting(true);
        try {
            if (!selectedQuizId) {
                message.warning('Please select a quiz first');
                return;
            }

            if (editingQuestion) {
                await QUESTION_API.updateQuestion(editingQuestion.id, values);
                message.success('Question updated successfully');
            } else {
                await QUESTION_API.createQuestion(values, selectedQuizId);
                message.success('Question created successfully');
            }

            closeModal();
            fetchQuestionsByQuiz(selectedQuizId);
        } catch (error: any) {
            message.error(error.message || 'Failed to save question');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (question: QuestionResponse) => {
        try {
            await QUESTION_API.deleteQuestion(question.id);
            message.success('Question deleted successfully');
            if (selectedQuizId) fetchQuestionsByQuiz(selectedQuizId);
        } catch (error: any) {
            message.error(error.message || 'Failed to delete question');
        }
    };

    return {
        questions,
        quizzes,
        lessons,
        loading,
        submitting,
        editingQuestion,
        selectedLessonId,
        selectedQuizId,
        isModalOpen,
        form,
        handleLessonChange,
        handleQuizChange,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
};