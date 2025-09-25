import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import IntroductionPage from './pages/IntroductionPage';
import BookingPage from './pages/BookingPage';
import DirectionsPage from './pages/DirectionsPage';
import BookingSystemPage from './pages/BookingSystemPage';
import ChatbotPage from './pages/ChatbotPage';
import MyPage from './pages/MyPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginModal from './components/LoginModal';
import PhoneVerificationPage from './pages/PhoneVerificationPage';
import PasswordSetupPage from './pages/PasswordSetupPage';
import OAuth2Redirect from './pages/OAuth2Redirect';
import { startTokenExpiryMonitor, removeExpiredToken } from './utils/jwtUtils';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const tokenMonitorRef = useRef<number | null>(null);

  useEffect(() => {
    // 만료된 토큰 제거
    removeExpiredToken();
    
    const token = localStorage.getItem('jwt');
    const hasValidToken = !!token;
    setIsLoggedIn(hasValidToken);

    // 기존 타이머 정리
    if (tokenMonitorRef.current) {
      clearTimeout(tokenMonitorRef.current);
      tokenMonitorRef.current = null;
    }

    // 유효한 토큰이 있으면 만료 모니터링 시작
    if (hasValidToken && token) {
      tokenMonitorRef.current = startTokenExpiryMonitor(() => {
        console.log('토큰 만료로 인한 자동 로그아웃');
        setIsLoggedIn(false);
        // 토큰 만료 시 로그인 페이지로 리다이렉트
        window.location.href = '/';
      });
    }

    return () => {
      if (tokenMonitorRef.current) {
        clearTimeout(tokenMonitorRef.current);
        tokenMonitorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onStorage = () => {
      // localStorage 변경 감지 시 토큰 상태 재확인
      removeExpiredToken();
      const token = localStorage.getItem('jwt');
      const hasValidToken = !!token;
      setIsLoggedIn(hasValidToken);

      // 기존 타이머 정리
      if (tokenMonitorRef.current) {
        clearTimeout(tokenMonitorRef.current);
        tokenMonitorRef.current = null;
      }

      // 새 토큰이 있으면 만료 모니터링 시작
      if (hasValidToken && token) {
        tokenMonitorRef.current = startTokenExpiryMonitor(() => {
          console.log('토큰 만료로 인한 자동 로그아웃');
          setIsLoggedIn(false);
          window.location.href = '/';
        });
      }
    };
    
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleChatbotClick = () => {
    if (isLoggedIn) {
      window.location.href = '/chatbot';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    window.location.href = '/phone-verification';
  };

  return (
    <BrowserRouter>
      <Layout onLoginClick={handleLoginClick} onChatbotClick={handleChatbotClick} isLoggedIn={isLoggedIn}>
        <Routes>
          <Route path="/" element={<HomePage onLoginClick={handleLoginClick} onChatbotClick={handleChatbotClick} />} />
          <Route path="/introduction" element={<IntroductionPage onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} />} />
          <Route path="/booking" element={<BookingPage onLoginClick={handleLoginClick} />} />
          <Route path="/directions" element={<DirectionsPage onLoginClick={handleLoginClick} />} />
          <Route path="/booking-system" element={<BookingSystemPage onLoginClick={handleLoginClick} />} />
          <Route path="/chatbot" element={<ChatbotPage onLoginClick={handleLoginClick} />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/phone-verification" element={<PhoneVerificationPage />} />
          <Route path="/password-setup" element={<PasswordSetupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        </Routes>
      </Layout>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </BrowserRouter>
  );
}

export default App;
