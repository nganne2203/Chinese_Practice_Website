import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Space, Tag, Progress, Radio, Checkbox } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { QUIZ_API } from '../../../../api/quiz';
import type { QuizSubmissionRequest } from '../../../../types/Quiz';

const { Title, Text } = Typography;

interface MultipleChoiceQuizProps {
    quiz: any;
    onComplete: (results: any) => void;
    userId: string;
}

interface MCQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    userAnswer: string | string[];
    isMultiSelect: boolean;
    completed: boolean;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ quiz, onComplete, userId }) => {
    const [questions, setQuestions] = useState<MCQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        initializeQuiz();
    }, [quiz]);

    useEffect(() => {
        if (quiz.timed && quiz.durationInMinutes && timeLeft === null) {
            setTimeLeft(quiz.durationInMinutes * 60);
        }
    }, [quiz]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && !completed) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, completed]);

    const initializeQuiz = () => {
        const mcQuestions: MCQuestion[] = quiz.questions.map((question: any) => {
            // Determine if it's multi-select based on answer format
            const isMultiSelect = question.answer.includes(',') || question.answer.includes(';');
            
            return {
                id: question.id,
                text: question.questionText,
                options: question.options || [],
                correctAnswer: question.answer,
                userAnswer: isMultiSelect ? [] : '',
                isMultiSelect,
                completed: false
            };
        });

        setQuestions(mcQuestions);
    };

    const handleSingleAnswer = (questionIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].userAnswer = value;
        updatedQuestions[questionIndex].completed = value !== '';
        setQuestions(updatedQuestions);
    };

    const handleMultipleAnswer = (questionIndex: number, values: string[]) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].userAnswer = values;
        updatedQuestions[questionIndex].completed = values.length > 0;
        setQuestions(updatedQuestions);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (completed) return;
        
        setCompleted(true);
        
        try {
            // Prepare answers for submission
            const answers: Record<string, string> = {};
            questions.forEach(question => {
                if (Array.isArray(question.userAnswer)) {
                    answers[question.id] = question.userAnswer.join(',');
                } else {
                    answers[question.id] = question.userAnswer as string;
                }
            });

            const submissionData: QuizSubmissionRequest = {
                userId,
                answers
            };

            const result = await QUIZ_API.submitQuiz(quiz.id, submissionData);
            
            // Calculate score based on correct answers
            let score = 0;
            questions.forEach(question => {
                const userAnswerStr = Array.isArray(question.userAnswer) 
                    ? question.userAnswer.sort().join(',')
                    : question.userAnswer;
                
                const correctAnswerStr = question.correctAnswer.includes(',')
                    ? question.correctAnswer.split(',').map(a => a.trim()).sort().join(',')
                    : question.correctAnswer;

                if (userAnswerStr.toLowerCase() === correctAnswerStr.toLowerCase()) {
                    score++;
                }
            });

            onComplete({
                score,
                totalQuestions: questions.length,
                completedAt: result.completedAt
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            message.error('Failed to submit quiz');
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const completedQuestions = questions.filter(q => q.completed).length;
    const progress = (completedQuestions / questions.length) * 100;

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Quiz Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={4}>Multiple Choice Quiz</Title>
                        <Text type="secondary">Choose the correct answer(s) for each question</Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {timeLeft !== null && (
                            <Tag color={timeLeft < 60 ? 'red' : 'blue'}>
                                Time: {formatTime(timeLeft)}
                            </Tag>
                        )}
                        <div style={{ marginTop: 8 }}>
                            <Progress 
                                percent={Math.round(progress)} 
                                size="small" 
                                status={progress === 100 ? 'success' : 'active'}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Navigation */}
                <Card size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </Text>
                        <div>
                            {questions.map((q, index) => (
                                <Button
                                    key={index}
                                    type={index === currentQuestionIndex ? 'primary' : q.completed ? 'default' : 'dashed'}
                                    size="small"
                                    style={{ margin: '0 2px' }}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    icon={q.completed ? <CheckCircleOutlined /> : undefined}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Current Question */}
                <Card 
                    title={
                        <Space>
                            <QuestionCircleOutlined />
                            Question {currentQuestionIndex + 1}
                            {currentQuestion.completed && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            {currentQuestion.isMultiSelect && <Tag color="orange">Multiple Select</Tag>}
                        </Space>
                    }
                >
                    <div style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 16, fontWeight: 500 }}>
                            {currentQuestion.text}
                        </Text>
                    </div>

                    {currentQuestion.isMultiSelect ? (
                        <Checkbox.Group
                            value={currentQuestion.userAnswer as string[]}
                            onChange={(values) => handleMultipleAnswer(currentQuestionIndex, values as string[])}
                            style={{ width: '100%' }}
                            disabled={completed}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {currentQuestion.options.map((option, index) => (
                                    <Card 
                                        key={index} 
                                        size="small" 
                                        hoverable={!completed}
                                        style={{ 
                                            cursor: completed ? 'default' : 'pointer',
                                            border: (currentQuestion.userAnswer as string[]).includes(option) ? '2px solid #1890ff' : undefined
                                        }}
                                    >
                                        <Checkbox value={option} style={{ fontSize: 16 }}>
                                            {option}
                                        </Checkbox>
                                    </Card>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    ) : (
                        <Radio.Group
                            value={currentQuestion.userAnswer as string}
                            onChange={(e) => handleSingleAnswer(currentQuestionIndex, e.target.value)}
                            style={{ width: '100%' }}
                            disabled={completed}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {currentQuestion.options.map((option, index) => (
                                    <Card 
                                        key={index} 
                                        size="small" 
                                        hoverable={!completed}
                                        style={{ 
                                            cursor: completed ? 'default' : 'pointer',
                                            border: currentQuestion.userAnswer === option ? '2px solid #1890ff' : undefined
                                        }}
                                    >
                                        <Radio value={option} style={{ fontSize: 16 }}>
                                            {option}
                                        </Radio>
                                    </Card>
                                ))}
                            </Space>
                        </Radio.Group>
                    )}

                    <div style={{ marginTop: 16, color: '#666' }}>
                        <Text type="secondary">
                            {currentQuestion.isMultiSelect 
                                ? 'Select all correct answers' 
                                : 'Select the best answer'
                            }
                        </Text>
                    </div>
                </Card>

                {/* Navigation and Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0 || completed}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questions.length - 1 || completed}
                            style={{ marginLeft: 8 }}
                        >
                            Next
                        </Button>
                    </div>
                    
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={completedQuestions === 0 || completed}
                        loading={completed}
                    >
                        Submit Quiz ({completedQuestions}/{questions.length} answered)
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default MultipleChoiceQuiz;