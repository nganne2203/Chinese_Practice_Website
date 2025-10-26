import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Progress, Statistic, Tag, Timeline, message, Spin } from 'antd';
import { BarChartOutlined, TrophyOutlined, BookOutlined, ClockCircleOutlined, FireOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { LESSON_API } from '../../api/lesson';
import { QUIZ_API } from '../../api/quiz';
import type { LessonResponse } from '../../types/Lesson';
import type { QuizDetailResponse } from '../../types/Quiz';

const { Title, Text } = Typography;

interface ProgressStats {
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    completedQuizzes: number;
    currentStreak: number;
    totalStudyTime: number;
    averageScore: number;
    currentLevel: string;
}

const UserProgress: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [, setLessons] = useState<LessonResponse[]>([]);
    const [, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [stats, setStats] = useState<ProgressStats>({
        totalLessons: 0,
        completedLessons: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        currentStreak: 0,
        totalStudyTime: 0,
        averageScore: 0,
        currentLevel: 'HSK 1'
    });

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        try {
            setLoading(true);
            const [lessonsData, quizzesData] = await Promise.all([
                LESSON_API.getAllLessons(),
                QUIZ_API.getAllQuizzes()
            ]);
            
            setLessons(lessonsData);
            setQuizzes(quizzesData);
            
            const progressStats: ProgressStats = {
                totalLessons: lessonsData.length,
                completedLessons: 0, // Would come from user progress API
                totalQuizzes: quizzesData.length,
                completedQuizzes: 0, // Would come from user quiz results API
                currentStreak: 3, // Mock data
                totalStudyTime: 15, // Mock data in hours
                averageScore: 85, // Mock data
                currentLevel: 'HSK 1'
            };
            
            setStats(progressStats);
        } catch (error) {
            console.error('Error fetching progress data:', error);
            message.error('Failed to load progress data');
        } finally {
            setLoading(false);
        }
    };

    const achievementCards = [
        {
            title: 'Lessons Progress',
            value: stats.completedLessons,
            total: stats.totalLessons,
            suffix: `/ ${stats.totalLessons}`,
            icon: <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
            color: '#e6f7ff',
            progress: (stats.completedLessons / stats.totalLessons) * 100 || 0,
        },
        {
            title: 'Quiz Performance',
            value: stats.averageScore,
            suffix: '%',
            icon: <TrophyOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
            color: '#f6ffed',
            progress: stats.averageScore,
        },
        {
            title: 'Study Streak',
            value: stats.currentStreak,
            suffix: 'days',
            icon: <FireOutlined style={{ fontSize: 24, color: '#fa541c' }} />,
            color: '#fff2e8',
            progress: (stats.currentStreak / 30) * 100, // Assume 30 days target
        },
        {
            title: 'Study Time',
            value: stats.totalStudyTime,
            suffix: 'hrs',
            icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
            color: '#f9f0ff',
            progress: (stats.totalStudyTime / 100) * 100, // Assume 100 hours target
        },
    ];

    const recentActivities = [
        {
            icon: <TrophyOutlined style={{ color: '#52c41a' }} />,
            title: 'Completed Quiz: Basic Greetings',
            description: 'Score: 90% - Great job!',
            time: '2 hours ago',
            type: 'quiz'
        },
        {
            icon: <BookOutlined style={{ color: '#1890ff' }} />,
            title: 'Started Lesson: Numbers 1-10',
            description: 'Learning basic Chinese numbers',
            time: '1 day ago',
            type: 'lesson'
        },
        {
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            title: 'Achievement Unlocked',
            description: 'First Quiz Completed!',
            time: '3 days ago',
            type: 'achievement'
        },
        {
            icon: <BookOutlined style={{ color: '#1890ff' }} />,
            title: 'Completed Lesson: Introduction',
            description: 'Basic Chinese introduction phrases',
            time: '5 days ago',
            type: 'lesson'
        },
    ];

    const levelProgress = [
        { level: 'HSK 1', status: 'active', progress: 25, lessons: 8, quizzes: 4 },
        { level: 'HSK 2', status: 'locked', progress: 0, lessons: 0, quizzes: 0 },
        { level: 'HSK 3', status: 'locked', progress: 0, lessons: 0, quizzes: 0 },
        { level: 'HSK 4', status: 'locked', progress: 0, lessons: 0, quizzes: 0 },
    ];

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
                {/* Header */}
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <BarChartOutlined style={{ marginRight: 8 }} />
                        Learning Progress
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Track your Chinese learning journey and achievements
                    </Text>
                </Card>

                {/* Progress Stats */}
                <Row gutter={[16, 16]}>
                    {achievementCards.map((card, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card>
                                <Statistic
                                    title={card.title}
                                    value={card.value}
                                    suffix={card.suffix}
                                    prefix={
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 48,
                                                height: 48,
                                                backgroundColor: card.color,
                                                borderRadius: 8,
                                                marginRight: 16,
                                            }}
                                        >
                                            {card.icon}
                                        </div>
                                    }
                                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                                />
                                <Progress
                                    percent={Math.round(card.progress)}
                                    size="small"
                                    style={{ marginTop: 12 }}
                                    status={card.progress === 100 ? 'success' : 'active'}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]}>
                    {/* Level Progress */}
                    <Col xs={24} lg={16}>
                        <Card title="HSK Level Progress">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {levelProgress.map((level, index) => (
                                    <Card 
                                        key={index} 
                                        size="small" 
                                        style={{ 
                                            backgroundColor: level.status === 'active' ? '#f6ffed' : '#f5f5f5',
                                            opacity: level.status === 'locked' ? 0.6 : 1 
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                    <Title level={5} style={{ margin: 0 }}>
                                                        {level.level}
                                                    </Title>
                                                    <Tag color={level.status === 'active' ? 'green' : 'default'}>
                                                        {level.status === 'active' ? 'Current' : 'Locked'}
                                                    </Tag>
                                                </div>
                                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#666' }}>
                                                    <span>Lessons: {level.lessons}</span>
                                                    <span>Quizzes: {level.quizzes}</span>
                                                </div>
                                            </div>
                                            <div style={{ width: 100 }}>
                                                <Progress
                                                    type="circle"
                                                    size={60}
                                                    percent={level.progress}
                                                    status={level.status === 'active' ? 'active' : 'normal'}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </Space>
                        </Card>
                    </Col>

                    {/* Recent Activity */}
                    <Col xs={24} lg={8}>
                        <Card title="Recent Activity">
                            <Timeline
                                items={recentActivities.map((activity, index) => ({
                                    dot: activity.icon,
                                    children: (
                                        <div key={index}>
                                            <Text strong style={{ fontSize: 14 }}>
                                                {activity.title}
                                            </Text>
                                            <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                                                {activity.description}
                                            </div>
                                            <div style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
                                                {activity.time}
                                            </div>
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Achievements Section */}
                <Card title="Achievements & Badges">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff7e6' }}>
                                <TrophyOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 8 }} />
                                <div>
                                    <Text strong>First Quiz</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Completed your first quiz
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
                                <FireOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                                <div>
                                    <Text strong>3-Day Streak</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Study for 3 consecutive days
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f0f0f0', opacity: 0.6 }}>
                                <BookOutlined style={{ fontSize: 32, color: '#999', marginBottom: 8 }} />
                                <div>
                                    <Text type="secondary">Lesson Master</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Complete 10 lessons
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </div>
    );
};

export default UserProgress;