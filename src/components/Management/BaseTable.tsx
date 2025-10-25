import { Table, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';

interface BaseTableProps<T> {
  title: string;
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  onCreate?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  showCreateButton?: boolean;
  pagination?: false | TablePaginationConfig;
}

function BaseTable<T extends { id: string | number }>({
  title,
  data,
  columns,
  loading = false,
  onCreate,
  onEdit,
  onDelete,
  showCreateButton = true,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number) => `Total ${total} records`,
  },
}: BaseTableProps<T>) {
  const enhancedColumns: ColumnsType<T> = [
    ...columns,
    (onEdit || onDelete) && {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: T) => (
        <Space size="small">
          {onEdit && (
            <Button type="link" onClick={() => onEdit(record)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Delete"
              description="Are you sure you want to delete this record?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(record)}
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ].filter(Boolean) as ColumnsType<T>;

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        {showCreateButton && onCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Create
          </Button>
        )}
      </div>

      <Table<T>
        rowKey="id"
        columns={enhancedColumns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
}

export default BaseTable;
