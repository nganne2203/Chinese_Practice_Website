import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Button, message, Spin, Tag, Alert, Modal, Space } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, PlayCircleOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { QUIZ_API } from '../../api/quiz';
import { useAuth } from '../../contexts/AuthContext';
import type { QuizDetailResponse } from '../../types/Quiz';
import { QUIZ_TYPE } from '../../constants/QuizType';
import MatchQuiz from './quiz/types/MatchQuiz';
import FillQuiz from './quiz/types/FillQuiz';
import MultipleChoiceQuiz from './quiz/types/MultipleChoiceQuiz';

const { Title, Text } = Typography;
const { confirm } = Modal;

const UserQuiz: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<any>(null);
    const [isQuizActive, setIsQuizActive] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await QUIZ_API.getAllQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            message.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const checkQuizAvailability = (quiz: QuizDetailResponse) => {
        const now = new Date();
        const startTime = quiz.startTime ? new Date(quiz.startTime) : null;
        const endTime = quiz.endTime ? new Date(quiz.endTime) : null;

        // Check time window
        if (startTime && now < startTime) {
            return {
                canStart: false,
                reason: `Quiz will be available from ${startTime.toLocaleString()}`
            };
        }

        if (endTime && now > endTime) {
            return {
                canStart: false,
                reason: `Quiz ended on ${endTime.toLocaleString()}`
            };
        }

        const userAttempts = 0; // This should come from an API call
        
        if (quiz.attemptLimit && userAttempts >= quiz.attemptLimit) {
            return {
                canStart: false,
                reason: `Maximum attempts (${quiz.attemptLimit}) reached`
            };
        }

        return {
            canStart: true,
            reason: null
        };
    };

    const handleStartQuiz = async (quiz: QuizDetailResponse) => {
        const availability = checkQuizAvailability(quiz);
        
        if (!availability.canStart) {
            message.warning(availability.reason);
            return;
        }

        confirm({
            title: 'Start Quiz',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you ready to start "{quiz.title}"?</p>
                    {quiz.timed && quiz.durationInMinutes && (
                        <Alert
                            message={`Time Limit: ${quiz.durationInMinutes} minutes`}
                            type="warning"
                            showIcon
                            style={{ marginTop: 8 }}
                        />
                    )}
                    {quiz.attemptLimit && (
                        <Alert
                            message={`Attempts allowed: ${quiz.attemptLimit}`}
                            type="info"
                            showIcon
                            style={{ marginTop: 8 }}
                        />
                    )}
                </div>
            ),
            onOk: async () => {
                try {
                    if (!user?.id) {
                        message.error('User not found');
                        return;
                    }

                    await QUIZ_API.startQuiz(quiz.id, user.id);
                    
                    const quizWithQuestions = await QUIZ_API.getQuizById(quiz.id);
                    setCurrentQuiz(quizWithQuestions);
                    setIsQuizActive(true);
                    
                    message.success('Quiz started successfully!');
                } catch (error) {
                    console.error('Error starting quiz:', error);
                    message.error('Failed to start quiz');
                }
            },
        });
    };

    const handleQuizComplete = (results: any) => {
        setIsQuizActive(false);
        setCurrentQuiz(null);
        message.success(`Quiz completed! Score: ${results.score}/${results.totalQuestions}`);
    };

    const renderQuizByType = () => {
        if (!currentQuiz || !isQuizActive) return null;

        const commonProps = {
            quiz: currentQuiz,
            onComplete: handleQuizComplete,
            userId: user?.id || ''
        };

        switch (currentQuiz.type) {
            case QUIZ_TYPE.MATCHING:
                return <MatchQuiz {...commonProps} />;
            case QUIZ_TYPE.FILL_IN_BLANK:
                return <FillQuiz {...commonProps} />;
            case QUIZ_TYPE.MULTIPLE_CHOICE:
                return <MultipleChoiceQuiz {...commonProps} />;
            default:
                return (
                    <Alert
                        message="Unsupported Quiz Type"
                        description={`Quiz type "${currentQuiz.type}" is not supported yet.`}
                        type="error"
                        showIcon
                    />
                );
        }
    };

    const getQuizStatusTag = (quiz: QuizDetailResponse) => {
        const availability = checkQuizAvailability(quiz);
        
        if (!availability.canStart) {
            return <Tag color="red">Not Available</Tag>;
        }

        const now = new Date();
        const endTime = quiz.endTime ? new Date(quiz.endTime) : null;
        
        if (endTime && now > endTime) {
            return <Tag color="default">Ended</Tag>;
        }

        return <Tag color="green">Available</Tag>;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    // If quiz is active, render the quiz interface
    if (isQuizActive && currentQuiz) {
        return (
            <div style={{ padding: 24 }}>
                <Card>
                    <div style={{ marginBottom: 16 }}>
                        <Title level={3}>{currentQuiz.title}</Title>
                        <Text type="secondary">Type: {currentQuiz.type}</Text>
                        {currentQuiz.timed && currentQuiz.durationInMinutes && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>
                                <ClockCircleOutlined /> {currentQuiz.durationInMinutes} minutes
                            </Tag>
                        )}
                    </div>
                    {renderQuizByType()}
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <TrophyOutlined style={{ marginRight: 8 }} />
                        Chinese Quizzes
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Test your Chinese knowledge with interactive quizzes
                    </Text>
                </Card>

                {quizzes.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {quizzes.map((quiz) => {
                            const availability = checkQuizAvailability(quiz);
                            
                            return (
                                <Col xs={24} sm={12} lg={8} key={quiz.id}>
                                    <Card
                                        hoverable
                                        style={{ height: '100%' }}
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<PlayCircleOutlined />}
                                                disabled={!availability.canStart}
                                                onClick={() => handleStartQuiz(quiz)}
                                            >
                                                {availability.canStart ? 'Start Quiz' : 'Unavailable'}
                                            </Button>
                                        ]}
                                    >
                                        <Card.Meta
                                            avatar={
                                                <div style={{
                                                    width: 48,
                                                    height: 48,
                                                    backgroundColor: availability.canStart ? '#52c41a' : '#d9d9d9',
                                                    borderRadius: 8,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: 18,
                                                    fontWeight: 'bold'
                                                }}>
                                                    <TrophyOutlined />
                                                </div>
                                            }
                                            title={
                                                <Space direction="vertical" size={4}>
                                                    <Text strong style={{ fontSize: 16 }}>
                                                        {quiz.title}
                                                    </Text>
                                                    <div>
                                                        <Tag color="blue">{quiz.type}</Tag>
                                                        {getQuizStatusTag(quiz)}
                                                    </div>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size={8}>
                                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                                        Lesson: {quiz.lesson.title}
                                                    </Text>
                                                    
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                        {quiz.timed && quiz.durationInMinutes && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <ClockCircleOutlined style={{ color: '#666' }} />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    {quiz.durationInMinutes}min
                                                                </Text>
                                                            </div>
                                                        )}
                                                        
                                                        {quiz.attemptLimit && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <UserOutlined style={{ color: '#666' }} />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    Max: {quiz.attemptLimit} attempts
                                                                </Text>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {!availability.canStart && (
                                                        <Alert
                                                            message={availability.reason}
                                                            type="warning"
                                                            showIcon
                                                        />
                                                    )}
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            <TrophyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div>No quizzes available yet.</div>
                            <div style={{ fontSize: 14 }}>Check back later for new quizzes!</div>
                        </div>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserQuiz;