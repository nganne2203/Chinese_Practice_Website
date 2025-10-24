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
import { useVocabularies } from '../../hooks/useVocabularies';
import { useLessons } from '../../hooks/useLessons';
import { VOCABULARY__API } from '../../api/vocabulary';
import type { VocabularyResponse, VocabularyRequest } from '../../types/Vocabulary';

const { TextArea } = Input;

const VocabularyManagement: React.FC = () => {
    const { vocabularies, loading, refetch } = useVocabularies();
    const { lessons } = useLessons();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVocab, setEditingVocab] = useState<VocabularyResponse | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

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
                        title="Delete Vocabulary"
                        description="Are you sure you want to delete this vocabulary?"
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

    const handleEdit = (vocab: VocabularyResponse) => {
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
            setIsModalOpen(false);
            setEditingVocab(null);
            form.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingVocab ? 'update' : 'create'} vocabulary`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await VOCABULARY__API.deleteVocabulary(id);
            message.success('Vocabulary deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete vocabulary');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingVocab(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Vocabulary Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Vocabulary
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={vocabularies}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} vocabularies`,
                }}
            />

            {/* Create/Edit Vocabulary Modal */}
            <Modal
                title={editingVocab ? 'Edit Vocabulary' : 'Create New Vocabulary'}
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
                        label="Hanzi (Chinese Characters)"
                        name="hanzi"
                        rules={[{ required: true, message: 'Please input hanzi' }]}
                    >
                        <Input placeholder="Enter Chinese characters" />
                    </Form.Item>

                    <Form.Item
                        label="Pinyin"
                        name="pinyin"
                        rules={[{ required: true, message: 'Please input pinyin' }]}
                    >
                        <Input placeholder="Enter pinyin" />
                    </Form.Item>

                    <Form.Item
                        label="Meaning"
                        name="meaning"
                        rules={[{ required: true, message: 'Please input meaning' }]}
                    >
                        <Input placeholder="Enter English meaning" />
                    </Form.Item>

                    <Form.Item
                        label="Example Sentence"
                        name="exampleSentence"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter example sentence (optional)"
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
                                {editingVocab ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VocabularyManagement;
