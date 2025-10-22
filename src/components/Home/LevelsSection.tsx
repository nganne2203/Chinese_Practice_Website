import { Row, Col, Card, Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function LevelsSection() {
  return (
    <section style={{ 
      padding: '80px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
          Lộ trình học rõ ràng – phù hợp với mọi trình độ!
        </Title>
        <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', border: '2px solid #52c41a' }}
              hoverable
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  backgroundColor: '#52c41a', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Beginner
                </div>
                <Title level={4}>Hán ngữ 1–2</Title>
              </div>
              <Paragraph>
                Làm quen pinyin, từ vựng cơ bản, mẫu câu giao tiếp thường dùng.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', border: '2px solid #1890ff' }}
              hoverable
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  backgroundColor: '#1890ff', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Intermediate
                </div>
                <Title level={4}>Hán ngữ 3–4</Title>
              </div>
              <Paragraph>
                Cải thiện ngữ pháp, kỹ năng viết và phản xạ nghe nói.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', border: '2px solid #fa541c' }}
              hoverable
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  backgroundColor: '#fa541c', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  Advanced
                </div>
                <Title level={4}>Hán ngữ 5–6</Title>
              </div>
              <Paragraph>
                Luyện đề HSK, giao tiếp chuyên sâu, viết luận tiếng Trung.
              </Paragraph>
            </Card>
          </Col>
        </Row>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<ArrowRightOutlined />}
            style={{ height: '45px', fontSize: '16px', padding: '0 24px' }}
            onClick={() => {
              console.log('Navigate to levels detail');
            }}
          >
            Xem chi tiết các cấp độ
          </Button>
        </div>
      </div>
    </section>
  );
}