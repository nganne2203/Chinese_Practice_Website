import React from 'react';
import { Input, Select, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuestionManagement } from '../../hooks/useQuestionManagement';
import type { QuestionResponse } from '../../types/Question';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const QuestionManagement: React.FC = () => {
    const {
        questions,
        quizzes,
        lessons,
        loading,
        submitting,
        editingQuestion,
        selectedLessonId,
        selectedQuizId,
        isModalOpen,
        form,
        handleLessonChange,
        handleQuizChange,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useQuestionManagement();

    const columns: ColumnsType<QuestionResponse> = [
        {
            title: 'Question Text',
            dataIndex: 'questionText',
            key: 'questionText',
            ellipsis: true,
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
            render: (answer: string) => <Tag color="green">{answer}</Tag>,
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            render: (options: string[]) => (
                <Space size={[0, 8]} wrap>
                    {options.map((option, i) => (
                        <Tag key={i} color="blue">
                            {option}
                        </Tag>
                    ))}
                </Space>
            ),
        },
    ];

    const formFields: FormField[] = [
        {
            name: 'questionText',
            label: 'Question Text',
            component: <Input.TextArea rows={3} placeholder="Enter question text" />,
            rules: [{ required: true, message: 'Please input question text' }],
        },
        {
            name: 'answer',
            label: 'Answer',
            component: <Input placeholder="Enter correct answer" />,
            rules: [{ required: true, message: 'Please input correct answer' }],
        },
        {
            name: 'options',
            label: 'Options',
            component: (
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Type and press Enter to add options"
                    tokenSeparators={[',']}
                />
            ),
            rules: [
                { required: true, message: 'Please add options' },
                { type: 'array', min: 2, message: 'Please add at least 2 options' },
            ],
        },
    ];

    const modalInitialValues = editingQuestion ? {
        questionText: editingQuestion.questionText,
        answer: editingQuestion.answer,
        options: editingQuestion.options,
    } : undefined;

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Question Management</h2>

            <Space style={{ marginBottom: 16 }} size="middle">
                <Select
                    style={{ width: 250 }}
                    placeholder="1. Select a lesson"
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
                <Select
                    style={{ width: 250 }}
                    placeholder="2. Select a quiz"
                    onChange={handleQuizChange}
                    value={selectedQuizId}
                    disabled={!selectedLessonId}
                    options={quizzes.map((quiz) => ({
                        label: quiz.title,
                        value: quiz.id,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Space>

            <BaseTable<QuestionResponse>
                title="Questions"
                data={questions}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                showCreateButton={!!selectedQuizId}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (t) => `Total ${t} questions`,
                }}
            />

            <BaseModal
                visible={isModalOpen}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                title={editingQuestion ? 'Edit Question' : 'Create New Question'}
                formFields={formFields}
                initialValues={modalInitialValues}
                loading={submitting}
                form={form}
                width={700}
            />
        </div>
    );
};

export default QuestionManagement;
