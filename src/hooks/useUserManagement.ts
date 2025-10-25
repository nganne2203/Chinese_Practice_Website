import { useState } from 'react';
import { message, Form } from 'antd';
import { USER_API } from '../api/user';
import { useUsers } from './useUsers';
import { useRoles } from './useRoles';
import type { User, UserRequest, UserUpdateRoleRequest } from '../types/User';

export const useUserManagement = () => {
    const { users, loading, refetch } = useUsers();
    const { roles } = useRoles();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [createForm] = Form.useForm();
    const [roleForm] = Form.useForm();

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        createForm.resetFields();
    };

    const handleCreate = async (values: UserRequest) => {
        setSubmitting(true);
        try {
            await USER_API.createUser(values);
            message.success('User created successfully');
            closeCreateModal();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to create user');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        roleForm.setFieldsValue({
            roles: user.roles.map((role) => role.name),
        });
        setIsRoleModalOpen(true);
    };

    const closeRoleModal = () => {
        setIsRoleModalOpen(false);
        setSelectedUser(null);
        roleForm.resetFields();
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
            closeRoleModal();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to update user roles');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user: User) => {
        try {
            await USER_API.deleteUser(user.id);
            message.success('User deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete user');
        }
    };

    return {
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
    };
};