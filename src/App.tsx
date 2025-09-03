import { useState, useEffect } from 'react';
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
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const token = localStorage.getItem('jwt');
      setIsLoggedIn(!!token);
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
          <Route path="/introduction" element={<IntroductionPage onLoginClick={handleLoginClick} />} />
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
