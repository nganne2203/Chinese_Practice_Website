import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, message, Spin, Tag, Empty } from 'antd';
import { BookOutlined, PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LESSON_API } from '../../api/lesson';
import type { LessonResponse } from '../../types/Lesson';
import { useNavigate } from 'react-router';

const { Title, Text, Paragraph } = Typography;

const UserLessons: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const data = await LESSON_API.getAllLessons();
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            message.error('Failed to load lessons');
        } finally {
            setLoading(false);
        }
    };

    const handleStartLesson = (lessonId: string) => {
        navigate(`/app/lessons/${lessonId}`);
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
                        <BookOutlined style={{ marginRight: 8 }} />
                        Chinese Lessons
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Explore and study Chinese lessons at your own pace
                    </Text>
                </Card>

                {lessons.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {lessons.map((lesson) => (
                            <Col xs={24} sm={12} lg={8} key={lesson.id}>
                                <Card
                                    hoverable
                                    style={{ height: '100%' }}
                                    actions={[
                                        <Button
                                            type="primary"
                                            icon={<PlayCircleOutlined />}
                                            onClick={() => handleStartLesson(lesson.id)}
                                        >
                                            Start Lesson
                                        </Button>
                                    ]}
                                >
                                    <Card.Meta
                                        avatar={
                                            <div style={{
                                                width: 48,
                                                height: 48,
                                                backgroundColor: '#1890ff',
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: 18,
                                                fontWeight: 'bold'
                                            }}>
                                                {lesson.title.charAt(0)}
                                            </div>
                                        }
                                        title={
                                            <Space direction="vertical" size={4}>
                                                <Text strong style={{ fontSize: 16 }}>
                                                    {lesson.title}
                                                </Text>
                                                <Tag color="blue">{lesson.unit.title}</Tag>
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" size={8}>
                                                <Paragraph 
                                                    type="secondary" 
                                                    style={{ margin: 0, fontSize: 14 }}
                                                    ellipsis={{ rows: 2 }}
                                                >
                                                    {lesson.description || 'No description available'}
                                                </Paragraph>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <ClockCircleOutlined style={{ color: '#666' }} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Level: {lesson.unit.level.name}
                                                    </Text>
                                                </div>
                                            </Space>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Card>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    No lessons available yet.
                                    <br />
                                    Check back later for new content!
                                </span>
                            }
                        />
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserLessons;