import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Select,
    Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLessons } from '../../hooks/useLessons';
import { QUIZ_API } from '../../api/quiz';
import type { QuizResponse, QuizRequest } from '../../types/Quiz';
import { useAuth } from '../../contexts/AuthContext';

const QuizManagement: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const { lessons } = useLessons();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<QuizResponse | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // TODO: There's no API to get all quizzes, only by lesson
    // For now, we'll show a message to select a lesson first
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    const fetchQuizzesByLesson = async (lessonId: string) => {
        setLoading(true);
        try {
            const data = await QUIZ_API.getQuizByLesson(lessonId);
            setQuizzes(data);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleLessonChange = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        fetchQuizzesByLesson(lessonId);
    };

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
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Quiz"
                        description="Are you sure you want to delete this quiz? This will delete all associated questions."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (quiz: QuizResponse) => {
        setEditingQuiz(quiz);
        form.setFieldsValue({
            title: quiz.title,
            type: quiz.type,
            lessonId: quiz.lesson.id,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: Omit<QuizRequest, 'createdById'>) => {
        if (!user) {
            message.error('User not authenticated');
            return;
        }

        setSubmitting(true);
        try {
            const payload: QuizRequest = {
                ...values,
                createdById: user.id,
            };

            if (editingQuiz) {
                await QUIZ_API.updateQuiz(editingQuiz.id, payload);
                message.success('Quiz updated successfully');
            } else {
                await QUIZ_API.createQuiz(payload);
                message.success('Quiz created successfully');
            }
            setIsModalOpen(false);
            setEditingQuiz(null);
            form.resetFields();

            if (selectedLessonId) {
                fetchQuizzesByLesson(selectedLessonId);
            }
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await QUIZ_API.deleteQuiz(id);
            message.success('Quiz deleted successfully');
            if (selectedLessonId) {
                fetchQuizzesByLesson(selectedLessonId);
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to delete quiz');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Quiz Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedLessonId}
                >
                    Create Quiz
                </Button>
            </div>

            <div style={{ marginBottom: 16 }}>
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

            <Table
                columns={columns}
                dataSource={quizzes}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} quizzes`,
                }}
                locale={{
                    emptyText: selectedLessonId ? 'No quizzes found for this lesson' : 'Please select a lesson first',
                }}
            />

            <Modal
                title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ lessonId: selectedLessonId }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input quiz title' }]}
                    >
                        <Input placeholder="Enter quiz title" />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select quiz type' }]}
                    >
                        <Select
                            placeholder="Select quiz type"
                            options={[
                                { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
                                { label: 'Fill in the Blank', value: 'FILL_IN_BLANK' },
                                { label: 'Matching', value: 'MATCHING' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Lesson"
                        name="lessonId"
                        rules={[{ required: true, message: 'Please select lesson' }]}
                    >
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
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {editingQuiz ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuizManagement;
