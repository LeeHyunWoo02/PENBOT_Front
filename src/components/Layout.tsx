import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick: () => void;
  onChatbotClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLoginClick, onChatbotClick }) => {
  return (
    <div>
      <Header onLoginClick={onLoginClick} onChatbotClick={onChatbotClick} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;