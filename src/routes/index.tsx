import { RouterProvider } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getPublicRoutes } from './PublicRoutes';
import { getProtectedRoutes } from './ProtectedRoutes';
import { Spin } from 'antd';

const AppRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

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

    return (
        <RouterProvider 
            router={isAuthenticated ? getProtectedRoutes : getPublicRoutes} 
        />
    );
};

export default AppRoutes;
