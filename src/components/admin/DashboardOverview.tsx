import React from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import {
    UserOutlined,
    AppstoreOutlined,
    BookOutlined,
    FileTextOutlined,
    TagsOutlined,
    ReadOutlined,
    SafetyOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { useUsers } from '../../hooks/useUsers';
import { useHskLevels } from '../../hooks/useHskLevels';
import { useUnits } from '../../hooks/useUnits';
import { useLessons } from '../../hooks/useLessons';
import { useVocabularies } from '../../hooks/useVocabularies';
import { useRoles } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { useQuizzes } from '../../hooks/useQuizzes';

const DashboardOverview: React.FC = () => {
    const { users, loading: usersLoading } = useUsers();
    const { levels, loading: levelsLoading } = useHskLevels();
    const { units, loading: unitsLoading } = useUnits();
    const { lessons, loading: lessonsLoading } = useLessons();
    const { vocabularies, loading: vocabulariesLoading } = useVocabularies();
    const { roles, loading: rolesLoading } = useRoles();
    const { permissions, loading: permissionsLoading } = usePermissions();
    const { quizzes, loading: quizzesLoading } = useQuizzes();

    const isLoading =
        usersLoading ||
        levelsLoading ||
        unitsLoading ||
        lessonsLoading ||
        vocabulariesLoading ||
        rolesLoading ||
        permissionsLoading ||
        quizzesLoading;

    const statistics = [
        {
            title: 'Total Users',
            value: users.length,
            icon: <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
            color: '#e6f7ff',
        },
        {
            title: 'HSK Levels',
            value: levels.length,
            icon: <AppstoreOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
            color: '#f6ffed',
        },
        {
            title: 'Units',
            value: units.length,
            icon: <BookOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
            color: '#f9f0ff',
        },
        {
            title: 'Lessons',
            value: lessons.length,
            icon: <FileTextOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
            color: '#fff7e6',
        },
        {
            title: 'Quizzes',
            value: quizzes.length,
            icon: <QuestionCircleOutlined style={{ fontSize: 32, color: '#f5222d' }} />,
            color: '#fff1f0',
        },
        {
            title: 'Vocabularies',
            value: vocabularies.length,
            icon: <TagsOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
            color: '#fff0f6',
        },
        {
            title: 'Roles',
            value: roles.length,
            icon: <SafetyOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
            color: '#e6fffb',
        },
        {
            title: 'Permissions',
            value: permissions.length,
            icon: <ReadOutlined style={{ fontSize: 32, color: '#faad14' }} />,
            color: '#fffbe6',
        },
    ];

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading dashboard statistics..." />
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>
            <p style={{ marginBottom: 32, color: '#666' }}>
                Welcome to the Chinese Practice Admin Dashboard. Here's a quick overview of your system.
            </p>

            <Row gutter={[16, 16]}>
                {statistics.map((stat, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: '8px',
                                background: stat.color,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    valueStyle={{ color: '#333' }}
                                />
                                <div>{stat.icon}</div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                <Col xs={24} lg={8}>
                    <Card title="Quiz Analytics" style={{ borderRadius: '8px' }}>
                        <Row gutter={16}>
                            <Col span={24} style={{ marginBottom: 16 }}>
                                <Statistic
                                    title="Total Quizzes"
                                    value={quizzes.length}
                                    valueStyle={{ color: '#f5222d' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Timed Quizzes"
                                    value={quizzes.filter(quiz => quiz.timed).length}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Untimed Quizzes"
                                    value={quizzes.filter(quiz => !quiz.timed).length}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Quiz Types" style={{ borderRadius: '8px' }}>
                        <Row gutter={16}>
                            <Col span={24} style={{ marginBottom: 16 }}>
                                <Statistic
                                    title="Multiple Choice"
                                    value={quizzes.filter(quiz => quiz.type === 'MULTIPLE_CHOICE').length}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Fill in Blank"
                                    value={quizzes.filter(quiz => quiz.type === 'FILL_IN_BLANK').length}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Matching"
                                    value={quizzes.filter(quiz => quiz.type === 'MATCHING').length}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Recent Activity" style={{ borderRadius: '8px' }}>
                        <p style={{ color: '#666' }}>
                            Activity tracking is not yet implemented. This section will display recent actions
                            performed by administrators.
                        </p>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="System Health" style={{ borderRadius: '8px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="Content Status"
                                    value="Healthy"
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Active Users"
                                    value={users.filter((u) => u.roles.length > 0).length}
                                    suffix={`/ ${users.length}`}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Quiz Distribution" style={{ borderRadius: '8px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="With Attempt Limits"
                                    value={quizzes.filter(quiz => quiz.attemptLimit && quiz.attemptLimit > 0).length}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Unlimited Attempts"
                                    value={quizzes.filter(quiz => !quiz.attemptLimit || quiz.attemptLimit <= 0).length}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Card title="Quick Stats" style={{ marginTop: 32, borderRadius: '8px' }}>
                <Row gutter={16}>
                    <Col xs={24} sm={6}>
                        <Statistic
                            title="Avg. Vocabularies per Lesson"
                            value={lessons.length > 0 ? (vocabularies.length / lessons.length).toFixed(1) : 0}
                            precision={1}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Statistic
                            title="Avg. Lessons per Unit"
                            value={units.length > 0 ? (lessons.length / units.length).toFixed(1) : 0}
                            precision={1}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Statistic
                            title="Avg. Units per Level"
                            value={levels.length > 0 ? (units.length / levels.length).toFixed(1) : 0}
                            precision={1}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Statistic
                            title="Avg. Quizzes per Lesson"
                            value={lessons.length > 0 ? (quizzes.length / lessons.length).toFixed(1) : 0}
                            precision={1}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DashboardOverview;
