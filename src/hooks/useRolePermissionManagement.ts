import { useState } from 'react';
import { message, Form } from 'antd';
import { ROLE_API } from '../api/role';
import { PERMISSION_API } from '../api/permission';
import { useRoles } from './useRoles';
import { usePermissions } from './usePermissions';
import type { RoleResponse, RoleRequest } from '../types/Role';
import type { PermissionResponse, PermissionRequest } from '../types/Permission';

export const useRolePermissionManagement = () => {
  const { roles, loading: rolesLoading, refetch: refetchRoles } = useRoles();
  const { permissions, loading: permissionsLoading, refetch: refetchPermissions } = usePermissions();
  
  // Role modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [roleForm] = Form.useForm();

  // Permission modal states
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [submittingPermission, setSubmittingPermission] = useState(false);
  const [permissionForm] = Form.useForm();

  // Role handlers
  const openRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    roleForm.resetFields();
  };

  const handleCreateRole = async (values: RoleRequest) => {
    setSubmittingRole(true);
    try {
      await ROLE_API.createRole(values);
      message.success('Role created successfully');
      closeRoleModal();
      refetchRoles();
    } catch (error: any) {
      message.error(error.message || 'Failed to create role');
      throw error; // Re-throw to let the form handle it
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleDeleteRole = async (role: RoleResponse) => {
    try {
      await ROLE_API.deleteRole(role.name);
      message.success('Role deleted successfully');
      refetchRoles();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete role');
    }
  };

  // Permission handlers
  const openPermissionModal = () => {
    setIsPermissionModalOpen(true);
  };

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    permissionForm.resetFields();
  };

  const handleCreatePermission = async (values: PermissionRequest) => {
    setSubmittingPermission(true);
    try {
      await PERMISSION_API.createPermission(values);
      message.success('Permission created successfully');
      closePermissionModal();
      refetchPermissions();
    } catch (error: any) {
      message.error(error.message || 'Failed to create permission');
      throw error; // Re-throw to let the form handle it
    } finally {
      setSubmittingPermission(false);
    }
  };

  const handleDeletePermission = async (permission: PermissionResponse) => {
    try {
      await PERMISSION_API.deletePermission(permission.name);
      message.success('Permission deleted successfully');
      refetchPermissions();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete permission');
    }
  };

  return {
    // Data
    roles,
    permissions,
    rolesLoading,
    permissionsLoading,

    // Role modal states
    isRoleModalOpen,
    submittingRole,
    roleForm,

    // Permission modal states  
    isPermissionModalOpen,
    submittingPermission,
    permissionForm,

    // Role handlers
    openRoleModal,
    closeRoleModal,
    handleCreateRole,
    handleDeleteRole,

    // Permission handlers
    openPermissionModal,
    closePermissionModal,
    handleCreatePermission,
    handleDeletePermission,
  };
};