import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Row, Col, Form, Input, Button, message, Avatar, Divider, Modal } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { USER_API } from '../../api/user';
import type { UserUpdateProfileRequest, UserChangePasswordRequest, User } from '../../types/User';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
    const { user: authUser, updateUser } = useAuth();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const userData = await USER_API.getMyInfo();
            setUserInfo(userData);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setUserInfo(authUser);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        form.setFieldsValue({
            firstName: userInfo?.firstName || '',
            lastName: userInfo?.lastName || '',
            email: userInfo?.email || '',
            birthDate: userInfo?.birthDate ? new Date(userInfo.birthDate).toISOString().split('T')[0] : '',
        });
    };

    const handleCancel = () => {
        setEditing(false);
        form.resetFields();
    };

    const handleSave = async (values: UserUpdateProfileRequest & { birthDate?: string }) => {
        if (!userInfo?.id) {
            message.error('User ID not found');
            return;
        }

        try {
            setLoading(true);
            
            const updateData: UserUpdateProfileRequest = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
            };

            await USER_API.updateUserProfile(userInfo.id, updateData);
            
            const updatedUser = { ...userInfo, ...updateData };
            setUserInfo(updatedUser);
            
            if (updateUser) {
                updateUser(updatedUser);
            }
            
            message.success('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        if (!userInfo?.id) {
            message.error('User ID not found');
            return;
        }

        if (values.newPassword !== values.confirmPassword) {
            message.error('New passwords do not match');
            return;
        }

        try {
            setPasswordLoading(true);
            
            const changePasswordData: UserChangePasswordRequest = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };

            await USER_API.changePassword(userInfo.id, changePasswordData);
            
            message.success('Password changed successfully!');
            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Failed to change password. Please check your current password and try again.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const accountStats = [
        {
            title: 'Member Since',
            value: userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A',
            icon: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
        },
        {
            title: 'Account Status',
            value: 'Active',
            icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
        },
        {
            title: 'User ID',
            value: userInfo?.id ? userInfo.id.substring(0, 8) + '...' : 'N/A',
            icon: <KeyOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
        },
        {
            title: 'Last Updated',
            value: userInfo?.updatedAt ? new Date(userInfo.updatedAt).toLocaleDateString() : 'N/A',
            icon: <EditOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
        },
    ];

    const user = userInfo || authUser;

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
                    <Col xs={24} lg={16}>
                        <Card
                            title="Personal Information"
                            extra={
                                !editing ? (
                                    <Space>
                                        <Button 
                                            icon={<LockOutlined />} 
                                            onClick={() => setPasswordModalVisible(true)}
                                        >
                                            Change Password
                                        </Button>
                                        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                                            Edit Profile
                                        </Button>
                                    </Space>
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
                                        <Col span={12}>
                                            <div>
                                                <Text strong>Roles</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    {user?.roles && user.roles.length > 0 ? (
                                                        <Space wrap>
                                                            {user.roles.map((role, index) => (
                                                                <Text key={index} code>
                                                                    {role.name}
                                                                </Text>
                                                            ))}
                                                        </Space>
                                                    ) : (
                                                        <Text>No roles assigned</Text>
                                                    )}
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
                                <Button type="dashed" block disabled>
                                    Update Preferences (Coming Soon)
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Change Password"
                    open={passwordModalVisible}
                    onCancel={() => {
                        setPasswordModalVisible(false);
                        passwordForm.resetFields();
                    }}
                    footer={null}
                    destroyOnClose
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                    >
                        <Form.Item
                            label="Current Password"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Please enter your current password' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Enter current password" 
                            />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Please enter your new password' },
                                { min: 6, message: 'Password must be at least 6 characters long' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<KeyOutlined />} 
                                placeholder="Enter new password" 
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<KeyOutlined />} 
                                placeholder="Confirm new password" 
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => {
                                    setPasswordModalVisible(false);
                                    passwordForm.resetFields();
                                }}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={passwordLoading}
                                    icon={<SaveOutlined />}
                                >
                                    Change Password
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </div>
    );
};

export default UserProfile;