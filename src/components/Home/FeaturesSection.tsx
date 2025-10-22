import { Row, Col, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function FeaturesSection() {
  return (
    <section style={{ 
      padding: '80px 0', 
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
          Vì sao chọn Chinese Practice?
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              hoverable
            >
              <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}>
                🧠
              </div>
              <Title level={4}>Luyện tập thông minh</Title>
              <Paragraph>
                Bài luyện được thiết kế dựa trên AI và ngữ cảnh thực tế.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              hoverable
            >
              <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>
                🗣️
              </div>
              <Title level={4}>Tập trung kỹ năng giao tiếp</Title>
              <Paragraph>
                Luyện nghe, nói, đọc, viết thông qua hội thoại tự nhiên.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              style={{ height: '100%', textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              hoverable
            >
              <div style={{ fontSize: '48px', color: '#fa541c', marginBottom: '16px' }}>
                📈
              </div>
              <Title level={4}>Theo dõi tiến trình học</Title>
              <Paragraph>
                Xem tiến độ học tập và điểm số theo từng cấp độ.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}