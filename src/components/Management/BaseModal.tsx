
import React, { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Modal, Form, Button, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';

export interface FormField {
  name: string;
  label: string;
  component: ReactElement;
  rules?: any[];
  dependencies?: string[];
}

interface BaseModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void | Promise<void>;
  title: string;
  formFields: FormField[];
  initialValues?: Record<string, any>;
  loading?: boolean;
  width?: number;
  form?: FormInstance;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  title,
  formFields,
  initialValues,
  loading = false,
  width = 600,
  form: externalForm,
}) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // Error handling should be done in the onSubmit callback
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={width}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {formFields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
            dependencies={field.dependencies}
          >
            {field.component}
          </Form.Item>
        ))}

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseModal;
