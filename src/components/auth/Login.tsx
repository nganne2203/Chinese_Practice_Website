import type { FormProps } from 'antd';
import { Button, Form, Input, Alert, message, Typography } from 'antd';
import type { LoginRequest } from '../../types/Authentication';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useLogin from '../../hooks/useLogin';
import { useNavigate } from 'react-router';
import { isAdmin } from '../../utils/roleUtils';

const { Text, Link } = Typography;

export default function LoginComponent() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { 
        loginData, 
        setLoginData, 
        handleLogin, 
        loading, 
        error, 
        clearError 
    } = useLogin();
    
    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('Logged in user:', user);
            console.log('User roles:', user.roles);
            console.log('Is admin?', isAdmin(user));
            
            message.success('Login successful!');
            
            if (isAdmin(user)) {
                console.log('Redirecting to admin dashboard');
                navigate('/admin/dashboard');
            } else {
                console.log('Redirecting to user dashboard');
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const onFinish: FormProps<LoginRequest>['onFinish'] = async (values) => {
        clearError();
        setLoginData(values);
        
        await handleLogin();
    };

    const onFinishFailed: FormProps<LoginRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Form validation failed:', errorInfo);
    };

    const onValuesChange = (_changedValues: Partial<LoginRequest>, allValues: LoginRequest) => {
        setLoginData(allValues);
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
            
            {error && (
                <Alert
                    message="Login Error"
                    description={error}
                    type="error"
                    closable
                    onClose={clearError}
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form
                form={form}
                name="login"
                layout="vertical"
                initialValues={{ 
                    userName: loginData.userName || '', 
                    password: loginData.password || '' 
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={onValuesChange}
                autoComplete="off"
                disabled={loading}
            >
                <Form.Item<LoginRequest>
                    label="Username"
                    name="userName"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be at least 3 characters long!' }
                    ]}
                >
                    <Input 
                        placeholder="Enter your username"
                        size="large"
                    />
                </Form.Item>

                <Form.Item<LoginRequest>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' }
                    ]}
                >
                    <Input.Password 
                        placeholder="Enter your password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Text>Chưa có tài khoản? </Text>
                    <Link onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
                        Đăng ký ngay
                    </Link>
                </div>
            </Form>
        </div>
    );
}
