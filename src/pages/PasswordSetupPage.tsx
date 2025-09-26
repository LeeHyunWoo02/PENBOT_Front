import { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordSetupPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneFromUrl = urlParams.get('phone');
    
    if (phoneFromUrl) {
      setPhone(phoneFromUrl);
    } else {
      const savedPhone = localStorage.getItem('phone');
      if (savedPhone) {
        setPhone(savedPhone);
      }
    }
  }, []);

  const validatePassword = (pw: string) => {
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
      const response = await axios.post('https://www.penbot.site/api/user/update', 
        {
          password: password,
          phone: phone  
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