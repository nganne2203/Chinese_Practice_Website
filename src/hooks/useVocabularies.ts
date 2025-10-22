import { useEffect, useState } from 'react';
import { VOCABULARY__API } from '../api/vocabulary';
import type { VocabularyResponse } from '../types/Vocabulary';

export const useVocabularies = () => {
    const [vocabularies, setVocabularies] = useState<VocabularyResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVocabularies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await VOCABULARY__API.getAllVocabularies();
            setVocabularies(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch vocabularies');
            console.error('Error fetching vocabularies:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVocabularies();
    }, []);

    return {
        vocabularies,
        loading,
        error,
        refetch: fetchVocabularies,
    };
};
