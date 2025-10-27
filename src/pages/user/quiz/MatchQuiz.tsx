import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Progress, Alert, Row, Col, Tag } from 'antd';
import { CheckCircleOutlined, SwapOutlined, ReloadOutlined } from '@ant-design/icons';
import type { QuizResponse } from '../../../types/Quiz';

const { Title, Text } = Typography;

interface MatchQuizProps {
    quiz: QuizResponse;
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, answer: string | string[]) => void;
    onSubmit: () => void;
}

interface MatchPair {
    id: string;
    questionText: string;
    correctAnswer: string;
    options: string[];
}

interface UserMatch {
    questionId: string;
    selectedAnswer: string;
}

const MatchQuiz: React.FC<MatchQuizProps> = ({
    quiz,
    answers,
    onAnswerChange,
    onSubmit
}) => {
    const [matches, setMatches] = useState<UserMatch[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    // Convert quiz questions to match pairs format
    const matchPairs: MatchPair[] = quiz.questions.map(question => ({
        id: question.id,
        questionText: question.questionText,
        correctAnswer: question.answer,
        options: question.options
    }));

    useEffect(() => {
        // Shuffle the right-side options for matching
        const allOptions = matchPairs.flatMap(pair => pair.options);
        const uniqueOptions = [...new Set(allOptions)];
        setShuffledOptions(shuffleArray(uniqueOptions));

        // Initialize matches from existing answers
        const initialMatches: UserMatch[] = [];
        Object.entries(answers).forEach(([questionId, answer]) => {
            if (typeof answer === 'string') {
                initialMatches.push({ questionId, selectedAnswer: answer });
            }
        });
        setMatches(initialMatches);
    }, [quiz.questions, answers]);

    const shuffleArray = (array: string[]): string[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleLeftItemClick = (questionId: string) => {
        if (selectedLeft === questionId) {
            setSelectedLeft(null);
        } else {
            setSelectedLeft(questionId);
            setSelectedRight(null);
        }
    };

    const handleRightItemClick = (option: string) => {
        if (selectedRight === option) {
            setSelectedRight(null);
        } else {
            setSelectedRight(option);
            if (selectedLeft) {
                createMatch(selectedLeft, option);
            }
        }
    };

    const createMatch = (questionId: string, answer: string) => {
        // Remove any existing match for this question
        const newMatches = matches.filter(match => match.questionId !== questionId);
        newMatches.push({ questionId, selectedAnswer: answer });
        
        setMatches(newMatches);
        onAnswerChange(questionId, answer);
        
        // Clear selections
        setSelectedLeft(null);
        setSelectedRight(null);
    };

    const removeMatch = (questionId: string) => {
        const newMatches = matches.filter(match => match.questionId !== questionId);
        setMatches(newMatches);
        onAnswerChange(questionId, '');
    };

    const getMatchForQuestion = (questionId: string): UserMatch | undefined => {
        return matches.find(match => match.questionId === questionId);
    };

    const isOptionMatched = (option: string): boolean => {
        return matches.some(match => match.selectedAnswer === option);
    };

    const resetAllMatches = () => {
        setMatches([]);
        setSelectedLeft(null);
        setSelectedRight(null);
        matchPairs.forEach(pair => onAnswerChange(pair.id, ''));
    };

    const progressPercent = (matches.length / matchPairs.length) * 100;
    const canSubmit = matches.length === matchPairs.length;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Progress Header */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={3} style={{ margin: 0 }}>
                                <SwapOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                                Matching Quiz
                            </Title>
                            <Space>
                                <Button 
                                    icon={<ReloadOutlined />} 
                                    onClick={resetAllMatches}
                                    disabled={matches.length === 0}
                                >
                                    Reset All
                                </Button>
                                <Text strong>
                                    {matches.length} / {matchPairs.length} matched
                                </Text>
                            </Space>
                        </div>
                        
                        <Progress 
                            percent={progressPercent} 
                            status={canSubmit ? 'success' : 'active'}
                            strokeColor={canSubmit ? '#52c41a' : '#722ed1'}
                        />
                        
                        <Alert
                            message="Instructions"
                            description="Click on a question on the left, then click on the matching answer on the right to create a match. Click on matched items to disconnect them."
                            type="info"
                            showIcon
                        />
                    </Space>
                </Card>

                {/* Matching Area */}
                <Card title="Match the questions with their correct answers">
                    <Row gutter={[24, 16]}>
                        {/* Left Side - Questions */}
                        <Col xs={24} md={12}>
                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <Title level={4} style={{ color: '#1890ff' }}>Questions</Title>
                            </div>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {matchPairs.map((pair, index) => {
                                    const match = getMatchForQuestion(pair.id);
                                    const isSelected = selectedLeft === pair.id;
                                    const isMatched = !!match;

                                    return (
                                        <Card
                                            key={pair.id}
                                            size="small"
                                            hoverable
                                            onClick={() => handleLeftItemClick(pair.id)}
                                            style={{
                                                cursor: 'pointer',
                                                border: isSelected ? '2px solid #1890ff' : 
                                                       isMatched ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                                backgroundColor: isSelected ? '#e6f7ff' : 
                                                               isMatched ? '#f6ffed' : '#fafafa',
                                                transition: 'all 0.3s ease',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ flex: 1 }}>
                                                    <Text strong style={{ color: '#1890ff' }}>
                                                        Q{index + 1}.
                                                    </Text>
                                                    <Text style={{ marginLeft: 8, fontSize: 14 }}>
                                                        {pair.questionText}
                                                    </Text>
                                                </div>
                                                
                                                {isMatched && (
                                                    <div style={{ marginLeft: 12 }}>
                                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeMatch(pair.id);
                                                            }}
                                                            style={{ marginLeft: 4, color: '#ff4d4f' }}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isMatched && (
                                                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e8f5e8' }}>
                                                    <Tag color="green" style={{ fontSize: 12 }}>
                                                        Matched with: {match.selectedAnswer}
                                                    </Tag>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </Space>
                        </Col>

                        {/* Right Side - Options */}
                        <Col xs={24} md={12}>
                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <Title level={4} style={{ color: '#fa8c16' }}>Answers</Title>
                            </div>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {shuffledOptions.map((option, index) => {
                                    const isSelected = selectedRight === option;
                                    const isMatched = isOptionMatched(option);

                                    return (
                                        <Card
                                            key={`${option}-${index}`}
                                            size="small"
                                            hoverable
                                            onClick={() => !isMatched && handleRightItemClick(option)}
                                            style={{
                                                cursor: isMatched ? 'not-allowed' : 'pointer',
                                                border: isSelected ? '2px solid #fa8c16' : 
                                                       isMatched ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                                backgroundColor: isSelected ? '#fff7e6' : 
                                                               isMatched ? '#f6ffed' : '#fafafa',
                                                opacity: isMatched ? 0.6 : 1,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ flex: 1 }}>
                                                    <Text strong style={{ color: '#fa8c16' }}>
                                                        {String.fromCharCode(65 + index)}.
                                                    </Text>
                                                    <Text style={{ marginLeft: 8, fontSize: 14 }}>
                                                        {option}
                                                    </Text>
                                                </div>
                                                
                                                {isMatched && (
                                                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Submit Section */}
                <Card style={{ background: '#fafafa', textAlign: 'center' }}>
                    <Space direction="vertical" size="middle">
                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Ready to submit your matches?
                            </Text>
                            <br />
                            <Text type="secondary">
                                Make sure all questions are matched with their answers.
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
                            <Alert
                                message={`${matchPairs.length - matches.length} match(es) remaining`}
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

export default MatchQuiz;