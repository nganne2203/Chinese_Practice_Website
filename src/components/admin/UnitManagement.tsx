import React from 'react';
import { Input, InputNumber, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useUnitManagement } from '../../hooks/useUnitManagement';
import type { UnitResponse } from '../../types/Unit';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const UnitManagement: React.FC = () => {
    const {
        units,
        levels,
        loading,
        submitting,
        editingUnit,
        isModalOpen,
        form,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useUnitManagement();

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
    ];

    const formFields: FormField[] = [
        {
            name: 'title',
            label: 'Title',
            component: <Input placeholder="Enter unit title" />,
            rules: [{ required: true, message: 'Please input unit title' }],
        },
        {
            name: 'unitNumber',
            label: 'Unit Number',
            component: (
                <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="Enter unit number"
                />
            ),
            rules: [{ required: true, message: 'Please input unit number' }],
        },
        {
            name: 'levelId',
            label: 'HSK Level',
            component: (
                <Select
                    placeholder="Select HSK level"
                    options={levels.map((level) => ({
                        label: level.name,
                        value: level.id,
                    }))}
                />
            ),
            rules: [{ required: true, message: 'Please select HSK level' }],
        },
    ];

    const modalInitialValues = editingUnit ? {
        title: editingUnit.title,
        unitNumber: editingUnit.unitNumber,
        levelId: editingUnit.level.id,
    } : undefined;

    return (
        <div>
            <BaseTable
                title="Unit Management"
                data={units}
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
                title={editingUnit ? 'Edit Unit' : 'Create New Unit'}
                formFields={formFields}
                initialValues={modalInitialValues}
                loading={submitting}
                form={form}
            />
        </div>
    );
};

export default UnitManagement;
