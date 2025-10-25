import React from 'react';
import { Input, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLessonManagement } from '../../hooks/useLessonManagement';
import type { LessonResponse } from '../../types/Lesson';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const { TextArea } = Input;

const LessonManagement: React.FC = () => {
    const {
        lessons,
        units,
        loading,
        submitting,
        editingLesson,
        isModalOpen,
        form,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useLessonManagement();

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
            render: (desc: string) => desc || '-',
            ellipsis: true,
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
    ];

    const formFields: FormField[] = [
        {
            name: 'title',
            label: 'Title',
            component: <Input placeholder="Enter lesson title" />,
            rules: [{ required: true, message: 'Please input lesson title' }],
        },
        {
            name: 'description',
            label: 'Description',
            component: (
                <TextArea
                    rows={3}
                    placeholder="Enter lesson description (optional)"
                />
            ),
        },
        {
            name: 'unitId',
            label: 'Unit',
            component: (
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
            ),
            rules: [{ required: true, message: 'Please select unit' }],
        },
    ];

    const modalInitialValues = editingLesson ? {
        title: editingLesson.title,
        description: editingLesson.description,
        unitId: editingLesson.unit.id,
    } : undefined;

    return (
        <div>
            <BaseTable
                title="Lesson Management"
                data={lessons}
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
                title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                formFields={formFields}
                initialValues={modalInitialValues}
                loading={submitting}
                form={form}
            />
        </div>
    );
};

export default LessonManagement;
