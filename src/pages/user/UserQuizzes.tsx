import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, message, Spin, Tag, Alert, Select, Input } from 'antd';
import { TrophyOutlined, PlayCircleOutlined, ClockCircleOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { QUIZ_API } from '../../api/quiz';
import type { QuizDetailResponse } from '../../types/Quiz';
import { QUIZ_TYPE } from '../../constants/QuizType';

const { Title, Text } = Typography;
const { Search } = Input;

const UserQuizzes: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<QuizDetailResponse[]>([]);
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        filterQuizzes();
    }, [quizzes, searchText, typeFilter]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const quizzesData = await QUIZ_API.getAllQuizzes();
            setQuizzes(quizzesData);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            message.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const filterQuizzes = () => {
        let filtered = quizzes;

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchText.toLowerCase()) ||
                quiz.lesson.title.toLowerCase().includes(searchText.toLowerCase()) ||
                quiz.lesson.unit.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(quiz => quiz.type === typeFilter);
        }

        setFilteredQuizzes(filtered);
    };

    const isQuizAvailable = (quiz: QuizDetailResponse): { available: boolean; reason?: string } => {
        const now = new Date();
        
        if (quiz.startTime && quiz.endTime) {
            const startTime = new Date(quiz.startTime);
            const endTime = new Date(quiz.endTime);
            
            if (now < startTime) {
                return { 
                    available: false, 
                    reason: `Available from ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}` 
                };
            }
            
            if (now > endTime) {
                return { 
                    available: false, 
                    reason: 'Quiz period has ended' 
                };
            }
        }

        return { available: true };
    };

    const handleStartQuiz = (quizId: string) => {
        navigate(`/app/quiz/${quizId}`);
    };

    const getQuizStatusColor = (quiz: QuizDetailResponse) => {
        const status = isQuizAvailable(quiz);
        return status.available ? 'success' : 'default';
    };

    const getQuizStatusText = (quiz: QuizDetailResponse) => {
        const status = isQuizAvailable(quiz);
        return status.available ? 'Available' : 'Unavailable';
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
                {/* Header */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Practice Quizzes
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            Test your knowledge with interactive quizzes designed to reinforce your learning.
                        </Text>
                    </Space>
                </Card>

                {/* Filters */}
                <Card>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Search quizzes..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={setSearchText}
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Select
                                value={typeFilter}
                                onChange={setTypeFilter}
                                style={{ width: '100%' }}
                                placeholder="Filter by type"
                                suffixIcon={<FilterOutlined />}
                            >
                                <Select.Option value="all">All Types</Select.Option>
                                <Select.Option value={QUIZ_TYPE.MULTIPLE_CHOICE}>Multiple Choice</Select.Option>
                                <Select.Option value={QUIZ_TYPE.MATCHING}>Matching</Select.Option>
                                <Select.Option value={QUIZ_TYPE.FILL_IN_BLANK}>Fill in the Blank</Select.Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Text type="secondary">
                                Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Quizzes Grid */}
                <Row gutter={[16, 16]}>
                    {filteredQuizzes.map((quiz) => {
                        const status = isQuizAvailable(quiz);
                        
                        return (
                            <Col xs={24} sm={12} lg={8} key={quiz.id}>
                                <Card
                                    size="small"
                                    title={
                                        <Space>
                                            <TrophyOutlined />
                                            <Text strong ellipsis style={{ maxWidth: 200 }}>
                                                {quiz.title}
                                            </Text>
                                        </Space>
                                    }
                                    extra={
                                        <Tag color={getQuizStatusColor(quiz)}>
                                            {getQuizStatusText(quiz)}
                                        </Tag>
                                    }
                                    style={{ 
                                        height: '100%',
                                        opacity: status.available ? 1 : 0.7
                                    }}
                                >
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        {/* Quiz Info */}
                                        <div>
                                            <Space wrap>
                                                <Tag color="blue">{quiz.lesson.unit.level.name}</Tag>
                                                <Tag color="green">{quiz.type}</Tag>
                                            </Space>
                                            <div style={{ marginTop: 8 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {quiz.lesson.unit.title} • {quiz.lesson.title}
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Quiz Details */}
                                        <div>
                                            {quiz.timed && quiz.durationInMinutes && (
                                                <div style={{ marginBottom: 4 }}>
                                                    <ClockCircleOutlined style={{ marginRight: 4, color: '#fa8c16' }} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {quiz.durationInMinutes} minutes
                                                    </Text>
                                                </div>
                                            )}
                                            
                                            {quiz.attemptLimit && (
                                                <div style={{ marginBottom: 4 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Max attempts: {quiz.attemptLimit}
                                                    </Text>
                                                </div>
                                            )}

                                            {quiz.startTime && quiz.endTime && (
                                                <div style={{ marginBottom: 4 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Available: {new Date(quiz.startTime).toLocaleDateString()} - {new Date(quiz.endTime).toLocaleDateString()}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>

                                        {status.available ? (
                                            <Button 
                                                type="primary" 
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => handleStartQuiz(quiz.id)}
                                                block
                                            >
                                                Start Quiz
                                            </Button>
                                        ) : (
                                            <Alert
                                                message={status.reason}
                                                type="warning"
                                                showIcon={false}
                                                style={{ 
                                                    padding: '6px 8px',
                                                    fontSize: 11,
                                                    textAlign: 'center'
                                                }}
                                            />
                                        )}
                                    </Space>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {filteredQuizzes.length === 0 && !loading && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            <TrophyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div>
                                {quizzes.length === 0 ? 'No quizzes available' : 'No quizzes match your filters'}
                            </div>
                            <div style={{ fontSize: 14, marginTop: 8 }}>
                                {quizzes.length === 0 
                                    ? 'Check back later for new quizzes!' 
                                    : 'Try adjusting your search or filter criteria'
                                }
                            </div>
                            {searchText || typeFilter !== 'all' ? (
                                <Button 
                                    type="link" 
                                    onClick={() => {
                                        setSearchText('');
                                        setTypeFilter('all');
                                    }}
                                    style={{ marginTop: 12 }}
                                >
                                    Clear Filters
                                </Button>
                            ) : null}
                        </div>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserQuizzes;