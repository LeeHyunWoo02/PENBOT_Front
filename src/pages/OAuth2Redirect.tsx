import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}


const OAuth2Redirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // accessToken 쿼리 파라미터 추출
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    if (accessToken) {
      localStorage.setItem('jwt', accessToken); // JWT 토큰 저장
      const payload = decodeJwt(accessToken);
      console.log(payload);
      console.log(payload?.chatRole);

      if (payload?.chatRole === "TEMP") {
        console.log("TEMP 유저는 인증 페이지로 이동합니다.");
        window.location.href = '/phone-verification';
        // navigate('/phone-verification');
      } else if (payload?.chatRole === "GUEST" || payload?.chatRole === "HOST") {
        navigate('/');
      } else {
        // 기타 상황 (예: 토큰에 role 정보 없거나 이상할 때)
        navigate('/');
      }
    } else {
      navigate('/'); // 토큰 없으면 홈으로 이동
    }
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuth2Redirect;