import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordSetupPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');

  // 컴포넌트 마운트 시 휴대폰 번호 가져오기
  useEffect(() => {
    // URL 파라미터에서 phone 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const phoneFromUrl = urlParams.get('phone');
    
    if (phoneFromUrl) {
      setPhone(phoneFromUrl);
    } else {
      // localStorage에서 phone 가져오기 (이전 페이지에서 저장했다면)
      const savedPhone = localStorage.getItem('phone');
      if (savedPhone) {
        setPhone(savedPhone);
      }
    }
  }, []);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pw: string) => {
    // 8자 이상, 숫자/대문자/특수문자 포함
    return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!phone) {
      setError('휴대폰 번호 정보가 없습니다. 다시 인증해주세요.');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상, 숫자, 대문자, 특수문자를 모두 포함해야 합니다.');
      return;
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post('http://13.125.18.129:8080/api/user/update', 
        {
          password: password,
          phone: phone  // phone 필드 추가
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
      });
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('jwt', response.data.accessToken);
      }
      
      // 성공 시 localStorage에서 phone 제거 (보안상)
      localStorage.removeItem('phone');
      
      setSuccess('비밀번호가 성공적으로 설정되었습니다!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error: any) {
      console.error('비밀번호 설정 오류:', error);
      if (error.response) {
        setError(error.response.data.message || '비밀번호 설정에 실패했습니다.');
      } else {
        setError('서버 오류로 비밀번호 설정에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>비밀번호 설정</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: 18,
            border: '1px solid #ddd',
            borderRadius: 8,
            marginBottom: 16,
            background: '#fafbfc',
          }}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: 18,
            border: '1px solid #ddd',
            borderRadius: 8,
            marginBottom: 16,
            background: '#fafbfc',
          }}
        />
        <div style={{ color: '#888', marginBottom: 16, fontSize: 14 }}>
          비밀번호는 8자 이상, 숫자, 대문자, 특수문자를 모두 포함해야 합니다.
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: '#2196f3', marginBottom: 12 }}>{success}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '70%',
            padding: '14px 0',
            background: '#65a6e4',
            color: '#111',
            fontWeight: 600,
            fontSize: 18,
            border: 'none',
            borderRadius: 24,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            margin: '0 auto',
            marginTop: 8,
            marginBottom: 24,
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? '설정 중...' : '계속하기'}
        </button>
      </form>
    </div>
  );
};

export default PasswordSetupPage;