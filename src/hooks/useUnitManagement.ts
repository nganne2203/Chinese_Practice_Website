import { useState } from 'react';
import { message, Form } from 'antd';
import { UNIT_API } from '../api/unit';
import { useUnits } from './useUnits';
import { useHskLevels } from './useHskLevels';
import type { UnitResponse, UnitRequest } from '../types/Unit';

export const useUnitManagement = () => {
  const { units, loading, refetch } = useUnits();
  const { levels } = useHskLevels();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [form] = Form.useForm();

  const openCreateModal = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (unit: UnitResponse) => {
    setEditingUnit(unit);
    form.setFieldsValue({
      title: unit.title,
      unitNumber: unit.unitNumber,
      levelId: unit.level.id,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    form.resetFields();
  };

  const handleSubmit = async (values: UnitRequest) => {
    setSubmitting(true);
    try {
      if (editingUnit) {
        await UNIT_API.updateUnit(editingUnit.id, values);
        message.success('Unit updated successfully');
      } else {
        await UNIT_API.createUnit(values);
        message.success('Unit created successfully');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      message.error(error.message || `Failed to ${editingUnit ? 'update' : 'create'} unit`);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (unit: UnitResponse) => {
    try {
      await UNIT_API.deleteUnit(unit.id);
      message.success('Unit deleted successfully');
      refetch();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete unit');
    }
  };

  return {
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
  };
};