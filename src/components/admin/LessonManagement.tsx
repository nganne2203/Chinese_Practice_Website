import { useLessons } from '../../hooks/useLessons';
import { Tag } from 'antd';
import { LESSON_API } from '../../api/lesson';
import BaseTable from '../Management/BaseTable';

const LessonManagement: React.FC = () => {
    const { lessons, loading, refetch } = useLessons();

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (desc: string) => desc || '-',
        },
        {
            title: 'Unit',
            key: 'unit',
            render: (_: any, record: any) => (
                <Tag color="green">
                    {record.unit.title} ({record.unit.level.name})
                </Tag>
            ),
        },
    ];

    const handleCreate = () => { /* open modal */ };
    const handleEdit = (lesson: any) => { /* edit modal */ };
    const handleDelete = async (lesson: any) => {
        await LESSON_API.deleteLesson(lesson.id);
        refetch();
    };

    return (
        <BaseTable
            title="Lesson Management"
            data={lessons}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default LessonManagement;
