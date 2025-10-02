import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import { Button, Card, Typography, Space, Spin } from 'antd'
import './App.css'

const { Title, Text } = Typography;

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Card style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Welcome to Chinese Practice Website!</Title>
        <div>
          <Text strong>Username: </Text>
          <Text>{user?.username}</Text>
        </div>
        <div>
          <Text strong>Role: </Text>
          <Text>{user?.role}</Text>
        </div>
        <Button type="primary" danger onClick={logout}>
          Logout
        </Button>
      </Space>
    </Card>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
