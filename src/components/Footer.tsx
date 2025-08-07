import React from 'react';

const Footer: React.FC = () => (
  <footer style={{ 
    marginTop: 80, 
    padding: '40px 0 24px 0', 
    textAlign: 'center', 
    color: '#999',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 120, 
      marginBottom: 16 
    }}>
      <a href="#" style={{ color: '#999', textDecoration: 'none' }}>About Us</a>
      <a href="#" style={{ color: '#999', textDecoration: 'none' }}>Contact</a>
      <a href="#" style={{ color: '#999', textDecoration: 'none' }}>Privacy Policy</a>
    </div>
    <div style={{ marginBottom: 8 }}>
      <span style={{ margin: '0 8px', fontSize: 16 }}>ⓕ</span>
      <span style={{ margin: '0 8px', fontSize: 16 }}>📷</span>
    </div>
    <div style={{ fontSize: 15, color: '#999' }}>
      ©2025 라온아띠 키즈. All rights reserved.
    </div>
  </footer>
);

export default Footer; 