import { useState } from 'react';
import { Button, Form, Input, Alert, message, Typography, DatePicker } from 'antd';
import { useNavigate } from 'react-router';
import { AUTH_API } from '../../api/auth';
import type dayjs from 'dayjs';

const { Text, Link } = Typography;

interface RegisterFormData {
  firstName?: string;
  lastName?: string;
  userName: string;
  email: string;
  birthDate?: dayjs.Dayjs;
  password: string;
  confirmPassword: string;
}

export default function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const handleRegister = async (values: RegisterFormData) => {
        setLoading(true);
        setError(null);
        
        try {
            const { confirmPassword, birthDate, ...registerData } = values;
            
            const formattedData = {
                ...registerData,
                birthDate: birthDate ? birthDate.format('DD/MM/YYYY') : undefined
            };
            
            const response = await AUTH_API.register(formattedData);
            
            if (response.code === 1000) {
                message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: RegisterFormData) => {
        clearError();
        await handleRegister(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Form validation failed:', errorInfo);
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Đăng ký tài khoản</h2>
            
            {error && (
                <Alert
                    message="Lỗi đăng ký"
                    description={error}
                    type="error"
                    closable
                    onClose={clearError}
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form
                form={form}
                name="register"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                disabled={loading}
            >
                <Form.Item
                    label="Họ"
                    name="firstName"
                    rules={[
                        { min: 2, message: 'Họ phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập họ của bạn"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập tên của bạn"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập tên đăng nhập"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập địa chỉ email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                >
                    <DatePicker 
                        placeholder="Chọn ngày sinh"
                        size="large"
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password 
                        placeholder="Nhập mật khẩu"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        placeholder="Nhập lại mật khẩu"
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
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Text>Đã có tài khoản? </Text>
                    <Link onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </Form>
        </div>
    );
}