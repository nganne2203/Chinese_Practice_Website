import { Card, Typography, Space, Button } from 'antd'
import { useAuth } from '../contexts/AuthContext'

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Card style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Welcome to Chinese Practice Website!</Title>
        <div>
          <Text strong>Username: </Text>
          <Text>{user?.userName}</Text>
        </div>
        <div>
          <Text strong>Email: </Text>
          <Text>{user?.email || 'Not provided'}</Text>
        </div>
        <div>
          <Text strong>Name: </Text>
          <Text>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.firstName || user?.lastName || 'Not provided'}
          </Text>
        </div>
        <div>
          <Text strong>Roles: </Text>
          <Text>
            {user?.roles?.map((role: any) => role.name).join(', ') || 'No roles assigned'}
          </Text>
        </div>
        <Button type="primary" danger onClick={logout}>
          Logout
        </Button>
      </Space>
    </Card>
  )
}
