import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function TestimonialSection() {
  return (
    <section style={{ 
      padding: '60px 0', 
      backgroundColor: '#f0f7ff'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>💬</div>
        <Title level={3} style={{ fontStyle: 'italic', color: '#1890ff' }}>
          "Chinese Practice giúp tôi luyện nói và ghi nhớ từ vựng dễ dàng hơn mỗi ngày!"
        </Title>
        <Text style={{ fontSize: '16px', color: '#666' }}>
          – Lan Anh, HSK4
        </Text>
      </div>
    </section>
  );
}