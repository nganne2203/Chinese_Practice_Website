import React from 'react';
import {
    Input,
    Select,
    Tag,
    Space,
    Row,
    Col,
    Card,
    Table,
    Button,
    Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRolePermissionManagement } from '../../hooks/useRolePermissionManagement';
import type { RoleResponse } from '../../types/Role';
import type { PermissionResponse } from '../../types/Permission';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const { TextArea } = Input;

const RolePermissionManagement: React.FC = () => {
    const {
        roles,
        permissions,
        rolesLoading,
        permissionsLoading,
        isRoleModalOpen,
        submittingRole,
        roleForm,
        isPermissionModalOpen,
        submittingPermission,
        permissionForm,
        openRoleModal,
        closeRoleModal,
        handleCreateRole,
        handleDeleteRole,
        openPermissionModal,
        closePermissionModal,
        handleCreatePermission,
        handleDeletePermission,
    } = useRolePermissionManagement();

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
    ];

    const roleFormFields: FormField[] = [
        {
            name: 'name',
            label: 'Role Name',
            component: <Input placeholder="e.g., ADMIN" />,
            rules: [
                { required: true, message: 'Please input role name' },
                { pattern: /^[A-Z_]+$/, message: 'Role name should be uppercase with underscores (e.g., ADMIN, CONTENT_MANAGER)' },
            ],
        },
        {
            name: 'description',
            label: 'Description',
            component: (
                <TextArea
                    rows={3}
                    placeholder="Enter role description (optional)"
                />
            ),
        },
        {
            name: 'permissions',
            label: 'Permissions',
            component: (
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
            ),
            rules: [{ required: true, message: 'Please select at least one permission' }],
        },
    ];

    const permissionFormFields: FormField[] = [
        {
            name: 'name',
            label: 'Permission Name',
            component: <Input placeholder="e.g., READ_USER" />,
            rules: [
                { required: true, message: 'Please input permission name' },
                { pattern: /^[A-Z_]+$/, message: 'Permission name should be uppercase with underscores (e.g., READ_USER, WRITE_CONTENT)' },
            ],
        },
        {
            name: 'description',
            label: 'Description',
            component: (
                <TextArea
                    rows={3}
                    placeholder="Enter permission description (optional)"
                />
            ),
        },
    ];

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
                                onClick={openRoleModal}
                            >
                                Create Role
                            </Button>
                        }
                    >
                        <Table
                            columns={[
                                ...roleColumns,
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Popconfirm
                                            title="Delete Role"
                                            description="Are you sure you want to delete this role? Users with this role will lose access."
                                            onConfirm={() => handleDeleteRole(record)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="link" danger icon={<DeleteOutlined />}>
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
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
                                onClick={openPermissionModal}
                            >
                                Create Permission
                            </Button>
                        }
                    >
                        <Table
                            columns={[
                                ...permissionColumns,
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Popconfirm
                                            title="Delete Permission"
                                            description="Are you sure you want to delete this permission? This will affect all roles using it."
                                            onConfirm={() => handleDeletePermission(record)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="link" danger icon={<DeleteOutlined />}>
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
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
            <BaseModal
                visible={isRoleModalOpen}
                onCancel={closeRoleModal}
                onSubmit={handleCreateRole}
                title="Create New Role"
                formFields={roleFormFields}
                loading={submittingRole}
                form={roleForm}
            />

            <BaseModal
                visible={isPermissionModalOpen}
                onCancel={closePermissionModal}
                onSubmit={handleCreatePermission}
                title="Create New Permission"
                formFields={permissionFormFields}
                loading={submittingPermission}
                form={permissionForm}
            />
        </div>
    );
};

export default RolePermissionManagement;
