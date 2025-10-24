import React from 'react';
import { Card, Typography, Space, Row, Col, Button, Statistic } from 'antd';
import { BookOutlined, TrophyOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Lessons Completed',
            value: 0,
            icon: <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
            color: '#e6f7ff',
        },
        {
            title: 'Quiz Score',
            value: 0,
            suffix: '%',
            icon: <TrophyOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
            color: '#f6ffed',
        },
        {
            title: 'Study Time',
            value: 0,
            suffix: 'hrs',
            icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
            color: '#f9f0ff',
        },
        {
            title: 'Level Progress',
            value: 'HSK 1',
            icon: <UserOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
            color: '#fff7e6',
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Welcome Section */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Welcome back, {user?.firstName || user?.userName}! 🎯
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Continue your Chinese learning journey. Let's practice together!
                        </Text>
                    </Space>
                </Card>

                {/* Stats Overview */}
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
                                <Button type="primary" size="large" block icon={<BookOutlined />}>
                                    Start New Lesson
                                </Button>
                                <Button size="large" block icon={<TrophyOutlined />}>
                                    Take a Quiz
                                </Button>
                                <Button size="large" block icon={<ClockCircleOutlined />}>
                                    Practice Vocabulary
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Recent Activity" extra={<Text type="secondary">Your progress</Text>}>
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                                <div>No recent activity</div>
                                <div style={{ fontSize: 14 }}>Start learning to see your progress here!</div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Learning Path */}
                <Card title="Your Learning Path" extra={<Button type="link">View All</Button>}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                                <Title level={4} style={{ margin: '8px 0' }}>HSK 1</Title>
                                <Text type="secondary">Basic Level</Text>
                                <div style={{ marginTop: 12 }}>
                                    <Button type="primary" size="small">Start</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center', opacity: 0.5 }}>
                                <Title level={4} style={{ margin: '8px 0' }}>HSK 2</Title>
                                <Text type="secondary">Elementary</Text>
                                <div style={{ marginTop: 12 }}>
                                    <Button size="small" disabled>Locked</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card size="small" style={{ textAlign: 'center', opacity: 0.5 }}>
                                <Title level={4} style={{ margin: '8px 0' }}>HSK 3</Title>
                                <Text type="secondary">Intermediate</Text>
                                <div style={{ marginTop: 12 }}>
                                    <Button size="small" disabled>Locked</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </div>
    );
};

export default Dashboard;