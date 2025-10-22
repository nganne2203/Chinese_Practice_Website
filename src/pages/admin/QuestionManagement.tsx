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
import { QUESTION_API } from '../../api/question';
import type { QuestionResponse, QuestionRequest } from '../../types/Question';
import type { QuizResponse } from '../../types/Quiz';

const QuestionManagement: React.FC = () => {
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const { lessons } = useLessons();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    // Fetch quizzes when lesson is selected
    const fetchQuizzesByLesson = async (lessonId: string) => {
        try {
            const data = await QUIZ_API.getQuizByLesson(lessonId);
            setQuizzes(data);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch quizzes');
        }
    };

    // Fetch questions when quiz is selected
    const fetchQuestionsByQuiz = async (quizId: string) => {
        setLoading(true);
        try {
            const quizDetail = await QUIZ_API.getQuizById(quizId);
            setQuestions(quizDetail.questions || []);
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonChange = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setSelectedQuizId(null);
        setQuestions([]);
        fetchQuizzesByLesson(lessonId);
    };

    const handleQuizChange = (quizId: string) => {
        setSelectedQuizId(quizId);
        fetchQuestionsByQuiz(quizId);
    };

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
                    {options.map((option, index) => (
                        <Tag key={index} color="blue">
                            {option}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record, index)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Question"
                        description="Are you sure you want to delete this question?"
                        onConfirm={() => handleDelete(index)}
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

    const handleEdit = (question: QuestionResponse, index: number) => {
        setEditingQuestion({ ...question, index } as any);
        form.setFieldsValue({
            questionText: question.questionText,
            answer: question.answer,
            options: question.options,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: QuestionRequest) => {
        setSubmitting(true);
        try {
            if (editingQuestion) {
                // Note: Question API doesn't have quiz context, might need adjustment
                await QUESTION_API.updateQuestion((editingQuestion as any).index.toString(), values);
                message.success('Question updated successfully');
            } else {
                await QUESTION_API.createQuestion(values);
                message.success('Question created successfully');
            }
            setIsModalOpen(false);
            setEditingQuestion(null);
            form.resetFields();

            if (selectedQuizId) {
                fetchQuestionsByQuiz(selectedQuizId);
            }
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingQuestion ? 'update' : 'create'} question`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (index: number) => {
        try {
            // Note: API expects question ID, but we only have index from quiz detail
            await QUESTION_API.deleteQuestion(index.toString());
            message.success('Question deleted successfully');
            if (selectedQuizId) {
                fetchQuestionsByQuiz(selectedQuizId);
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to delete question');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Question Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedQuizId}
                >
                    Create Question
                </Button>
            </div>

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

            <Table
                columns={columns}
                dataSource={questions}
                rowKey={(_, index) => `question-${index}`}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} questions`,
                }}
                locale={{
                    emptyText: selectedQuizId ? 'No questions found for this quiz' : 'Please select a lesson and quiz first',
                }}
            />

            {/* Create/Edit Question Modal */}
            <Modal
                title={editingQuestion ? 'Edit Question' : 'Create New Question'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Question Text"
                        name="questionText"
                        rules={[{ required: true, message: 'Please input question text' }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter question text"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Answer"
                        name="answer"
                        rules={[{ required: true, message: 'Please input correct answer' }]}
                    >
                        <Input placeholder="Enter correct answer" />
                    </Form.Item>

                    <Form.Item
                        label="Options"
                        name="options"
                        rules={[
                            { required: true, message: 'Please add options' },
                            { type: 'array', min: 2, message: 'Please add at least 2 options' },
                        ]}
                        tooltip="Add all possible answer options including the correct answer"
                    >
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Type and press Enter to add options"
                            tokenSeparators={[',']}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {editingQuestion ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionManagement;
