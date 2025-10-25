import React from 'react';
import { Input, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuizManagement } from '../../hooks/useQuizManagement';
import type { QuizResponse } from '../../types/Quiz';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const QuizManagement: React.FC = () => {
    const {
        quizzes,
        lessons,
        loading,
        submitting,
        editingQuiz,
        selectedLessonId,
        isModalOpen,
        form,
        handleLessonChange,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useQuizManagement();

    const columns: ColumnsType<QuizResponse> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color="cyan">{type}</Tag>,
        },
        {
            title: 'Lesson',
            key: 'lesson',
            render: (_, record) => <Tag color="purple">{record.lesson.title}</Tag>,
        },
        {
            title: 'Created By',
            key: 'createdBy',
            render: (_, record) => record.createdBy.userName,
        },
    ];

    const formFields: FormField[] = [
        {
            name: 'title',
            label: 'Title',
            component: <Input placeholder="Enter quiz title" />,
            rules: [{ required: true, message: 'Please input quiz title' }],
        },
        {
            name: 'type',
            label: 'Type',
            component: (
                <Select
                    placeholder="Select quiz type"
                    options={[
                        { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
                        { label: 'Fill in the Blank', value: 'FILL_IN_BLANK' },
                        { label: 'Matching', value: 'MATCHING' },
                    ]}
                />
            ),
            rules: [{ required: true, message: 'Please select quiz type' }],
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

    const modalInitialValues = editingQuiz ? {
        title: editingQuiz.title,
        type: editingQuiz.type,
        lessonId: editingQuiz.lesson.id,
    } : { lessonId: selectedLessonId };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0, marginBottom: 16 }}>Quiz Management</h2>
                <Select
                    style={{ width: 300 }}
                    placeholder="Select a lesson to view quizzes"
                    onChange={handleLessonChange}
                    value={selectedLessonId}
                    options={lessons.map((lesson) => ({
                        label: `${lesson.title} (${lesson.unit.title})`,
                        value: lesson.id,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </div>

            <BaseTable
                title="Quizzes"
                data={quizzes}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                showCreateButton={!!selectedLessonId}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} quizzes`,
                }}
            />

            <BaseModal
                visible={isModalOpen}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                formFields={formFields}
                initialValues={modalInitialValues}
                loading={submitting}
                form={form}
            />
        </div>
    );
};

export default QuizManagement;
