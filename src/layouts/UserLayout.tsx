import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
    DashboardOutlined,
    BookOutlined,
    TrophyOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { ROUTE_PATH } from '../constants/Routes';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const UserLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems: MenuProps['items'] = [
        {
            key: ROUTE_PATH.USER_DASHBOARD,
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/app/lessons',
            icon: <BookOutlined />,
            label: 'Lessons',
        },
        {
            key: '/app/quizzes',
            icon: <TrophyOutlined />,
            label: 'Quizzes',
        },
        {
            key: '/app/progress',
            icon: <BarChartOutlined />,
            label: 'Progress',
        },
        {
            key: '/app/profile',
            icon: <SettingOutlined />,
            label: 'Profile',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTE_PATH.LOGIN);
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{user?.userName || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{user?.email || ''}</div>
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={null}
                width={250}
                breakpoint="lg"
                collapsedWidth={isMobile ? 0 : 80}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 999,
                    background: '#001529',
                }}
            >
                <div
                    style={{
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: collapsed ? '18px' : '20px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {collapsed ? 'CP' : 'Chinese Practice'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ marginTop: '10px' }}
                />
            </Sider>

            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), transition: 'all 0.2s' }}>
                <Header
                    style={{
                        padding: '0 16px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            {!isMobile && (
                                <Text style={{ marginRight: '12px' }}>
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user?.userName || 'User'}
                                </Text>
                            )}
                            <Avatar
                                style={{ backgroundColor: '#52c41a' }}
                                icon={<UserOutlined />}
                            >
                                {user?.userName?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{ margin: isMobile ? '16px' : '24px' }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            overflow: 'auto',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserLayout;
