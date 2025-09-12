import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const handleLogin =  (provider: string) => {
    // 실제 로그인 로직은 여기에 구현
    console.log(`${provider}로 로그인 시도`);

     window.location.href = `https://www.penbot.site/oauth2/authorization/${provider}`


  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: '40px',
        maxWidth: 500,
        width: '90%',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: 20,
            color: '#000'
          }}>
            <span style={{ marginRight: 8 }}>🏠</span> 라온아띠
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* 메인 이미지 */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="라온아띠 펜션"
          style={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 24
          }}
        />

        {/* 안내 메시지 */}
        <p style={{
          fontSize: 16,
          color: '#333',
          marginBottom: 32,
          fontWeight: 500
        }}>
          로그인이 필요한 서비스입니다.
        </p>

        {/* 소셜 로그인 버튼들 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 24
        }}>
          <button 
            onClick={() => handleLogin('kakao')}
            style={{
              background: '#FEE500',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <span style={{ fontSize: 18 }}>💬</span>
            카카오로 계속하기
          </button>

          {/* 네이버 로그인 버튼
          <button 
            onClick={() => handleLogin('naver')}
            style={{
              background: '#03C75A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <span style={{ fontSize: 18 }}>🟢</span>
            네이버로 계속하기
          </button> */}
        </div>

        {/* 고객 지원 링크 */}
        <p style={{
          fontSize: 14,
          color: '#666',
          marginTop: 16
        }}>
          소셜 계정으로 로그인이 어려우시면{' '}
          <a href="#" style={{ color: '#2196f3', textDecoration: 'none' }}>
            고객 지원
          </a>
          에 문의해 주세요.
        </p>
      </div>
    </div>
  );
};

export default LoginModal; 