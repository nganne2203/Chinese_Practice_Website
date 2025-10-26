import React, { useState } from 'react';
import { Card, Typography, Space, Row, Col, Form, Input, Button, message, Avatar, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import type { UserUpdateProfileRequest } from '../../types/User';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        setEditing(true);
        form.setFieldsValue({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        });
    };

    const handleCancel = () => {
        setEditing(false);
        form.resetFields();
    };

    const handleSave = async (values: UserUpdateProfileRequest) => {
        try {
            setLoading(true);
            // await USER_API.updateProfile(user?.id, values);
            console.log('Updating profile with:', values);
            message.success('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const accountStats = [
        {
            title: 'Member Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
            icon: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
        },
        {
            title: 'Account Status',
            value: 'Active',
            icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
        },
        {
            title: 'Learning Level',
            value: 'HSK 1',
            icon: <UserOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
        },
        {
            title: 'Preferred Language',
            value: 'English',
            icon: <UserOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        My Profile
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Manage your account information and preferences
                    </Text>
                </Card>

                <Row gutter={[16, 16]}>
                    {/* Profile Information */}
                    <Col xs={24} lg={16}>
                        <Card
                            title="Personal Information"
                            extra={
                                !editing ? (
                                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                                        Edit Profile
                                    </Button>
                                ) : null
                            }
                        >
                            {!editing ? (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <Avatar 
                                            size={80} 
                                            style={{ backgroundColor: '#52c41a' }}
                                            icon={<UserOutlined />}
                                        >
                                            {user?.userName?.charAt(0).toUpperCase() || 'U'}
                                        </Avatar>
                                        <div>
                                            <Title level={4} style={{ margin: 0 }}>
                                                {user?.firstName && user?.lastName 
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : user?.userName || 'User'
                                                }
                                            </Title>
                                            <Text type="secondary">Chinese Language Learner</Text>
                                        </div>
                                    </div>

                                    <Divider />

                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div>
                                                <Text strong>First Name</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>{user?.firstName || 'Not provided'}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div>
                                                <Text strong>Last Name</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>{user?.lastName || 'Not provided'}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div>
                                                <Text strong>Username</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>{user?.userName || 'Not provided'}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div>
                                                <Text strong>Email</Text>
                                                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <MailOutlined />
                                                    <Text>{user?.email || 'Not provided'}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div>
                                                <Text strong>Birth Date</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>{user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not provided'}</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Space>
                            ) : (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSave}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="First Name"
                                                name="firstName"
                                                rules={[{ required: true, message: 'Please enter your first name' }]}
                                            >
                                                <Input placeholder="Enter first name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Last Name"
                                                name="lastName"
                                                rules={[{ required: true, message: 'Please enter your last name' }]}
                                            >
                                                <Input placeholder="Enter last name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Birth Date"
                                        name="birthDate"
                                    >
                                        <Input type="date" placeholder="Select birth date" />
                                    </Form.Item>

                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <Button onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading}
                                            icon={<SaveOutlined />}
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Account Details">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {accountStats.map((stat, index) => (
                                    <Card key={index} size="small">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {stat.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {stat.title}
                                                </Text>
                                                <div>
                                                    <Text strong>{stat.value}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </Space>
                        </Card>

                        <Card title="Learning Preferences" style={{ marginTop: 16 }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Study Goal</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary">30 minutes per day</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Focus Area</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary">Vocabulary & Grammar</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Difficulty Level</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary">Beginner (HSK 1)</Text>
                                    </div>
                                </div>
                                <Button type="dashed" block>
                                    Update Preferences
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default UserProfile;