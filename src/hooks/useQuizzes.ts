import { useState, useEffect } from 'react';
import { QUIZ_API } from '../api/quiz';
import type { QuizDetailResponse } from '../types/Quiz';

export const useQuizzes = () => {
    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await QUIZ_API.getAllQuizzes();
            setQuizzes(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch quizzes');
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    return {
        quizzes,
        loading,
        error,
        refetch: fetchQuizzes,
    };
};