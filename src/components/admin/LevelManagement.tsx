import { useHskLevels } from '../../hooks/useHskLevels';
import { HSK_LEVEL_API } from '../../api/hskLevel';
import BaseTable from '../Management/BaseTable';

const LevelManagement: React.FC = () => {
  const { levels, loading, refetch } = useHskLevels();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Level Name',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const handleCreate = () => { /* open modal */ };
  const handleDelete = async (level: any) => {
    await HSK_LEVEL_API.deleteHskLevel(level.id);
    refetch();
  };

  return (
    <BaseTable
      title="HSK Level Management"
      data={levels}
      columns={columns}
      loading={loading}
      onCreate={handleCreate}
      onDelete={handleDelete}
      showCreateButton
    />
  );
};

export default LevelManagement;
