import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Select,
    Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUnits } from '../../hooks/useUnits';
import { useHskLevels } from '../../hooks/useHskLevels';
import { UNIT_API } from '../../api/unit';
import type { UnitResponse, UnitRequest } from '../../types/Unit';

const UnitManagement: React.FC = () => {
    const { units, loading, refetch } = useUnits();
    const { levels } = useHskLevels();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitResponse | null>(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const columns: ColumnsType<UnitResponse> = [
        {
            title: 'Unit Number',
            dataIndex: 'unitNumber',
            key: 'unitNumber',
            sorter: (a, b) => a.unitNumber - b.unitNumber,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'HSK Level',
            key: 'level',
            dataIndex: ['level', 'name'],
            render: (levelName: string) => <Tag color="blue">{levelName}</Tag>,
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
                        title="Delete Unit"
                        description="Are you sure you want to delete this unit? This will affect all related lessons."
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

    const handleEdit = (unit: UnitResponse) => {
        setEditingUnit(unit);
        form.setFieldsValue({
            title: unit.title,
            unitNumber: unit.unitNumber,
            levelId: unit.level.id,
        });
        setIsModalOpen(true);
    };

    const handleCreate = async (values: UnitRequest) => {
        setSubmitting(true);
        try {
            if (editingUnit) {
                await UNIT_API.updateUnit(editingUnit.id, values);
                message.success('Unit updated successfully');
            } else {
                await UNIT_API.createUnit(values);
                message.success('Unit created successfully');
            }
            setIsModalOpen(false);
            setEditingUnit(null);
            form.resetFields();
            refetch();
        } catch (error: any) {
            message.error(error.message || `Failed to ${editingUnit ? 'update' : 'create'} unit`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await UNIT_API.deleteUnit(id);
            message.success('Unit deleted successfully');
            refetch();
        } catch (error: any) {
            message.error(error.message || 'Failed to delete unit');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingUnit(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Unit Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Unit
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={units}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} units`,
                }}
            />

            <Modal
                title={editingUnit ? 'Edit Unit' : 'Create New Unit'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input unit title' }]}
                    >
                        <Input placeholder="Enter unit title" />
                    </Form.Item>

                    <Form.Item
                        label="Unit Number"
                        name="unitNumber"
                        rules={[{ required: true, message: 'Please input unit number' }]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="Enter unit number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="HSK Level"
                        name="levelId"
                        rules={[{ required: true, message: 'Please select HSK level' }]}
                    >
                        <Select
                            placeholder="Select HSK level"
                            options={levels.map((level) => ({
                                label: level.name,
                                value: level.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {editingUnit ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UnitManagement;
