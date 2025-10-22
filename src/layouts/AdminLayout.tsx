import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, Button, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SafetyOutlined,
    AppstoreOutlined,
    ReadOutlined,
    TagsOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { ROUTE_PATH } from '../constants/Routes';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
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
            key: ROUTE_PATH.ADMIN_DASHBOARD,
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: ROUTE_PATH.ADMIN_USERS,
            icon: <UserOutlined />,
            label: 'User Management',
        },
        {
            key: ROUTE_PATH.ADMIN_LEVELS,
            icon: <AppstoreOutlined />,
            label: 'Level Management',
        },
        {
            key: ROUTE_PATH.ADMIN_UNITS,
            icon: <BookOutlined />,
            label: 'Unit Management',
        },
        {
            key: ROUTE_PATH.ADMIN_LESSONS,
            icon: <FileTextOutlined />,
            label: 'Lesson Management',
        },
        {
            key: ROUTE_PATH.ADMIN_VOCABULARIES,
            icon: <TagsOutlined />,
            label: 'Vocabulary Management',
        },
        {
            key: ROUTE_PATH.ADMIN_QUIZZES,
            icon: <ReadOutlined />,
            label: 'Quiz Management',
        },
        {
            key: ROUTE_PATH.ADMIN_QUESTIONS,
            icon: <QuestionCircleOutlined />,
            label: 'Question Management',
        },
        {
            key: ROUTE_PATH.ADMIN_ROLES_PERMISSIONS,
            icon: <SafetyOutlined />,
            label: 'Role & Permission',
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
                    <div style={{ fontWeight: 'bold' }}>{user?.userName || 'Admin'}</div>
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

    const generateBreadcrumbItems = () => {
        const pathSnippets = location.pathname.split('/').filter((i) => i);

        const breadcrumbItems = [
            {
                title: 'Admin',
            },
        ];

        pathSnippets.forEach((snippet, index) => {
            if (index > 0) {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                const menuItem = menuItems.find((item) => item && 'key' in item && item.key === url);

                breadcrumbItems.push({
                    title: (menuItem && 'label' in menuItem ? menuItem.label : snippet.charAt(0).toUpperCase() + snippet.slice(1)) as string,
                });
            }
        });

        return breadcrumbItems;
    };

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
                                        : user?.userName || 'Admin'}
                                </Text>
                            )}
                            <Avatar
                                style={{ backgroundColor: '#1890ff' }}
                                icon={<UserOutlined />}
                            >
                                {user?.userName?.charAt(0).toUpperCase() || 'A'}
                            </Avatar>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{ margin: isMobile ? '16px' : '24px' }}>
                    <Breadcrumb
                        items={generateBreadcrumbItems()}
                        style={{ marginBottom: '16px' }}
                    />

                    <div
                        style={{
                            padding: isMobile ? 16 : 24,
                            minHeight: 360,
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

export default AdminLayout;
