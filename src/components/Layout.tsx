import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick: () => void;
  onChatbotClick?: () => void;
  isLoggedIn?: boolean; // 추가
}

const Layout: React.FC<LayoutProps> = ({ children, onLoginClick, onChatbotClick, isLoggedIn }) => {
  return (
    <div>
      <Header onLoginClick={onLoginClick} onChatbotClick={onChatbotClick} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;