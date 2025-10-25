import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import { ROUTE_PATH } from '../constants/Routes';
import { Spin } from 'antd';
import AdminLayout from './AdminLayout';
import UserLayout from './UserLayout';

export default function ProtectedMainLayout() {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to={ROUTE_PATH.LOGIN} replace />;
    }

    if (isAdmin(user)) {
        return <AdminLayout />;
    } else {
        return <UserLayout />;
    }
}
