import React from 'react';

interface MainSectionProps {
  onLoginClick: () => void;
  onChatbotClick?: () => void;
}

const MainSection: React.FC<MainSectionProps> = ({ onLoginClick, onChatbotClick }) => (
  <main style={{ 
    textAlign: 'center', 
    padding: '40px 20px',
    backgroundColor: '#fff'
  }}>
    <img
      src="public/images/intro_img1.png"
      alt="라온아띠 펜션"
      style={{ 
        width: '100%', 
        maxWidth: 1200,
        height: 400, 
        objectFit: 'cover', 
        borderRadius: 12,
        marginBottom: 32
      }}
    />
    <p style={{ 
      margin: '32px 0 24px 0', 
      fontSize: 18,
      color: '#666',
      lineHeight: 1.6,
      maxWidth: 800,
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      안녕하세요. 라온아띠 키즈 펜션입니다 ! 
      예약 전 펜션 소개와 예약 방법을 확인해주세요.
    </p>
    <button 
      onClick={onChatbotClick}
      style={{
        background: '#2196f3',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '12px 28px',
        fontWeight: 500,
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        margin: '0 auto',
        cursor: 'pointer'
      }}
    >
      <span role="img" aria-label="chat">💬</span> AI 챗봇
    </button>
  </main>
);

export default MainSection; 