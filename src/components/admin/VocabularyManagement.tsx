import React from 'react';
import { Input, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useVocabularyManagement } from '../../hooks/useVocabularyManagement';
import type { VocabularyResponse } from '../../types/Vocabulary';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const { TextArea } = Input;

const VocabularyManagement: React.FC = () => {
    const {
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
    } = useVocabularyManagement();

    const columns: ColumnsType<VocabularyResponse> = [
        {
            title: 'Hanzi',
            dataIndex: 'hanzi',
            key: 'hanzi',
            sorter: (a, b) => a.hanzi.localeCompare(b.hanzi),
        },
        {
            title: 'Pinyin',
            dataIndex: 'pinyin',
            key: 'pinyin',
        },
        {
            title: 'Meaning',
            dataIndex: 'meaning',
            key: 'meaning',
        },
        {
            title: 'Example Sentence',
            dataIndex: 'exampleSentence',
            key: 'exampleSentence',
            ellipsis: true,
            render: (text: string) => text || '-',
        },
        {
            title: 'Lesson',
            key: 'lesson',
            render: (_, record) => (
                <Tag color="purple">
                    {record.lesson.title}
                </Tag>
            ),
        },
    ];

    const formFields: FormField[] = [
        {
            name: 'hanzi',
            label: 'Hanzi (Chinese Characters)',
            component: <Input placeholder="Enter Chinese characters" />,
            rules: [{ required: true, message: 'Please input hanzi' }],
        },
        {
            name: 'pinyin',
            label: 'Pinyin',
            component: <Input placeholder="Enter pinyin" />,
            rules: [{ required: true, message: 'Please input pinyin' }],
        },
        {
            name: 'meaning',
            label: 'Meaning',
            component: <Input placeholder="Enter English meaning" />,
            rules: [{ required: true, message: 'Please input meaning' }],
        },
        {
            name: 'exampleSentence',
            label: 'Example Sentence',
            component: (
                <TextArea
                    rows={3}
                    placeholder="Enter example sentence (optional)"
                />
            ),
        },
        {
            name: 'lessonId',
            label: 'Lesson',
            component: (
                <Select
                    placeholder="Select lesson"
                    options={lessons.map((lesson) => ({
                        label: `${lesson.title} (${lesson.unit.title})`,
                        value: lesson.id,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            ),
            rules: [{ required: true, message: 'Please select lesson' }],
        },
    ];

    const modalInitialValues = editingVocab ? {
        hanzi: editingVocab.hanzi,
        pinyin: editingVocab.pinyin,
        meaning: editingVocab.meaning,
        exampleSentence: editingVocab.exampleSentence,
        lessonId: editingVocab.lesson.id,
    } : undefined;

    return (
        <div>
            <BaseTable
                title="Vocabulary Management"
                data={vocabularies}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            <BaseModal
                visible={isModalOpen}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                title={editingVocab ? 'Edit Vocabulary' : 'Create New Vocabulary'}
                formFields={formFields}
                initialValues={modalInitialValues}
                loading={submitting}
                form={form}
            />
        </div>
    );
};

export default VocabularyManagement;
