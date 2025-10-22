import { useEffect, useState } from 'react';
import { ROLE_API } from '../api/role';
import type { RoleResponse } from '../types/Role';

export const useRoles = () => {
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ROLE_API.getRoles();
            setRoles(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch roles');
            console.error('Error fetching roles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return {
        roles,
        loading,
        error,
        refetch: fetchRoles,
    };
};
