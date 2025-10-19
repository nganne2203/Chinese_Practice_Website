import type { FormProps } from 'antd';
import { Button, Form, Input, Alert, message } from 'antd';
import type { LoginRequest } from '../../types/Authentication';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useLogin from '../../hooks/useLogin';
import { useNavigate } from 'react-router';

export default function Login() {
    const { isAuthenticated } = useAuth();
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
        if (isAuthenticated) {
            message.success('Login successful!');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

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
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem'}}>
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
            </Form>
        </div>
    );
}
