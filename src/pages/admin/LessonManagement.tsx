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
import { useUnits } from '../../hooks/useUnits';
import { LESSON_API } from '../../api/lesson';
import type { LessonResponse, LessonRequest } from '../../types/Lesson';

const { TextArea } = Input;

const LessonManagement: React.FC = () => {
    const { lessons, loading, refetch } = useLessons();
    const { units } = useUnits();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<LessonResponse | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const columns: ColumnsType<LessonResponse> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc: string) => desc || '-',
        },
        {
            title: 'Unit',
            key: 'unit',
            render: (_, record) => (
                <Tag color="green">
                    {record.unit.title} ({record.unit.level.name})
                </Tag>
            ),
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
                        title="Delete Lesson"
                        description="Are you sure you want to delete this lesson? This will affect all related vocabularies and quizzes."
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

    const handleEdit = (lesson: LessonResponse) => {
        setEditingLesson(lesson);
        form.setFieldsValue({
            title: lesson.title,
            description: lesson.description,
            unitId: lesson.unit.id,
        });
        setIsModalOpen(true);
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
            setIsModalOpen(false);
            setEditingLesson(null);
            form.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingLesson ? 'update' : 'create'} lesson`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await LESSON_API.deleteLesson(id);
            message.success('Lesson deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete lesson');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingLesson(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Lesson Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Lesson
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={lessons}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} lessons`,
                }}
            />

            {/* Create/Edit Lesson Modal */}
            <Modal
                title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input lesson title' }]}
                    >
                        <Input placeholder="Enter lesson title" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter lesson description (optional)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unitId"
                        rules={[{ required: true, message: 'Please select unit' }]}
                    >
                        <Select
                            placeholder="Select unit"
                            options={units.map((unit) => ({
                                label: `${unit.title} (${unit.level.name})`,
                                value: unit.id,
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
                                {editingLesson ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LessonManagement;
