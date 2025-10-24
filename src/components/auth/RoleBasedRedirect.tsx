import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/roleUtils';
import { ROUTE_PATH } from '../../constants/Routes';
import { Spin } from 'antd';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to={ROUTE_PATH.LOGIN} replace />;
  }

  if (isAdmin(user)) {
    return <Navigate to={ROUTE_PATH.ADMIN_DASHBOARD} replace />;
  } else {
    return <Navigate to={ROUTE_PATH.USER_DASHBOARD} replace />;
  }
};

export default RoleBasedRedirect;

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function RequireAdmin({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

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

    if (!user) {
        return <Navigate to={ROUTE_PATH.LOGIN} replace />;
    }

    if (isAdmin(user)) {
        return <>{children}</>;
    } else {
        return <Navigate to={ROUTE_PATH.UNAUTHORIZED} replace />;
    }
}

export function RequireUser({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

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

    if (!user) {
        return <Navigate to={ROUTE_PATH.LOGIN} replace />;
    }

    if (!isAdmin(user)) {
        return <>{children}</>;
    } else {
        return <Navigate to={ROUTE_PATH.UNAUTHORIZED} replace />;
    }
}