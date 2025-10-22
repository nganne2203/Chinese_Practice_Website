import { useEffect, useState } from 'react';
import { LESSON_API } from '../api/lesson';
import type { LessonResponse } from '../types/Lesson';

export const useLessons = () => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLessons = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await LESSON_API.getAllLessons();
            setLessons(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch lessons');
            console.error('Error fetching lessons:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    return {
        lessons,
        loading,
        error,
        refetch: fetchLessons,
    };
};
