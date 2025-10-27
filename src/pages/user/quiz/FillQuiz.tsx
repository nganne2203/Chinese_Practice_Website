import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Input, Button, Progress, Alert, Row, Col } from 'antd';
import { CheckCircleOutlined, EditOutlined, ClearOutlined } from '@ant-design/icons';
import type { QuizResponse } from '../../../types/Quiz';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FillQuizProps {
    quiz: QuizResponse;
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, answer: string | string[]) => void;
    onSubmit: () => void;
}

interface BlankQuestion {
    id: string;
    questionText: string;
    blanks: string[];
    userAnswers: string[];
}

const FillQuiz: React.FC<FillQuizProps> = ({
    quiz,
    answers,
    onAnswerChange,
    onSubmit
}) => {
    const [blankQuestions, setBlankQuestions] = useState<BlankQuestion[]>([]);

    useEffect(() => {
        const parsedQuestions = quiz.questions.map(question => {
            const questionId = question.id;
            const questionText = question.questionText;
            
            const blankRegex = /____+|\[blank\]|\[_+\]/gi;
            const blanks = questionText.match(blankRegex) || [];
            
            const existingAnswer = answers[questionId];
            let userAnswers: string[] = [];
            
            if (typeof existingAnswer === 'string') {
                userAnswers = existingAnswer.split(',').map(a => a.trim());
            } else if (Array.isArray(existingAnswer)) {
                userAnswers = existingAnswer.map(a => String(a));
            }
            
            while (userAnswers.length < blanks.length) {
                userAnswers.push('');
            }

            return {
                id: questionId,
                questionText,
                blanks,
                userAnswers
            };
        });

        setBlankQuestions(parsedQuestions);
    }, [quiz.questions, answers]);

    const handleBlankChange = (questionId: string, blankIndex: number, value: string) => {
        const updatedQuestions = blankQuestions.map(question => {
            if (question.id === questionId) {
                const newUserAnswers = [...question.userAnswers];
                newUserAnswers[blankIndex] = value;
                
                const answerString = newUserAnswers.join(',');
                onAnswerChange(questionId, answerString);
                
                return {
                    ...question,
                    userAnswers: newUserAnswers
                };
            }
            return question;
        });
        
        setBlankQuestions(updatedQuestions);
    };

    const clearQuestion = (questionId: string) => {
        const updatedQuestions = blankQuestions.map(question => {
            if (question.id === questionId) {
                const emptyAnswers = new Array(question.blanks.length).fill('');
                onAnswerChange(questionId, '');
                return {
                    ...question,
                    userAnswers: emptyAnswers
                };
            }
            return question;
        });
        
        setBlankQuestions(updatedQuestions);
    };

    const renderQuestionWithBlanks = (question: BlankQuestion) => {
        let questionText = question.questionText;
        let blankIndex = 0;
        
        const blankRegex = /____+|\[blank\]|\[_+\]/gi;
        
        const parts = questionText.split(blankRegex);
        const elements: React.ReactNode[] = [];
        
        parts.forEach((part, index) => {
            elements.push(
                <span key={`text-${index}`} style={{ fontSize: 16 }}>
                    {part}
                </span>
            );
            
            if (blankIndex < question.blanks.length) {
                elements.push(
                    <Input
                        key={`blank-${blankIndex}`}
                        value={question.userAnswers[blankIndex] || ''}
                        onChange={(e) => handleBlankChange(question.id, blankIndex, e.target.value)}
                        style={{
                            width: Math.max(120, (question.userAnswers[blankIndex] || '').length * 12 + 40),
                            minWidth: 120,
                            margin: '0 4px',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }}
                        placeholder={`Blank ${blankIndex + 1}`}
                        size="small"
                    />
                );
                blankIndex++;
            }
        });
        
        return elements;
    };

    const getQuestionCompletionStatus = (question: BlankQuestion) => {
        const filledBlanks = question.userAnswers.filter(answer => answer.trim() !== '').length;
        return {
            filled: filledBlanks,
            total: question.blanks.length,
            isComplete: filledBlanks === question.blanks.length
        };
    };

    const getTotalProgress = () => {
        const totalBlanks = blankQuestions.reduce((sum, q) => sum + q.blanks.length, 0);
        const filledBlanks = blankQuestions.reduce((sum, q) => {
            return sum + q.userAnswers.filter(answer => answer.trim() !== '').length;
        }, 0);
        
        return {
            filled: filledBlanks,
            total: totalBlanks,
            percent: totalBlanks > 0 ? (filledBlanks / totalBlanks) * 100 : 0
        };
    };

    const progress = getTotalProgress();
    const canSubmit = progress.filled === progress.total;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Progress Header */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={3} style={{ margin: 0 }}>
                                <EditOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                                Fill in the Blanks
                            </Title>
                            <Text strong>
                                {progress.filled} / {progress.total} blanks filled
                            </Text>
                        </div>
                        
                        <Progress 
                            percent={progress.percent} 
                            status={canSubmit ? 'success' : 'active'}
                            strokeColor={canSubmit ? '#52c41a' : '#fa8c16'}
                        />
                        
                        <Alert
                            message="Instructions"
                            description="Fill in all the blanks with appropriate words or phrases. Make sure to check your spelling and grammar."
                            type="info"
                            showIcon
                        />
                    </Space>
                </Card>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {blankQuestions.map((question, index) => {
                        const status = getQuestionCompletionStatus(question);
                        
                        return (
                            <Card 
                                key={question.id}
                                style={{ 
                                    border: status.isComplete ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                    transition: 'all 0.3s ease'
                                }}
                                title={
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Space>
                                            {status.isComplete && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                            <span>Question {index + 1}</span>
                                            <Text type="secondary">
                                                ({status.filled}/{status.total} filled)
                                            </Text>
                                        </Space>
                                        <Button
                                            type="text"
                                            icon={<ClearOutlined />}
                                            onClick={() => clearQuestion(question.id)}
                                            disabled={status.filled === 0}
                                            style={{ color: '#ff4d4f' }}
                                        >
                                            Clear
                                        </Button>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div style={{ 
                                        lineHeight: '2.5',
                                        padding: '16px',
                                        backgroundColor: '#fafafa',
                                        borderRadius: '6px',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        {renderQuestionWithBlanks(question)}
                                    </div>

                                    <Progress
                                        percent={(status.filled / status.total) * 100}
                                        size="small"
                                        status={status.isComplete ? 'success' : 'active'}
                                        strokeColor={status.isComplete ? '#52c41a' : '#fa8c16'}
                                    />

                                    {quiz.questions[index].options.length > 0 && (
                                        <Alert
                                            message="Hints"
                                            description={
                                                <div>
                                                    <Text type="secondary">Possible answers: </Text>
                                                    {quiz.questions[index].options.map((option, optIndex) => (
                                                        <Text 
                                                            key={optIndex} 
                                                            code 
                                                            style={{ 
                                                                margin: '0 4px',
                                                                backgroundColor: '#f0f0f0',
                                                                padding: '2px 6px',
                                                                borderRadius: '3px'
                                                            }}
                                                        >
                                                            {option}
                                                        </Text>
                                                    ))}
                                                </div>
                                            }
                                            type="info"
                                            showIcon
                                            style={{ marginTop: 8 }}
                                        />
                                    )}
                                </Space>
                            </Card>
                        );
                    })}
                </Space>

                <Card style={{ background: '#fafafa', textAlign: 'center' }}>
                    <Space direction="vertical" size="middle">
                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Ready to submit your answers?
                            </Text>
                            <br />
                            <Text type="secondary">
                                Make sure all blanks are filled. Double-check your spelling and grammar.
                            </Text>
                        </div>
                        
                        <Row justify="center" gutter={16}>
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={onSubmit}
                                    disabled={!canSubmit}
                                    style={{ minWidth: 200 }}
                                >
                                    Submit Quiz
                                </Button>
                            </Col>
                        </Row>
                        
                        {!canSubmit && (
                            <Alert
                                message={`${progress.total - progress.filled} blank(s) remaining`}
                                type="warning"
                                showIcon
                                style={{ marginTop: 12, maxWidth: 300, margin: '12px auto 0' }}
                            />
                        )}
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default FillQuiz;