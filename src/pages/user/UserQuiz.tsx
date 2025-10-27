import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Button, message, Spin, Alert, Row, Col, Tag, Statistic } from 'antd';
import { 
    TrophyOutlined, 
    ClockCircleOutlined, 
    PlayCircleOutlined, 
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { QUIZ_API } from '../../api/quiz';
import { useAuth } from '../../contexts/AuthContext';
import type { QuizResponse, QuizSubmissionRequest, QuizResultResponse } from '../../types/Quiz';
import { QUIZ_TYPE } from '../../constants/QuizType';
import MatchQuiz from './quiz/MatchQuiz';
import FillQuiz from './quiz/FillQuiz';
import MultipleChoiceQuiz from './quiz/MultipleChoiceQuiz';

const { Title, Text } = Typography;

interface QuizState {
    status: 'loading' | 'ready' | 'starting' | 'in-progress' | 'completed' | 'error';
    quiz: QuizResponse | null;
    result: QuizResultResponse | null;
    startTime: Date | null;
    timeRemaining: number | null; // in seconds
    answers: Record<string, string | string[]>;
}

const UserQuiz: React.FC = () => {
    const navigate = useNavigate();
    const { quizId } = useParams<{ quizId: string }>();
    const { user } = useAuth();
    const [quizState, setQuizState] = useState<QuizState>({
        status: 'loading',
        quiz: null,
        result: null,
        startTime: null,
        timeRemaining: null,
        answers: {}
    });

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    useEffect(() => {
        if (quizState.status === 'in-progress' && quizState.timeRemaining !== null && quizState.timeRemaining > 0) {
            const timer = setInterval(() => {
                setQuizState(prev => {
                    if (prev.timeRemaining === null || prev.timeRemaining <= 1) {
                        handleAutoSubmit();
                        return { ...prev, timeRemaining: 0 };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizState.status, quizState.timeRemaining]);

    const fetchQuiz = async () => {
        if (!quizId) return;
        
        try {
            setQuizState(prev => ({ ...prev, status: 'loading' }));
            const quizData = await QUIZ_API.getQuizById(quizId);
            setQuizState(prev => ({ 
                ...prev, 
                status: 'ready', 
                quiz: quizData 
            }));
        } catch (error) {
            console.error('Error fetching quiz:', error);
            message.error('Failed to load quiz');
            setQuizState(prev => ({ ...prev, status: 'error' }));
        }
    };

    const validateQuizAccess = (): { canStart: boolean; reason?: string } => {
        if (!quizState.quiz) return { canStart: false, reason: 'Quiz not found' };
        
        const now = new Date();
        const quiz = quizState.quiz;
        
        if (quiz.startTime && quiz.endTime) {
            const startTime = new Date(quiz.startTime);
            const endTime = new Date(quiz.endTime);
            
            if (now < startTime) {
                return { 
                    canStart: false, 
                    reason: `Quiz will be available from ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}` 
                };
            }
            
            if (now > endTime) {
                return { 
                    canStart: false, 
                    reason: 'Quiz period has ended' 
                };
            }
        }
        
        return { canStart: true };
    };

    const handleStartQuiz = async () => {
        if (!quizState.quiz || !user) return;
        
        const validation = validateQuizAccess();
        if (!validation.canStart) {
            message.error(validation.reason);
            return;
        }

        try {
            // Set starting state to show loading
            setQuizState(prev => ({ ...prev, status: 'starting' }));
            
            const startSuccess = await QUIZ_API.startQuiz(quizState.quiz.id, user.id);
            
            if (startSuccess) {
                const quizWithQuestions = await QUIZ_API.getQuizById(quizState.quiz.id);
                
                const startTime = new Date();
                let timeRemaining = null;
                
                if (quizWithQuestions.timed && quizWithQuestions.durationInMinutes) {
                    timeRemaining = quizWithQuestions.durationInMinutes * 60;
                }
                
                setQuizState(prev => ({
                    ...prev,
                    status: 'in-progress',
                    quiz: quizWithQuestions,
                    startTime,
                    timeRemaining,
                    answers: {}
                }));
                
                message.success('Quiz started! Good luck!');
            } else {
                setQuizState(prev => ({ ...prev, status: 'ready' }));
                message.error('Failed to start quiz. Server returned unsuccessful response.');
            }
        } catch (error) {
            console.error('Error starting quiz:', error);
            setQuizState(prev => ({ ...prev, status: 'ready' }));
            message.error('Failed to start quiz. Please try again.');
        }
    };

    const handleAnswerChange = (questionId: string, answer: string | string[]) => {
        setQuizState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: answer
            }
        }));
    };

    const handleAutoSubmit = async () => {
        message.warning('Time\'s up! Submitting your answers automatically.');
        await handleSubmitQuiz();
    };

    const handleSubmitQuiz = async () => {
        if (!quizState.quiz || !user) return;
        
        try {
            const submissionData: QuizSubmissionRequest = {
                userId: user.id,
                answers: Object.fromEntries(
                    Object.entries(quizState.answers).map(([key, value]) => [
                        key, 
                        Array.isArray(value) ? value.join(',') : value
                    ])
                )
            };

            const result = await QUIZ_API.submitQuiz(quizState.quiz.id, submissionData);
            
            setQuizState(prev => ({
                ...prev,
                status: 'completed',
                result
            }));
            
            message.success('Quiz submitted successfully!');
        } catch (error) {
            console.error('Error submitting quiz:', error);
            message.error('Failed to submit quiz. Please try again.');
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderQuizContent = () => {
        if (!quizState.quiz) return null;

        const { quiz } = quizState;
        const props = {
            quiz,
            answers: quizState.answers,
            onAnswerChange: handleAnswerChange,
            onSubmit: handleSubmitQuiz
        };

        switch (quiz.type) {
            case QUIZ_TYPE.MULTIPLE_CHOICE:
                return <MultipleChoiceQuiz {...props} />;
            case QUIZ_TYPE.MATCHING:
                return <MatchQuiz {...props} />;
            case QUIZ_TYPE.FILL_IN_BLANK:
                return <FillQuiz {...props} />;
            default:
                return (
                    <Alert
                        message="Unsupported Quiz Type"
                        description={`Quiz type "${quiz.type}" is not yet supported.`}
                        type="warning"
                        showIcon
                    />
                );
        }
    };

    if (quizState.status === 'loading') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (quizState.status === 'error' || !quizState.quiz) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Quiz Not Found"
                    description="The quiz you're looking for doesn't exist or has been removed."
                    type="error"
                    action={
                        <Button size="small" onClick={() => navigate('/app/quizzes')}>
                            Back to Quizzes
                        </Button>
                    }
                />
            </div>
        );
    }

    const { quiz } = quizState;
    const validation = validateQuizAccess();

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/app/quizzes')}
                            style={{ marginBottom: 8 }}
                        >
                            Back to Quizzes
                        </Button>
                        
                        <div>
                            <Tag color="blue">{quiz.lesson.unit.level.name}</Tag>
                            <Tag color="green">{quiz.lesson.unit.title}</Tag>
                            <Tag color="purple">{quiz.type}</Tag>
                        </div>
                        
                        <Title level={1} style={{ margin: 0 }}>
                            {quiz.title}
                        </Title>
                        
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            {quiz.lesson.title}
                        </Text>

                        {quizState.status === 'in-progress' && quizState.timeRemaining !== null && (
                            <Alert
                                message={
                                    <Space>
                                        <ClockCircleOutlined />
                                        <span>Time Remaining: {formatTime(quizState.timeRemaining)}</span>
                                    </Space>
                                }
                                type={quizState.timeRemaining < 300 ? 'warning' : 'info'} // Warning when < 5 minutes
                                banner
                            />
                        )}
                    </Space>
                </Card>

                {(quizState.status === 'ready' || quizState.status === 'starting') && (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card title={
                                <Space>
                                    <TrophyOutlined />
                                    <span>Quiz Information</span>
                                </Space>
                            }>
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <Statistic
                                                title="Questions"
                                                value={quiz.questions.length}
                                                prefix={<TrophyOutlined />}
                                            />
                                        </Col>
                                        {quiz.timed && quiz.durationInMinutes && (
                                            <Col span={8}>
                                                <Statistic
                                                    title="Duration"
                                                    value={quiz.durationInMinutes}
                                                    suffix="minutes"
                                                    prefix={<ClockCircleOutlined />}
                                                />
                                            </Col>
                                        )}
                                        {quiz.attemptLimit && (
                                            <Col span={8}>
                                                <Statistic
                                                    title="Attempts Allowed"
                                                    value={quiz.attemptLimit}
                                                    prefix={<ExclamationCircleOutlined />}
                                                />
                                            </Col>
                                        )}
                                    </Row>

                                    {!validation.canStart && (
                                        <Alert
                                            message="Quiz Not Available"
                                            description={validation.reason}
                                            type="warning"
                                            showIcon
                                        />
                                    )}

                                    <Button 
                                        type="primary" 
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        onClick={handleStartQuiz}
                                        disabled={!validation.canStart}
                                        loading={quizState.status === 'starting'}
                                    >
                                        {quizState.status === 'starting' ? 'Starting Quiz...' : 'Start Quiz'}
                                    </Button>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Instructions">
                                <Space direction="vertical" size="middle">
                                    <div>
                                        <Text strong>Before you start:</Text>
                                        <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                                            <li>Read each question carefully</li>
                                            <li>You can change your answers before submitting</li>
                                            {quiz.timed && <li>Keep an eye on the timer</li>}
                                            {quiz.attemptLimit && <li>You have limited attempts</li>}
                                        </ul>
                                    </div>
                                    
                                    <Alert
                                        message="Good Luck!"
                                        description="Take your time and do your best. You've got this!"
                                        type="success"
                                        showIcon
                                    />
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                )}

                {quizState.status === 'in-progress' && renderQuizContent()}

                {quizState.status === 'completed' && quizState.result && (
                    <Card title={
                        <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <span>Quiz Completed!</span>
                        </Space>
                    }>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic
                                        title="Your Score"
                                        value={quizState.result.score}
                                        suffix={`/ ${quizState.result.totalQuestions}`}
                                        prefix={<TrophyOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Percentage"
                                        value={(quizState.result.score / quizState.result.totalQuestions * 100).toFixed(1)}
                                        suffix="%"
                                        valueStyle={{ 
                                            color: (quizState.result.score / quizState.result.totalQuestions) >= 0.7 ? '#52c41a' : '#fa8c16' 
                                        }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Completed"
                                        value={new Date(quizState.result.completedAt).toLocaleString()}
                                        valueStyle={{ fontSize: 14 }}
                                    />
                                </Col>
                            </Row>

                            <Space>
                                <Button 
                                    type="primary" 
                                    onClick={() => navigate('/app/quizzes')}
                                >
                                    More Quizzes
                                </Button>
                                <Button 
                                    onClick={() => navigate(`/app/lessons/${quiz.lesson.id}`)}
                                >
                                    Back to Lesson
                                </Button>
                                <Button 
                                    onClick={() => window.location.reload()}
                                >
                                    Retake Quiz
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default UserQuiz;