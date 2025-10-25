import React from 'react';
import { Input, Select, Tag, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { KeyOutlined } from '@ant-design/icons';
import { useUserManagement } from '../../hooks/useUserManagement';
import type { User } from '../../types/User';
import { formatDate, parseApiDate } from '../../utils/dateFormatUtils';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const UserManagement: React.FC = () => {
    const {
        users,
        roles,
        loading,
        submitting,
        selectedUser,
        isCreateModalOpen,
        isRoleModalOpen,
        createForm,
        roleForm,
        openCreateModal,
        closeCreateModal,
        handleCreate,
        openRoleModal,
        closeRoleModal,
        handleUpdateRoles,
        handleDelete,
    } = useUserManagement();

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
            render: (date: string) => formatDate(date),
            sorter: (a, b) => {
                const dateA = parseApiDate(a.createdAt);
                const dateB = parseApiDate(b.createdAt);
                return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
            },
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => formatDate(date),
            sorter: (a, b) => {
                const dateA = parseApiDate(a.updatedAt);
                const dateB = parseApiDate(b.updatedAt);
                return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<KeyOutlined />}
                        onClick={() => openRoleModal(record)}
                    >
                        Roles
                    </Button>
                </Space>
            ),
        },
    ];

    const createUserFormFields: FormField[] = [
        {
            name: 'userName',
            label: 'Username',
            component: <Input placeholder="Enter username" />,
            rules: [{ required: true, message: 'Please input username' }],
        },
        {
            name: 'password',
            label: 'Password',
            component: <Input.Password placeholder="Enter password" />,
            rules: [{ required: true, message: 'Please input password' }],
        },
        {
            name: 'email',
            label: 'Email',
            component: <Input placeholder="Enter email" />,
            rules: [
                { required: true, message: 'Please input email' },
                { type: 'email', message: 'Please input valid email' },
            ],
        },
        {
            name: 'firstName',
            label: 'First Name',
            component: <Input placeholder="Enter first name" />,
        },
        {
            name: 'lastName',
            label: 'Last Name',
            component: <Input placeholder="Enter last name" />,
        },
        {
            name: 'birthDate',
            label: 'Birth Date',
            component: <Input type="date" />,
        },
    ];

    const roleFormFields: FormField[] = [
        {
            name: 'roles',
            label: 'Roles',
            component: (
                <Select
                    mode="multiple"
                    placeholder="Select roles"
                    options={roles.map((role) => ({
                        label: role.name,
                        value: role.name,
                    }))}
                />
            ),
            rules: [{ required: true, message: 'Please select at least one role' }],
        },
    ];

    return (
        <div>
            <BaseTable
                title="User Management"
                data={users}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onDelete={handleDelete}
            />

            <BaseModal
                visible={isCreateModalOpen}
                onCancel={closeCreateModal}
                onSubmit={handleCreate}
                title="Create New User"
                formFields={createUserFormFields}
                loading={submitting}
                form={createForm}
            />

            <BaseModal
                visible={isRoleModalOpen}
                onCancel={closeRoleModal}
                onSubmit={handleUpdateRoles}
                title={`Update Roles - ${selectedUser?.userName}`}
                formFields={roleFormFields}
                initialValues={{
                    roles: selectedUser?.roles.map((role) => role.name),
                }}
                loading={submitting}
                width={500}
                form={roleForm}
            />
        </div>
    );
};

export default UserManagement;
