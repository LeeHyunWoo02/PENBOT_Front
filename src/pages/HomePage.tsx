import React from 'react';
import MainSection from '../components/MainSection';
import Footer from '../components/Footer';

interface HomePageProps {
  onLoginClick: () => void;
  onChatbotClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onChatbotClick }) => {
  return (
    <div>
      <MainSection onLoginClick={onLoginClick} onChatbotClick={onChatbotClick} />
      <Footer />
    </div>
  );
};

export default HomePage; 