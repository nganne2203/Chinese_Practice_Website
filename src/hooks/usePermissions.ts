import { useEffect, useState } from 'react';
import { PERMISSION_API } from '../api/permission';
import type { PermissionResponse } from '../types/Permission';

export const usePermissions = () => {
    const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await PERMISSION_API.getPermission();
            setPermissions(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch permissions');
            console.error('Error fetching permissions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        permissions,
        loading,
        error,
        refetch: fetchPermissions,
    };
};
