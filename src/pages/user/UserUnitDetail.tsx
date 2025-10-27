import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, message, Spin, Alert, Tag } from 'antd';
import { BookOutlined, ArrowLeftOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { UNIT_API } from '../../api/unit';
import { LESSON_API } from '../../api/lesson';
import { QUIZ_API } from '../../api/quiz';
import type { UnitResponse } from '../../types/Unit';
import type { LessonResponse } from '../../types/Lesson';
import type { QuizDetailResponse } from '../../types/Quiz';

const { Title, Text } = Typography;

interface LessonWithQuizzes extends LessonResponse {
    quizzes: QuizDetailResponse[];
}

const UserUnitDetail: React.FC = () => {
    const navigate = useNavigate();
    const { unitId } = useParams<{ unitId: string }>();
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState<UnitResponse | null>(null);
    const [lessons, setLessons] = useState<LessonWithQuizzes[]>([]);

    useEffect(() => {
        if (unitId) {
            fetchUnitDetails();
        }
    }, [unitId]);

    const fetchUnitDetails = async () => {
        if (!unitId) return;
        
        try {
            setLoading(true);
            const [unitData, allLessons] = await Promise.all([
                UNIT_API.getUnitById(unitId),
                LESSON_API.getAllLessons()
            ]);
            console.log('All lessons:', allLessons);
            console.log('Unit data:', unitData);

            const unitLessons = allLessons.filter(lesson => lesson.unit.id === unitId);
            
            const lessonsWithQuizzes = await Promise.all(
                unitLessons.map(async (lesson) => {
                    try {
                        const quizzes = await QUIZ_API.getQuizByLesson(lesson.id);
                        return { ...lesson, quizzes };
                    } catch (error) {
                        console.error(`Error fetching quizzes for lesson ${lesson.id}:`, error);
                        return { ...lesson, quizzes: [] };
                    }
                })
            );

            setUnit(unitData);
            setLessons(lessonsWithQuizzes);
        } catch (error) {
            console.error('Error fetching unit details:', error);
            message.error('Failed to load unit details');
        } finally {
            setLoading(false);
        }
    };

    const handleStartLesson = (lessonId: string) => {
        navigate(`/app/lessons/${lessonId}`);
    };

    const handleStartQuiz = (quizId: string) => {
        navigate(`/app/quiz/${quizId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!unit) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Unit Not Found"
                    description="The unit you're looking for doesn't exist or has been removed."
                    type="error"
                    action={
                        <Button size="small" onClick={() => navigate('/app/units')}>
                            Back to Units
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/app/units')}
                            style={{ marginBottom: 8 }}
                        >
                            Back to Units
                        </Button>
                        
                        <div>
                            <Tag color="blue">{unit.level.name}</Tag>
                            <Tag color="green">Unit {unit.unitNumber}</Tag>
                        </div>
                        
                        <Title level={1} style={{ margin: 0 }}>
                            {unit.title}
                        </Title>
                        
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} available in this unit
                        </Text>
                    </Space>
                </Card>

                {/* Lessons List */}
                {lessons.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {lessons.map((lesson, index) => (
                            <Col xs={24} key={lesson.id}>
                                <Card
                                    title={
                                        <Space>
                                            <BookOutlined style={{ color: '#1890ff' }} />
                                            <span>Lesson {index + 1}: {lesson.title}</span>
                                        </Space>
                                    }
                                    extra={
                                        <Space>
                                            {lesson.quizzes.length > 0 && (
                                                <Tag color="orange">
                                                    {lesson.quizzes.length} Quiz{lesson.quizzes.length !== 1 ? 'zes' : ''}
                                                </Tag>
                                            )}
                                            <Button 
                                                type="primary" 
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => handleStartLesson(lesson.id)}
                                            >
                                                Start Lesson
                                            </Button>
                                        </Space>
                                    }
                                    style={{ marginBottom: 16 }}
                                >
                                    <Row gutter={[24, 16]}>
                                        <Col xs={24} md={16}>
                                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                <div>
                                                    <Text strong style={{ fontSize: 16 }}>Description</Text>
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text>{lesson.description || 'No description available'}</Text>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <Text strong style={{ fontSize: 16 }}>What you'll learn</Text>
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text type="secondary">
                                                            • Vocabulary and phrases related to {lesson.title.toLowerCase()}
                                                        </Text>
                                                        <br />
                                                        <Text type="secondary">
                                                            • Grammar patterns and sentence structures
                                                        </Text>
                                                        <br />
                                                        <Text type="secondary">
                                                            • Practical application through exercises
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Space>
                                        </Col>
                                        
                                        <Col xs={24} md={8}>
                                            {lesson.quizzes.length > 0 && (
                                                <Card size="small" title="Available Quizzes">
                                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                        {lesson.quizzes.map((quiz) => (
                                                            <div key={quiz.id} style={{ 
                                                                display: 'flex', 
                                                                justifyContent: 'space-between', 
                                                                alignItems: 'center',
                                                                padding: '8px 0',
                                                                borderBottom: '1px solid #f0f0f0'
                                                            }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <Text strong style={{ fontSize: 14 }}>
                                                                        {quiz.title}
                                                                    </Text>
                                                                    <br />
                                                                    <Tag color="purple">
                                                                        {quiz.type}
                                                                    </Tag>
                                                                </div>
                                                                <Button 
                                                                    type="text" 
                                                                    size="small"
                                                                    icon={<TrophyOutlined />}
                                                                    onClick={() => handleStartQuiz(quiz.id)}
                                                                >
                                                                    Take Quiz
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </Space>
                                                </Card>
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div>No lessons available in this unit</div>
                            <div style={{ fontSize: 14 }}>Check back later for new content!</div>
                        </div>
                    </Card>
                )}

                {/* Unit Progress Summary */}
                {lessons.length > 0 && (
                    <Card title="Unit Summary" style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                        {lessons.length}
                                    </Title>
                                    <Text type="secondary">Lessons</Text>
                                </div>
                            </Col>
                            <Col xs={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                        {lessons.reduce((total, lesson) => total + lesson.quizzes.length, 0)}
                                    </Title>
                                    <Text type="secondary">Quizzes</Text>
                                </div>
                            </Col>
                            <Col xs={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ margin: 0, color: '#722ed1' }}>
                                        {unit.level.name}
                                    </Title>
                                    <Text type="secondary">Level</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserUnitDetail;