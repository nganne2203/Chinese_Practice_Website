import { useState } from 'react';
import { message, Form } from 'antd';
import { HSK_LEVEL_API } from '../api/hskLevel';
import { useHskLevels } from './useHskLevels';
import type { HskLevelResponse, HskLevelRequest } from '../types/HskLevel';

export const useHskLevelManagement = () => {
    const { levels, loading, refetch } = useHskLevels();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values: HskLevelRequest) => {
        setSubmitting(true);
        try {
            await HSK_LEVEL_API.createHskLevel(values);
            message.success('HSK Level created successfully');
            closeModal();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to create HSK level');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (level: HskLevelResponse) => {
        try {
            await HSK_LEVEL_API.deleteHskLevel(level.id);
            message.success('HSK Level deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete HSK level');
        }
    };

    return {
        levels,
        loading,
        submitting,
        isModalOpen,
        form,
        openCreateModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
};