import { useState } from 'react';
import { message, Form } from 'antd';
import { LESSON_API } from '../api/lesson';
import { useLessons } from './useLessons';
import { useUnits } from './useUnits';
import type { LessonResponse, LessonRequest } from '../types/Lesson';

export const useLessonManagement = () => {
    const { lessons, loading, refetch } = useLessons();
    const { units } = useUnits();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<LessonResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    const openCreateModal = () => {
        setEditingLesson(null);
        setIsModalOpen(true);
    };

    const openEditModal = (lesson: LessonResponse) => {
        setEditingLesson(lesson);
        form.setFieldsValue({
            title: lesson.title,
            description: lesson.description,
            unitId: lesson.unit.id,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLesson(null);
        form.resetFields();
    };

    const handleSubmit = async (values: LessonRequest) => {
        setSubmitting(true);
        try {
            if (editingLesson) {
                await LESSON_API.updateLesson(editingLesson.id, values);
                message.success('Lesson updated successfully');
            } else {
                await LESSON_API.createLesson(values);
                message.success('Lesson created successfully');
            }
            closeModal();
            refetch();
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingLesson ? 'update' : 'create'} lesson`);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (lesson: LessonResponse) => {
        try {
            await LESSON_API.deleteLesson(lesson.id);
            message.success('Lesson deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete lesson');
        }
    };

    return {
        lessons,
        units,
        loading,
        submitting,
        editingLesson,
        isModalOpen,
        form,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
};