import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, Statistic, message, Spin } from 'antd';
import { BookOutlined, TrophyOutlined, ClockCircleOutlined, UserOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { LESSON_API } from '../../api/lesson';
import { QUIZ_API } from '../../api/quiz';
import type { LessonResponse } from '../../types/Lesson';
import type { QuizDetailResponse } from '../../types/Quiz';

const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [lessonsData, quizzesData] = await Promise.all([
                LESSON_API.getAllLessons(),
                QUIZ_API.getAllQuizzes()
            ]);
            setLessons(lessonsData);
            setQuizzes(quizzesData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: 'Available Lessons',
            value: lessons.length,
            icon: <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
            color: '#e6f7ff',
        },
        {
            title: 'Available Quizzes',
            value: quizzes.length,
            icon: <TrophyOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
            color: '#f6ffed',
        },
        {
            title: 'Study Streak',
            value: 0,
            suffix: 'days',
            icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
            color: '#f9f0ff',
        },
        {
            title: 'Current Level',
            value: 'HSK 1',
            icon: <UserOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
            color: '#fff7e6',
        },
    ];

    const recentLessons = lessons.slice(0, 3);
    const recentQuizzes = quizzes.slice(0, 3);

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
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Welcome back, {user?.firstName || user?.userName}!
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Continue your Chinese learning journey. Let's practice together!
                        </Text>
                    </Space>
                </Card>

                <Row gutter={[16, 16]}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    prefix={
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 48,
                                                height: 48,
                                                backgroundColor: stat.color,
                                                borderRadius: 8,
                                                marginRight: 16,
                                            }}
                                        >
                                            {stat.icon}
                                        </div>
                                    }
                                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Quick Actions */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Quick Actions" extra={<Text type="secondary">Get started</Text>}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block 
                                    icon={<BookOutlined />}
                                    onClick={() => navigate('/app/lessons')}
                                >
                                    Browse Lessons
                                </Button>
                                <Button 
                                    size="large" 
                                    block 
                                    icon={<TrophyOutlined />}
                                    onClick={() => navigate('/app/quizzes')}
                                >
                                    Take a Quiz
                                </Button>
                                <Button 
                                    size="large" 
                                    block 
                                    icon={<ClockCircleOutlined />}
                                    onClick={() => navigate('/app/progress')}
                                >
                                    View Progress
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Recent Lessons" extra={
                            <Button type="link" onClick={() => navigate('/app/lessons')}>
                                View All
                            </Button>
                        }>
                            {recentLessons.length > 0 ? (
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    {recentLessons.map((lesson) => (
                                        <div key={lesson.id} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}>
                                            <div>
                                                <Text strong>{lesson.title}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {lesson.unit.title}
                                                </Text>
                                            </div>
                                            <Button 
                                                type="text" 
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => navigate('/app/lessons')}
                                            >
                                                Start
                                            </Button>
                                        </div>
                                    ))}
                                </Space>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                    <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                                    <div>No lessons available</div>
                                    <div style={{ fontSize: 14 }}>Check back later for new content!</div>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Recent Quizzes */}
                <Card title="Available Quizzes" extra={
                    <Button type="link" onClick={() => navigate('/app/quizzes')}>
                        View All
                    </Button>
                }>
                    {recentQuizzes.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {recentQuizzes.map((quiz) => (
                                <Col xs={24} sm={8} key={quiz.id}>
                                    <Card size="small" style={{ textAlign: 'center' }}>
                                        <Title level={5} style={{ margin: '8px 0' }}>{quiz.title}</Title>
                                        <Text type="secondary">{quiz.type}</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {quiz.lesson.title}
                                        </Text>
                                        <div style={{ marginTop: 12 }}>
                                            <Button 
                                                type="primary" 
                                                size="small"
                                                onClick={() => navigate('/app/quizzes')}
                                            >
                                                Take Quiz
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            <TrophyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div>No quizzes available</div>
                            <div style={{ fontSize: 14 }}>Check back later for new quizzes!</div>
                        </div>
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default UserDashboard;