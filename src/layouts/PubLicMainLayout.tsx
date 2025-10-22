import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Layout, Typography } from 'antd';
import Logo from '../assets/images/Logo.png'
import HeaderImage from '../assets/images/Header.png'

const { Header, Content } = Layout;
const { Text } = Typography;

export default function PublicMainLayout() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                    height: '64px',
                    padding: '10px 24px',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundImage: `url(${HeaderImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center' }}
                    className="mochi-logo"
                    onClick={() => navigate('/')}
                >
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            marginTop: '14px',
                            fontSize: '16px',
                        }}
                    >
                        <img src={Logo} alt="Logo" width="100" height="100" style={{
                            borderRadius: '60%'
                        }} />
                    </div>
                </div>

                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    className="mochi-logo"
                    onClick={() => navigate('/')}
                >
                    <Text
                        style={{
                            fontSize: isMobile ? '16px' : '20px',
                            fontWeight: 'bold',
                            color: '#8B4513',
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            letterSpacing: '0.5px',
                            marginLeft: '10px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isMobile ? 'CHINESE' : 'CHINESE PRACTICE'}
                    </Text>
                </div>
            </Header>

            <Content
                style={{
                    marginTop: '64px',
                    padding: 0,
                    minHeight: 'calc(100vh - 64px)',
                    background: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    );
}
