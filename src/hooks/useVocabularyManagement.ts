import { useState } from 'react';
import { message, Form } from 'antd';
import { VOCABULARY__API } from '../api/vocabulary';
import { useVocabularies } from './useVocabularies';
import { useLessons } from './useLessons';
import type { VocabularyResponse, VocabularyRequest } from '../types/Vocabulary';

export const useVocabularyManagement = () => {
    const { vocabularies, loading, refetch } = useVocabularies();
    const { lessons } = useLessons();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVocab, setEditingVocab] = useState<VocabularyResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    const openCreateModal = () => {
        setEditingVocab(null);
        setIsModalOpen(true);
    };

    const openEditModal = (vocab: VocabularyResponse) => {
        setEditingVocab(vocab);
        form.setFieldsValue({
            hanzi: vocab.hanzi,
            pinyin: vocab.pinyin,
            meaning: vocab.meaning,
            exampleSentence: vocab.exampleSentence,
            lessonId: vocab.lesson.id,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVocab(null);
        form.resetFields();
    };

    const handleSubmit = async (values: VocabularyRequest) => {
        setSubmitting(true);
        try {
            if (editingVocab) {
                await VOCABULARY__API.updateVocabulary(editingVocab.id, values);
                message.success('Vocabulary updated successfully');
            } else {
                await VOCABULARY__API.createVocabulary(values);
                message.success('Vocabulary created successfully');
            }
            closeModal();
            refetch();
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingVocab ? 'update' : 'create'} vocabulary`);
            throw error; 
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (vocab: VocabularyResponse) => {
        try {
            await VOCABULARY__API.deleteVocabulary(vocab.id);
            message.success('Vocabulary deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete vocabulary');
        }
    };

    return {
        vocabularies,
        lessons,
        loading,
        submitting,
        editingVocab,
        isModalOpen,
        form,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    };
};