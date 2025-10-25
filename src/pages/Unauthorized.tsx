import React from 'react';
import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import { ROUTE_PATH } from '../constants/Routes';

const { Text } = Typography;

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        if (user) {
            if (isAdmin(user)) {
                navigate(ROUTE_PATH.ADMIN_DASHBOARD);
            } else {
                navigate(ROUTE_PATH.USER_DASHBOARD);
            }
        } else {
            navigate(ROUTE_PATH.LOGIN);
        }
    };

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                        You don't have the required permissions to view this content.
                    </Text>
                    <Button type="primary" onClick={handleGoBack}>
                        Go to Dashboard
                    </Button>
                </div>
            }
        />
    );
};

export default Unauthorized;