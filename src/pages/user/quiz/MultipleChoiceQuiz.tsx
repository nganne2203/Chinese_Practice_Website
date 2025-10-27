import React from 'react';
import { Card, Typography, Space, Radio, Checkbox, Button, Progress, Alert } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { QuizResponse } from '../../../types/Quiz';

const { Title, Text } = Typography;

interface MultipleChoiceQuizProps {
    quiz: QuizResponse;
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, answer: string | string[]) => void;
    onSubmit: () => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
    quiz,
    answers,
    onAnswerChange,
    onSubmit
}) => {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = quiz.questions.length;
    const progressPercent = (answeredCount / totalQuestions) * 100;

    const handleSingleChoiceChange = (questionId: string, value: string) => {
        onAnswerChange(questionId, value);
    };

    const handleMultipleChoiceChange = (questionId: string, checkedValues: string[]) => {
        onAnswerChange(questionId, checkedValues);
    };

    const isMultipleChoice = (options: string[]): boolean => {
        return options.length > 4 || options.some(option => 
            option.toLowerCase().includes('all of the above') ||
            option.toLowerCase().includes('both') ||
            option.toLowerCase().includes('multiple')
        );
    };

    const canSubmit = answeredCount === totalQuestions;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Progress Header */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={3} style={{ margin: 0 }}>
                                <QuestionCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                Multiple Choice Quiz
                            </Title>
                            <Text strong>
                                {answeredCount} / {totalQuestions} answered
                            </Text>
                        </div>
                        
                        <Progress 
                            percent={progressPercent} 
                            status={canSubmit ? 'success' : 'active'}
                            strokeColor={canSubmit ? '#52c41a' : '#1890ff'}
                        />
                        
                        {!canSubmit && (
                            <Alert
                                message="Please answer all questions before submitting"
                                type="info"
                                showIcon
                                style={{ marginTop: 8 }}
                            />
                        )}
                    </Space>
                </Card>

                {/* Questions */}
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {quiz.questions.map((question, index) => {
                        const isAnswered = question.id in answers;
                        const isMultiple = isMultipleChoice(question.options);
                        const currentAnswer = answers[question.id];

                        return (
                            <Card 
                                key={question.id}
                                style={{ 
                                    border: isAnswered ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                    transition: 'all 0.3s ease'
                                }}
                                title={
                                    <Space>
                                        {isAnswered && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                        <span>Question {index + 1}</span>
                                        {isMultiple && <Text type="secondary">(Multiple answers)</Text>}
                                    </Space>
                                }
                            >
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <Title level={4} style={{ margin: 0, fontSize: 18 }}>
                                        {question.questionText}
                                    </Title>

                                    <div style={{ paddingLeft: 16 }}>
                                        {isMultiple ? (
                                            <Checkbox.Group
                                                style={{ width: '100%' }}
                                                value={Array.isArray(currentAnswer) ? currentAnswer : []}
                                                onChange={(checkedValues) => 
                                                    handleMultipleChoiceChange(question.id, checkedValues as string[])
                                                }
                                            >
                                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                    {question.options.map((option, optionIndex) => (
                                                        <Checkbox 
                                                            key={optionIndex} 
                                                            value={option}
                                                            style={{ 
                                                                display: 'block',
                                                                padding: '12px 16px',
                                                                border: '1px solid #f0f0f0',
                                                                borderRadius: '6px',
                                                                margin: 0,
                                                                backgroundColor: Array.isArray(currentAnswer) && currentAnswer.includes(option) 
                                                                    ? '#f6ffed' : '#fafafa',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <Text style={{ fontSize: 16 }}>
                                                                {String.fromCharCode(65 + optionIndex)}. {option}
                                                            </Text>
                                                        </Checkbox>
                                                    ))}
                                                </Space>
                                            </Checkbox.Group>
                                        ) : (
                                            <Radio.Group
                                                style={{ width: '100%' }}
                                                value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
                                                onChange={(e) => handleSingleChoiceChange(question.id, e.target.value)}
                                            >
                                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                    {question.options.map((option, optionIndex) => (
                                                        <Radio 
                                                            key={optionIndex} 
                                                            value={option}
                                                            style={{ 
                                                                display: 'block',
                                                                padding: '12px 16px',
                                                                border: '1px solid #f0f0f0',
                                                                borderRadius: '6px',
                                                                margin: 0,
                                                                backgroundColor: currentAnswer === option 
                                                                    ? '#e6f7ff' : '#fafafa',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <Text style={{ fontSize: 16 }}>
                                                                {String.fromCharCode(65 + optionIndex)}. {option}
                                                            </Text>
                                                        </Radio>
                                                    ))}
                                                </Space>
                                            </Radio.Group>
                                        )}
                                    </div>
                                </Space>
                            </Card>
                        );
                    })}
                </Space>

                {/* Submit Section */}
                <Card style={{ background: '#fafafa', textAlign: 'center' }}>
                    <Space direction="vertical" size="middle">
                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Ready to submit your answers?
                            </Text>
                            <br />
                            <Text type="secondary">
                                Make sure you've answered all questions. You can review and change your answers above.
                            </Text>
                        </div>
                        
                        <Button
                            type="primary"
                            size="large"
                            onClick={onSubmit}
                            disabled={!canSubmit}
                            style={{ minWidth: 200 }}
                        >
                            Submit Quiz
                        </Button>
                        
                        {!canSubmit && (
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                {totalQuestions - answeredCount} question(s) remaining
                            </Text>
                        )}
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default MultipleChoiceQuiz;