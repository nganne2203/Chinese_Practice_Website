import React from 'react';
import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useHskLevelManagement } from '../../hooks/useHskLevelManagement';
import type { HskLevelResponse } from '../../types/HskLevel';
import BaseTable from '../Management/BaseTable';
import BaseModal from '../Management/BaseModal';
import type { FormField } from '../Management/BaseModal';

const LevelManagement: React.FC = () => {
    const {
        levels,
        loading,
        submitting,
        isModalOpen,
        form,
        openCreateModal,
        closeModal,
        handleSubmit,
        handleDelete,
    } = useHskLevelManagement();

    const columns: ColumnsType<HskLevelResponse> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Level Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
    ];

    const formFields: FormField[] = [
        {
            name: 'name',
            label: 'Level Name',
            component: <Input placeholder="Enter HSK level name (e.g., HSK 1)" />,
            rules: [{ required: true, message: 'Please input HSK level name' }],
        },
    ];

    return (
        <div>
            <BaseTable
                title="HSK Level Management"
                data={levels}
                columns={columns}
                loading={loading}
                onCreate={openCreateModal}
                onDelete={handleDelete}
            />

            <BaseModal
                visible={isModalOpen}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                title="Create New HSK Level"
                formFields={formFields}
                loading={submitting}
                form={form}
                width={500}
            />
        </div>
    );
};

export default LevelManagement;