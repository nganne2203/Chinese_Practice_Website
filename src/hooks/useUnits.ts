import { useEffect, useState } from 'react';
import { UNIT_API } from '../api/unit';
import type { UnitResponse } from '../types/Unit';

export const useUnits = (levelId?: string) => {
    const [units, setUnits] = useState<UnitResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await UNIT_API.getUnits(levelId);
            setUnits(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch units');
            console.error('Error fetching units:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, [levelId]);

    return {
        units,
        loading,
        error,
        refetch: fetchUnits,
    };
};
