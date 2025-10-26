import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Space, Tag, Progress, Input } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { QUIZ_API } from '../../../../api/quiz';
import type { QuizSubmissionRequest } from '../../../../types/Quiz';

const { Title, Text } = Typography;

interface FillQuizProps {
    quiz: any;
    onComplete: (results: any) => void;
    userId: string;
}

interface FillQuestion {
    id: string;
    text: string;
    blanks: string[];
    userAnswers: string[];
    completed: boolean;
}

const FillQuiz: React.FC<FillQuizProps> = ({ quiz, onComplete, userId }) => {
    const [questions, setQuestions] = useState<FillQuestion[]>([]);
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
        const fillQuestions: FillQuestion[] = quiz.questions.map((question: any) => {
            // Parse question text to find blanks (assuming format like "This is a _____ sentence with _____ blanks")
            const text = question.questionText;
            const blanks = text.match(/_{3,}/g) || [];
            
            return {
                id: question.id,
                text,
                blanks,
                userAnswers: new Array(blanks.length).fill(''),
                completed: false
            };
        });

        setQuestions(fillQuestions);
    };

    const handleAnswerChange = (questionIndex: number, blankIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].userAnswers[blankIndex] = value;
        updatedQuestions[questionIndex].completed = updatedQuestions[questionIndex].userAnswers.every(answer => answer.trim() !== '');
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
                // Combine all blanks answers into a single string for this question
                answers[question.id] = question.userAnswers.join('|');
            });

            const submissionData: QuizSubmissionRequest = {
                userId,
                answers
            };

            const result = await QUIZ_API.submitQuiz(quiz.id, submissionData);
            
            // Calculate score based on correct answers
            let score = 0;
            questions.forEach(question => {
                const originalQuestion = quiz.questions.find((q: any) => q.id === question.id);
                if (originalQuestion) {
                    const correctAnswers = originalQuestion.answer.split('|');
                    const userAnswers = question.userAnswers;
                    
                    if (correctAnswers.length === userAnswers.length) {
                        const isCorrect = correctAnswers.every((correct: string, index: number) => 
                            correct.toLowerCase().trim() === userAnswers[index].toLowerCase().trim()
                        );
                        if (isCorrect) score++;
                    }
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

    const renderTextWithBlanks = (text: string, userAnswers: string[], questionIndex: number) => {
        const parts = text.split(/_{3,}/);
        const result = [];
        
        for (let i = 0; i < parts.length; i++) {
            result.push(<span key={`text-${i}`}>{parts[i]}</span>);
            
            if (i < parts.length - 1) {
                result.push(
                    <Input
                        key={`blank-${i}`}
                        value={userAnswers[i] || ''}
                        onChange={(e) => handleAnswerChange(questionIndex, i, e.target.value)}
                        style={{ 
                            width: 150, 
                            margin: '0 8px',
                            display: 'inline-block'
                        }}
                        placeholder={`Blank ${i + 1}`}
                        disabled={completed}
                    />
                );
            }
        }
        
        return result;
    };

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={4}>Fill in the Blanks</Title>
                        <Text type="secondary">Complete the sentences by filling in the missing words</Text>
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

                <Card 
                    title={
                        <Space>
                            <EditOutlined />
                            Question {currentQuestionIndex + 1}
                            {currentQuestion.completed && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        </Space>
                    }
                >
                    <div style={{ fontSize: 16, lineHeight: 2 }}>
                        {renderTextWithBlanks(currentQuestion.text, currentQuestion.userAnswers, currentQuestionIndex)}
                    </div>
                    
                    <div style={{ marginTop: 16, color: '#666' }}>
                        <Text type="secondary">
                            Fill in {currentQuestion.blanks.length} blank{currentQuestion.blanks.length > 1 ? 's' : ''} in this sentence.
                        </Text>
                    </div>
                </Card>

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
                        Submit Quiz ({completedQuestions}/{questions.length} completed)
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default FillQuiz;