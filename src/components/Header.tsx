import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLoginClick: () => void;
  onChatbotClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onChatbotClick }) => {
  return (
    <header style={{
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #333'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* 로고 */}
        <Link to="/" style={{
          textDecoration: 'none',
          color: '#fff',
          fontSize: 24,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>🏠</span>
          라온아띠
        </Link>

        {/* 네비게이션 */}
        <nav style={{
          display: 'flex',
          gap: 30,
          alignItems: 'center'
        }}>
          <Link to="/introduction" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500
          }}>
            펜션 소개
          </Link>
          <Link to="/booking" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500
          }}>
            예약 정보
          </Link>
          <Link to="/directions" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500
          }}>
            오는 길
          </Link>
        </nav>

        {/* 액션 버튼들 */}
        <div style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center'
        }}>
          <button
            onClick={onChatbotClick}
            style={{
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>🤖</span>
            AI 챗봇
          </button>
          <button
            onClick={onLoginClick}
            style={{
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            예약하기
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;