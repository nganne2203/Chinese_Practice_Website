import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, BookOutlined, LoginOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

export default function Header() {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'levels',
      icon: <BookOutlined />,
      label: 'Levels',
      children: [
        {
          key: 'beginner',
          label: 'Beginner',
        },
        {
          key: 'intermediate',
          label: 'Intermediate',
        },
        {
          key: 'advanced',
          label: 'Advanced',
        },
      ],
    },
  ];

  return (
    <AntHeader 
      style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          className="mochi-logo"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e53e3e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            marginRight: '12px',
            cursor: 'pointer'
          }}
        >
          汉
        </div>
        <span 
          style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1890ff',
            cursor: 'pointer'
          }}
        >
          Chinese Practice
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={menuItems}
          style={{ 
            border: 'none',
            backgroundColor: 'transparent'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button type="default" icon={<LoginOutlined />}>
          Login
        </Button>
        <Button type="primary">
          Register
        </Button>
      </div>
    </AntHeader>
  );
}
