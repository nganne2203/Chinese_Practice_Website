import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, message, Spin, Badge, Divider } from 'antd';
import { BookOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { UNIT_API } from '../../api/unit';
import { LESSON_API } from '../../api/lesson';
import type { UnitResponse } from '../../types/Unit';
import type { LessonResponse } from '../../types/Lesson';

const { Title, Text } = Typography;

interface UnitWithLessons extends UnitResponse {
    lessons: LessonResponse[];
}

const UserUnits: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [units, setUnits] = useState<UnitWithLessons[]>([]);

    useEffect(() => {
        fetchUnitsAndLessons();
    }, []);

    const fetchUnitsAndLessons = async () => {
        try {
            setLoading(true);
            const [unitsData, lessonsData] = await Promise.all([
                UNIT_API.getUnits(),
                LESSON_API.getAllLessons()
            ]);

            console.log('Fetched units:', unitsData);
            console.log('Fetched lessons:', lessonsData);

            const unitsWithLessons = unitsData.map(unit => ({
                ...unit,
                lessons: lessonsData.filter(lesson => lesson.unit.id === unit.id)
            }));

            setUnits(unitsWithLessons);
        } catch (error) {
            console.error('Error fetching units and lessons:', error);
            message.error('Failed to load units and lessons');
        } finally {
            setLoading(false);
        }
    };

    const groupedUnits = units.reduce((acc, unit) => {
        const levelName = unit.level.name;
        if (!acc[levelName]) {
            acc[levelName] = [];
        }
        acc[levelName].push(unit);
        return acc;
    }, {} as Record<string, UnitWithLessons[]>);

    const handleLessonClick = (lessonId: string) => {
        navigate(`/app/lessons/${lessonId}`);
    };

    const handleUnitClick = (unitId: string) => {
        navigate(`/app/units/${unitId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        Learning Units
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Explore units organized by HSK levels. Each unit contains multiple lessons to help you progress.
                    </Text>
                </Card>

                {Object.entries(groupedUnits).map(([levelName, levelUnits]) => (
                    <Card key={levelName} title={
                        <Space>
                            <Badge color="blue" />
                            <Title level={3} style={{ margin: 0 }}>{levelName}</Title>
                        </Space>
                    }>
                        <Row gutter={[16, 16]}>
                            {levelUnits.map((unit) => (
                                <Col xs={24} sm={12} lg={8} key={unit.id}>
                                    <Card
                                        size="small"
                                        title={unit.title}
                                        extra={
                                            <Badge 
                                                count={unit.lessons.length} 
                                                style={{ backgroundColor: '#52c41a' }}
                                                title="Number of lessons"
                                            />
                                        }
                                        style={{ height: '100%' }}
                                    >
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            <Text type="secondary">
                                                {unit.title} - Unit {unit.unitNumber}
                                            </Text>
                                            
                                            <Divider style={{ margin: '12px 0' }} />
                                            
                                            <div>
                                                <Text strong style={{ fontSize: 12, color: '#666' }}>
                                                    LESSONS IN THIS UNIT:
                                                </Text>
                                                <div style={{ marginTop: 8, maxHeight: 120, overflowY: 'auto' }}>
                                                    {unit.lessons.length > 0 ? (
                                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                            {unit.lessons.slice(0, 3).map((lesson) => (
                                                                <Button
                                                                    key={lesson.id}
                                                                    type="text"
                                                                    size="small"
                                                                    icon={<BookOutlined />}
                                                                    onClick={() => handleLessonClick(lesson.id)}
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        textAlign: 'left',
                                                                        height: 'auto',
                                                                        padding: '4px 8px'
                                                                    }}
                                                                    title={lesson.title}
                                                                >
                                                                    <Text ellipsis style={{ fontSize: 12 }}>
                                                                        {lesson.title}
                                                                    </Text>
                                                                </Button>
                                                            ))}
                                                            {unit.lessons.length > 3 && (
                                                                <Text type="secondary" style={{ fontSize: 11, textAlign: 'center', display: 'block' }}>
                                                                    +{unit.lessons.length - 3} more lessons
                                                                </Text>
                                                            )}
                                                        </Space>
                                                    ) : (
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            No lessons available
                                                        </Text>
                                                    )}
                                                </div>
                                            </div>

                                            <Button 
                                                type="primary" 
                                                icon={<RightOutlined />} 
                                                size="small"
                                                block
                                                disabled={unit.lessons.length === 0}
                                                onClick={() => {
                                                    if (unit.lessons.length > 0) {
                                                        handleUnitClick(unit.id);
                                                    }
                                                }}
                                            >
                                                {unit.lessons.length > 0 ? 'Start Learning' : 'Coming Soon'}
                                            </Button>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                ))}

                {Object.keys(groupedUnits).length === 0 && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div>No units available</div>
                            <div style={{ fontSize: 14 }}>Check back later for new content!</div>
                        </div>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserUnits;