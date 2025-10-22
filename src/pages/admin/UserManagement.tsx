import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Tag,
    Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { USER_API } from '../../api/user';
import type { User, UserRequest, UserUpdateRoleRequest } from '../../types/User';

const UserManagement: React.FC = () => {
    const { users, loading, refetch } = useUsers();
    const { roles } = useRoles();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [createForm] = Form.useForm();
    const [roleForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const columns: ColumnsType<User> = [
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (_, record) => {
                const fullName = [record.firstName, record.lastName].filter(Boolean).join(' ');
                return fullName || '-';
            },
        },
        {
            title: 'Roles',
            key: 'roles',
            dataIndex: 'roles',
            render: (roles) => (
                <>
                    {roles.map((role: any) => (
                        <Tag color="blue" key={role.name}>
                            {role.name}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<KeyOutlined />}
                        onClick={() => handleOpenRoleModal(record)}
                    >
                        Roles
                    </Button>
                    <Popconfirm
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleOpenRoleModal = (user: User) => {
        setSelectedUser(user);
        roleForm.setFieldsValue({
            roles: user.roles.map((role) => role.name),
        });
        setIsRoleModalOpen(true);
    };

    const handleCreate = async (values: UserRequest) => {
        setSubmitting(true);
        try {
            await USER_API.createUser(values);
            message.success('User created successfully');
            setIsCreateModalOpen(false);
            createForm.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateRoles = async (values: { roles: string[] }) => {
        if (!selectedUser) return;

        setSubmitting(true);
        try {
            const payload: UserUpdateRoleRequest = {
                roles: values.roles,
            };
            await USER_API.updateRoleUser(selectedUser.id, payload);
            message.success('User roles updated successfully');
            setIsRoleModalOpen(false);
            setSelectedUser(null);
            roleForm.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to update user roles');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await USER_API.deleteUser(id);
            message.success('User deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete user');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>User Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} users`,
                }}
            />

            <Modal
                title="Create New User"
                open={isCreateModalOpen}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    createForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[{ required: true, message: 'Please input username' }]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input password' }]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input email' },
                            { type: 'email', message: 'Please input valid email' },
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                    >
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                    >
                        <Input placeholder="Enter last name" />
                    </Form.Item>

                    <Form.Item
                        label="Birth Date"
                        name="birthDate"
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsCreateModalOpen(false);
                                createForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Update Roles - ${selectedUser?.userName}`}
                open={isRoleModalOpen}
                onCancel={() => {
                    setIsRoleModalOpen(false);
                    setSelectedUser(null);
                    roleForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={roleForm}
                    layout="vertical"
                    onFinish={handleUpdateRoles}
                >
                    <Form.Item
                        label="Roles"
                        name="roles"
                        rules={[{ required: true, message: 'Please select at least one role' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select roles"
                            options={roles.map((role) => ({
                                label: role.name,
                                value: role.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsRoleModalOpen(false);
                                setSelectedUser(null);
                                roleForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Update
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
