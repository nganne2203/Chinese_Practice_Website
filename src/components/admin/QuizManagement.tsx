import React from 'react';
import { Input, Select, Tag, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuizManagement } from '../../hooks/useQuizManagement';
import type { QuizDetailResponse } from '../../types/Quiz';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';
import { createTimeValidator } from '../../validator/timeValidator';

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
        safeDateConversion
    } = useQuizManagement();

    const columns: ColumnsType<QuizDetailResponse> = [
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
        {
            name: 'durationInMinutes',
            label: 'Duration (minutes)',
            component: <Input type="number" placeholder="Enter duration in minutes" />,
            rules: [{ required: true, message: 'Please input duration in minutes' }],
        },
        {
            name: 'timed',
            label: 'Timed',
            component: (<Select
                placeholder="Is the quiz timed?"
                options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                ]}
            />),
            rules: [{ required: true, message: 'Please select if the quiz is timed' }],
        },
        {
            name: 'startTime',
            label: 'Start Time',
            component: <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select start time" />,
            dependencies: ['timed'],
            shouldRender: (values) => values.timed === true,
            rules: [createTimeValidator('start')],
        },
        {
            name: 'endTime',
            label: 'End Time',
            component: <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select end time" />,
            dependencies: ['timed', 'startTime'],
            shouldRender: (values) => values.timed === true,
            rules: [createTimeValidator('end')],
        },
        {
            name: 'attemptLimit',
            label: 'Attempt Limit',
            component: <Input type="number" placeholder="Enter attempt limit" />,
            rules: [{ required: false }],
        }
    ];

    const modalInitialValues = editingQuiz ? {
        title: editingQuiz.title,
        type: editingQuiz.type,
        lessonId: editingQuiz.lesson.id,
        durationInMinutes: editingQuiz.durationInMinutes,
        timed: editingQuiz.timed,
        startTime: safeDateConversion(editingQuiz.startTime),
        endTime: safeDateConversion(editingQuiz.endTime),
        attemptLimit: editingQuiz.attemptLimit,
    } : { lessonId: selectedLessonId };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0, marginBottom: 16 }}>Quiz Management</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Select a lesson to filter quizzes"
                        onChange={handleLessonChange}
                        value={selectedLessonId}
                        allowClear
                        options={lessons.map((lesson) => ({
                            label: `${lesson.title} (${lesson.unit.title})`,
                            value: lesson.id,
                        }))}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    {selectedLessonId && (
                        <span style={{ lineHeight: '32px', color: '#666', fontSize: '14px' }}>
                            Showing quizzes for selected lesson
                        </span>
                    )}
                    {!selectedLessonId && (
                        <span style={{ lineHeight: '32px', color: '#666', fontSize: '14px' }}>
                            Showing all quizzes
                        </span>
                    )}
                </div>
            </div>

            <BaseTable
                title="Quizzes"
                data={quizzes}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                showCreateButton={true}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} quizzes`,
                }}
            />

            <BaseModal
                key={editingQuiz ? `edit-${editingQuiz.id}` : 'create'}
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
