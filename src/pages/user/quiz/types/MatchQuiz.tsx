import React, { useState, useEffect } from 'react';
import { Card, Button, message, Row, Col, Typography, Space, Tag, Progress } from 'antd';
import { CheckCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { QUIZ_API } from '../../../../api/quiz';
import type { QuizSubmissionRequest } from '../../../../types/Quiz';

const { Title, Text } = Typography;

interface MatchQuizProps {
    quiz: any;
    onComplete: (results: any) => void;
    userId: string;
}

interface MatchPair {
    id: string;
    left: string;
    right: string;
    matched: boolean;
}

const MatchQuiz: React.FC<MatchQuizProps> = ({ quiz, onComplete, userId }) => {
    const [pairs, setPairs] = useState<MatchPair[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
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
        const matchPairs: MatchPair[] = quiz.questions.map((question: any, index: number) => {
            const [left, right] = question.questionText.split(':');
            return {
                id: question.id,
                left: left?.trim() || `Item ${index + 1}`,
                right: right?.trim() || question.answer,
                matched: false
            };
        });

        const shuffledRights = [...matchPairs].sort(() => Math.random() - 0.5);
        const finalPairs = matchPairs.map((pair, index) => ({
            ...pair,
            right: shuffledRights[index].right
        }));

        setPairs(finalPairs);
    };

    const handleLeftSelect = (pairId: string) => {
        if (matches[pairId]) return;
        setSelectedLeft(selectedLeft === pairId ? null : pairId);
        setSelectedRight(null);
    };

    const handleRightSelect = (rightText: string) => {
        if (Object.values(matches).includes(rightText)) return; // Already matched
        
        if (selectedLeft) {
            const newMatches = { ...matches, [selectedLeft]: rightText };
            setMatches(newMatches);
            setSelectedLeft(null);
            setSelectedRight(null);

            if (Object.keys(newMatches).length === pairs.length) {
                setTimeout(() => handleSubmit(), 1000);
            }
        } else {
            setSelectedRight(selectedRight === rightText ? null : rightText);
        }
    };

    const handleSubmit = async () => {
        if (completed) return;
        
        setCompleted(true);
        
        try {
            let score = 0;
            pairs.forEach(pair => {
                const originalPair = quiz.questions.find((q: any) => q.id === pair.id);
                if (originalPair && matches[pair.id] === originalPair.answer) {
                    score++;
                }
            });

            const submissionData: QuizSubmissionRequest = {
                userId,
                answers: matches
            };

            const result = await QUIZ_API.submitQuiz(quiz.id, submissionData);
            onComplete({
                score,
                totalQuestions: pairs.length,
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

    const progress = (Object.keys(matches).length / pairs.length) * 100;

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Quiz Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={4}>Match the Pairs</Title>
                        <Text type="secondary">Connect the Chinese words with their meanings</Text>
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

                {/* Instructions */}
                <Card size="small">
                    <Text>
                        <SwapOutlined style={{ marginRight: 8 }} />
                        Click on a word from the left column, then click on its matching meaning from the right column.
                    </Text>
                </Card>

                {/* Matching Interface */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Card title="Chinese Words" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {pairs.map((pair) => (
                                    <Button
                                        key={pair.id}
                                        type={selectedLeft === pair.id ? 'primary' : matches[pair.id] ? 'default' : 'dashed'}
                                        block
                                        style={{ 
                                            height: 'auto', 
                                            padding: '12px',
                                            textAlign: 'left',
                                            backgroundColor: matches[pair.id] ? '#f6ffed' : undefined,
                                            borderColor: matches[pair.id] ? '#52c41a' : undefined
                                        }}
                                        onClick={() => handleLeftSelect(pair.id)}
                                        disabled={!!matches[pair.id] || completed}
                                        icon={matches[pair.id] ? <CheckCircleOutlined /> : undefined}
                                    >
                                        <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            {pair.left}
                                        </div>
                                        {matches[pair.id] && (
                                            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
                                                Matched with: {matches[pair.id]}
                                            </div>
                                        )}
                                    </Button>
                                ))}
                            </Space>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Meanings" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {pairs.map((pair, index) => {
                                    const isMatched = Object.values(matches).includes(pair.right);
                                    const isSelected = selectedRight === pair.right;
                                    
                                    return (
                                        <Button
                                            key={`right-${index}`}
                                            type={isSelected ? 'primary' : isMatched ? 'default' : 'dashed'}
                                            block
                                            style={{ 
                                                height: 'auto', 
                                                padding: '12px',
                                                textAlign: 'left',
                                                backgroundColor: isMatched ? '#f6ffed' : undefined,
                                                borderColor: isMatched ? '#52c41a' : undefined
                                            }}
                                            onClick={() => handleRightSelect(pair.right)}
                                            disabled={isMatched || completed}
                                            icon={isMatched ? <CheckCircleOutlined /> : undefined}
                                        >
                                            <div style={{ fontSize: 14 }}>
                                                {pair.right}
                                            </div>
                                        </Button>
                                    );
                                })}
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Submit Button */}
                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={Object.keys(matches).length === 0 || completed}
                        loading={completed}
                    >
                        {Object.keys(matches).length === pairs.length ? 'Submit Quiz' : `Submit (${Object.keys(matches).length}/${pairs.length} matched)`}
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default MatchQuiz;