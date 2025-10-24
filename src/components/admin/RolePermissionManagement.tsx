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
    Select,
    Tag,
    Row,
    Col,
    Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRoles } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLE_API } from '../../api/role';
import { PERMISSION_API } from '../../api/permission';
import type { RoleResponse, RoleRequest } from '../../types/Role';
import type { PermissionResponse, PermissionRequest } from '../../types/Permission';

const { TextArea } = Input;

const RolePermissionManagement: React.FC = () => {
    const { roles, loading: rolesLoading, refetch: refetchRoles } = useRoles();
    const { permissions, loading: permissionsLoading, refetch: refetchPermissions } = usePermissions();

    // Role modal states
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleForm] = Form.useForm();
    const [submittingRole, setSubmittingRole] = useState(false);

    // Permission modal states
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionForm] = Form.useForm();
    const [submittingPermission, setSubmittingPermission] = useState(false);

    // Role columns
    const roleColumns: ColumnsType<RoleResponse> = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc: string) => desc || '-',
        },
        {
            title: 'Permissions',
            key: 'permissions',
            dataIndex: 'permissions',
            render: (permissions: PermissionResponse[]) => (
                <Space size={[0, 8]} wrap>
                    {permissions.map((perm) => (
                        <Tag color="blue" key={perm.name}>
                            {perm.name}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Popconfirm
                        title="Delete Role"
                        description="Are you sure you want to delete this role? Users with this role will lose access."
                        onConfirm={() => handleDeleteRole(record.name)}
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

    // Permission columns
    const permissionColumns: ColumnsType<PermissionResponse> = [
        {
            title: 'Permission Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc: string) => desc || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Popconfirm
                        title="Delete Permission"
                        description="Are you sure you want to delete this permission? This will affect all roles using it."
                        onConfirm={() => handleDeletePermission(record.name)}
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

    // Role handlers
    const handleCreateRole = async (values: RoleRequest) => {
        setSubmittingRole(true);
        try {
            await ROLE_API.createRole(values);
            message.success('Role created successfully');
            setIsRoleModalOpen(false);
            roleForm.resetFields();
            refetchRoles();
        } catch (error: any) {
            message.error(error.message || 'Failed to create role');
        } finally {
            setSubmittingRole(false);
        }
    };

    const handleDeleteRole = async (name: string) => {
        try {
            await ROLE_API.deleteRole(name);
            message.success('Role deleted successfully');
            refetchRoles();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete role');
        }
    };

    // Permission handlers
    const handleCreatePermission = async (values: PermissionRequest) => {
        setSubmittingPermission(true);
        try {
            await PERMISSION_API.createPermission(values);
            message.success('Permission created successfully');
            setIsPermissionModalOpen(false);
            permissionForm.resetFields();
            refetchPermissions();
        } catch (error: any) {
            message.error(error.message || 'Failed to create permission');
        } finally {
            setSubmittingPermission(false);
        }
    };

    const handleDeletePermission = async (name: string) => {
        try {
            await PERMISSION_API.deletePermission(name);
            message.success('Permission deleted successfully');
            refetchPermissions();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete permission');
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Role & Permission Management</h2>

            <Row gutter={[24, 24]}>
                {/* Roles Section */}
                <Col xs={24} xl={12}>
                    <Card
                        title="Roles"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsRoleModalOpen(true)}
                            >
                                Create Role
                            </Button>
                        }
                    >
                        <Table
                            columns={roleColumns}
                            dataSource={roles}
                            rowKey="name"
                            loading={rolesLoading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} roles`,
                            }}
                        />
                    </Card>
                </Col>

                {/* Permissions Section */}
                <Col xs={24} xl={12}>
                    <Card
                        title="Permissions"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsPermissionModalOpen(true)}
                            >
                                Create Permission
                            </Button>
                        }
                    >
                        <Table
                            columns={permissionColumns}
                            dataSource={permissions}
                            rowKey="name"
                            loading={permissionsLoading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} permissions`,
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Create Role Modal */}
            <Modal
                title="Create New Role"
                open={isRoleModalOpen}
                onCancel={() => {
                    setIsRoleModalOpen(false);
                    roleForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={roleForm}
                    layout="vertical"
                    onFinish={handleCreateRole}
                >
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input role name' },
                            { pattern: /^[A-Z_]+$/, message: 'Role name should be uppercase with underscores (e.g., ADMIN, CONTENT_MANAGER)' },
                        ]}
                    >
                        <Input placeholder="e.g., ADMIN" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter role description (optional)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Permissions"
                        name="permissions"
                        rules={[{ required: true, message: 'Please select at least one permission' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select permissions"
                            options={permissions.map((perm) => ({
                                label: `${perm.name}${perm.description ? ` - ${perm.description}` : ''}`,
                                value: perm.name,
                            }))}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsRoleModalOpen(false);
                                roleForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submittingRole}>
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Create Permission Modal */}
            <Modal
                title="Create New Permission"
                open={isPermissionModalOpen}
                onCancel={() => {
                    setIsPermissionModalOpen(false);
                    permissionForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={permissionForm}
                    layout="vertical"
                    onFinish={handleCreatePermission}
                >
                    <Form.Item
                        label="Permission Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input permission name' },
                            { pattern: /^[A-Z_]+$/, message: 'Permission name should be uppercase with underscores (e.g., READ_USER, WRITE_CONTENT)' },
                        ]}
                    >
                        <Input placeholder="e.g., READ_USER" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter permission description (optional)"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsPermissionModalOpen(false);
                                permissionForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submittingPermission}>
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RolePermissionManagement;
