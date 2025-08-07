import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Redirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // accessToken 쿼리 파라미터 추출
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    if (accessToken) {
      localStorage.setItem('jwt', accessToken); // JWT 토큰 저장
      // TODO: 토큰 디코딩 후 role 체크하여 분기 가능
      navigate('/phone-verification'); // 예시: 인증 페이지로 이동
    } else {
      navigate('/'); // 토큰 없으면 홈으로 이동
    }
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuth2Redirect;