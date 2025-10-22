import LoginComponent from '../components/auth/Login'
import BackGroundImage from '../assets/images/Background-image.png'

export default function Login() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${BackGroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <LoginComponent />
      </div>
    </div>
  )
}
