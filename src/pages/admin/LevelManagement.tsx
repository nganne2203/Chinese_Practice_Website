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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHskLevels } from '../../hooks/useHskLevels';
import { HSK_LEVEL_API } from '../../api/hskLevel';
import type { HskLevelResponse, HskLevelRequest } from '../../types/HskLevel';

const LevelManagement: React.FC = () => {
    const { levels, loading, refetch } = useHskLevels();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const columns: ColumnsType<HskLevelResponse> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
        },
        {
            title: 'Level Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Popconfirm
                        title="Delete Level"
                        description="Are you sure you want to delete this level? This will affect all related units and lessons."
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

    const handleCreate = async (values: HskLevelRequest) => {
        setSubmitting(true);
        try {
            await HSK_LEVEL_API.createHskLevel(values);
            message.success('HSK Level created successfully');
            setIsModalOpen(false);
            form.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to create HSK level');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await HSK_LEVEL_API.deleteHskLevel(id);
            message.success('HSK Level deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete HSK level');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>HSK Level Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Level
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={levels}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} levels`,
                }}
            />

            <Modal
                title="Create New HSK Level"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        label="Level Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input level name' },
                            { pattern: /^HSK\s?\d$/, message: 'Level name should be in format "HSK 1" or "HSK1"' },
                        ]}
                    >
                        <Input placeholder="e.g., HSK 1" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LevelManagement;
