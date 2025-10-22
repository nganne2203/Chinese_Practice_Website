import { Row, Col, Typography, Space, Button } from 'antd';

const { Text } = Typography;

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#001529', 
      color: 'white', 
      textAlign: 'center', 
      padding: '40px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Text style={{ color: 'white', fontSize: '16px' }}>
              © 2025 Chinese Practice
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Text style={{ color: 'white' }}>
              Liên hệ: chinesepractice@gmail.com
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Text style={{ color: 'white' }}>Mạng xã hội:</Text>
              <Button 
                type="link" 
                style={{ color: '#1890ff' }}
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                Facebook
              </Button>
              <Button 
                type="link" 
                style={{ color: '#1890ff' }}
                onClick={() => window.open('https://youtube.com', '_blank')}
              >
                YouTube
              </Button>
              <Button 
                type="link" 
                style={{ color: '#1890ff' }}
                onClick={() => window.open('https://zalo.me', '_blank')}
              >
                Zalo
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </footer>
  );
}