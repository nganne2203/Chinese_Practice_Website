import { useEffect, useState } from 'react';
import { HSK_LEVEL_API } from '../api/hskLevel';
import type { HskLevelResponse } from '../types/HskLevel';

export const useHskLevels = () => {
    const [levels, setLevels] = useState<HskLevelResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLevels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await HSK_LEVEL_API.getAllHSKLevels();
            setLevels(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch HSK levels');
            console.error('Error fetching HSK levels:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    return {
        levels,
        loading,
        error,
        refetch: fetchLevels,
    };
};
