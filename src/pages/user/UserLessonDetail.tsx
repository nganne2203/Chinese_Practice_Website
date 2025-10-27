import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Row, Col, Button, message, Spin, Alert, Tag, Divider, Table } from 'antd';
import { BookOutlined, ArrowLeftOutlined, PlayCircleOutlined, TrophyOutlined, SoundOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { LESSON_API } from '../../api/lesson';
import { QUIZ_API } from '../../api/quiz';
import { VOCABULARY__API } from '../../api/vocabulary';
import type { LessonResponse } from '../../types/Lesson';
import type { QuizDetailResponse } from '../../types/Quiz';
import type { VocabularyResponse } from '../../types/Vocabulary';

const { Title, Text, Paragraph } = Typography;

const UserLessonDetail: React.FC = () => {
    const navigate = useNavigate();
    const { lessonId } = useParams<{ lessonId: string }>();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<LessonResponse | null>(null);
    const [quizzes, setQuizzes] = useState<QuizDetailResponse[]>([]);
    const [vocabularies, setVocabularies] = useState<VocabularyResponse[]>([]);

    // Define vocabulary table columns
    const vocabularyColumns = [
        {
            title: 'Hanzi',
            dataIndex: 'hanzi',
            key: 'hanzi',
            width: 100,
            render: (text: string) => (
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
            ),
        },
        {
            title: 'Pinyin',
            dataIndex: 'pinyin',
            key: 'pinyin',
            width: 120,
            render: (text: string) => (
                <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#1890ff' }}>{text}</Text>
            ),
        },
        {
            title: 'Meaning',
            dataIndex: 'meaning',
            key: 'meaning',
            render: (text: string) => (
                <Text style={{ fontSize: 14 }}>{text}</Text>
            ),
        },
        {
            title: 'Example',
            dataIndex: 'exampleSentence',
            key: 'example',
            render: (text: string) => (
                text ? (
                    <div>
                        <Text style={{ fontSize: 13, color: '#666' }}>{text}</Text>
                    </div>
                ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>No example available</Text>
                )
            ),
        },
        {
            title: 'Audio',
            key: 'audio',
            width: 80,
            render: () => (
                <Button
                    type="text"
                    size="small"
                    icon={<SoundOutlined />}
                    onClick={() => message.info('Audio feature coming soon!')}
                />
            ),
        },
    ];

    useEffect(() => {
        if (lessonId) {
            fetchLessonData();
        }
    }, [lessonId]);

    const fetchLessonData = async () => {
        if (!lessonId) return;
        
        try {
            setLoading(true);
            const [lessonData, quizzesData, vocabularyData] = await Promise.all([
                LESSON_API.getLessonById(lessonId),
                QUIZ_API.getQuizByLesson(lessonId),
                VOCABULARY__API.getVocabularyByLessonId(lessonId)
            ]);
            setLesson(lessonData);
            setQuizzes(quizzesData);
            setVocabularies(vocabularyData);
        } catch (error) {
            console.error('Error fetching lesson data:', error);
            message.error('Failed to load lesson details');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (quizId: string) => {
        navigate(`/app/quiz/${quizId}`);
    };

    const handleBackToUnits = () => {
        navigate('/app/units');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Lesson Not Found"
                    description="The lesson you're looking for doesn't exist or has been removed."
                    type="error"
                    action={
                        <Button size="small" onClick={handleBackToUnits}>
                            Back to Units
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={handleBackToUnits}
                            style={{ marginBottom: 8 }}
                        >
                            Back to Units
                        </Button>
                        
                        <div>
                            <Tag color="blue">{lesson.unit.level.name}</Tag>
                            <Tag color="green">Unit {lesson.unit.unitNumber}: {lesson.unit.title}</Tag>
                        </div>
                        
                        <Title level={1} style={{ margin: 0 }}>
                            {lesson.title}
                        </Title>
                        
                        <Space size="large">
                            <div>
                                <Text type="secondary">Unit: </Text>
                                <Text strong>{lesson.unit.title}</Text>
                            </div>
                            {quizzes.length > 0 && (
                                <div>
                                    <Text type="secondary">Available Quizzes: </Text>
                                    <Text strong>{quizzes.length}</Text>
                                </div>
                            )}
                        </Space>
                    </Space>
                </Card>

                {/* Lesson Content */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card title={
                            <Space>
                                <BookOutlined />
                                <span>Lesson Content</span>
                            </Space>
                        }>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                {lesson.description ? (
                                    <div>
                                        <Title level={4}>Description</Title>
                                        <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                                            {lesson.description}
                                        </Paragraph>
                                    </div>
                                ) : (
                                    <Alert
                                        message="Content Coming Soon"
                                        description="Lesson content will be available shortly."
                                        type="info"
                                        showIcon
                                    />
                                )}

                                <Divider />

                                {/* Learning Objectives */}
                                <div>
                                    <Title level={4}>Learning Objectives</Title>
                                    <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
                                        <li>Master key vocabulary and phrases from this lesson</li>
                                        <li>Practice pronunciation and tone recognition</li>
                                        <li>Apply learned concepts through interactive exercises</li>
                                        <li>Build confidence in real-world usage</li>
                                    </ul>
                                </div>

                                {/* Study Tips */}
                                <Alert
                                    message="Study Tips"
                                    description={
                                        <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
                                            <li>Review the vocabulary before taking quizzes</li>
                                            <li>Practice pronunciation out loud</li>
                                            <li>Take your time to understand each concept</li>
                                            <li>Repeat quizzes to reinforce learning</li>
                                        </ul>
                                    }
                                    type="info"
                                    showIcon
                                />
                            </Space>
                        </Card>

                        {/* Vocabulary Section */}
                        <Card 
                            title={
                                <Space>
                                    <BookOutlined />
                                    <span>Lesson Vocabulary</span>
                                </Space>
                            }
                            style={{ marginTop: 24 }}
                        >
                            {vocabularies.length > 0 ? (
                                <Table
                                    dataSource={vocabularies}
                                    columns={vocabularyColumns}
                                    rowKey="id"
                                    pagination={false}
                                    size="middle"
                                    scroll={{ x: 600 }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                    <BookOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                                    <div>No vocabulary available</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Vocabulary words will be added soon
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        {/* Available Quizzes */}
                        <Card title={
                            <Space>
                                <TrophyOutlined />
                                <span>Practice Quizzes</span>
                            </Space>
                        }>
                            {quizzes.length > 0 ? (
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    {quizzes.map((quiz) => (
                                        <Card 
                                            key={quiz.id} 
                                            size="small" 
                                            style={{ border: '1px solid #f0f0f0' }}
                                        >
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <div>
                                                    <Text strong style={{ fontSize: 14 }}>
                                                        {quiz.title}
                                                    </Text>
                                                    <br />
                                                    <Tag color="purple">
                                                        {quiz.type}
                                                    </Tag>
                                                </div>
                                                
                                                <div>
                                                    {quiz.timed && quiz.durationInMinutes && (
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            Duration: {quiz.durationInMinutes} minutes
                                                        </Text>
                                                    )}
                                                    {quiz.attemptLimit && (
                                                        <>
                                                            <br />
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                Attempts allowed: {quiz.attemptLimit}
                                                            </Text>
                                                        </>
                                                    )}
                                                </div>

                                                <Button 
                                                    type="primary" 
                                                    size="small"
                                                    icon={<PlayCircleOutlined />}
                                                    onClick={() => handleStartQuiz(quiz.id)}
                                                    block
                                                >
                                                    Start Quiz
                                                </Button>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                                    <TrophyOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                                    <div>No quizzes available</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Check back later for practice exercises
                                    </Text>
                                </div>
                            )}
                        </Card>

                        <Card title="Quick Actions" style={{ marginTop: 16 }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button 
                                    type="default" 
                                    block 
                                    onClick={() => navigate('/app/lessons')}
                                >
                                    All Lessons
                                </Button>
                                <Button 
                                    type="default" 
                                    block 
                                    onClick={() => navigate('/app/progress')}
                                >
                                    My Progress
                                </Button>
                                <Button 
                                    type="default" 
                                    block 
                                    onClick={() => navigate('/app/units')}
                                >
                                    Browse Units
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default UserLessonDetail;