import RegisterComponent from '../components/auth/Register';
import BackGroundImage from '../assets/images/Background-image.png'

export default function Register() {
  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: `url(${BackGroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          backdropFilter: 'blur(10px)',
          margin: '20px',
          boxSizing: 'border-box',
        }}
      >
        <RegisterComponent />
      </div>
    </div>
  );
}

