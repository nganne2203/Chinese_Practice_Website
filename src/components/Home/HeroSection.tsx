import { Button, Typography, Space } from 'antd';
import { PlayCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const { Title, Paragraph } = Typography;

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '100px 0 80px 0',
                color: 'white',
                textAlign: 'center'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '24px' }}>
                    Nâng cao trình độ tiếng Trung của bạn – từng bước một!
                </Title>
                <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto 40px' }}>
                    Chinese Practice là nền tảng luyện tập tiếng Trung hiện đại giúp bạn học từ vựng,
                    ngữ pháp và luyện nói thông qua các cấp độ từ cơ bản đến nâng cao.
                </Paragraph>
                <Space size="large">
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        style={{ height: '50px', fontSize: '16px', padding: '0 32px' }}
                        onClick={() => navigate('/register')}
                    >
                        🎯 Bắt đầu ngay
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        icon={<LoginOutlined />}
                        style={{
                            height: '50px',
                            fontSize: '16px',
                            padding: '0 32px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white'
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </Button>
                </Space>
            </div>
        </section>
    );
}