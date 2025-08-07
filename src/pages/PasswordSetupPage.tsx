import React, { useState } from 'react';
import axios from 'axios';

const PasswordSetupPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pw: string) => {
    // 8자 이상, 숫자/대문자/특수문자 포함
    return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상, 숫자, 대문자, 특수문자를 모두 포함해야 합니다.');
      return;
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);
    // TODO: 실제 비밀번호 저장 API 연동
    try{
      const token = localStorage.getItem('jwt');
      const res = await axios.post('http://localhost:8080/api/user/update', 
        {password: password},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 만약 Content-Type 필요하면 아래도 추가:
            'Content-Type': 'application/json'
          }
      });
      console.log(res);

      if (res.data && res.data.accessToken) {
        localStorage.setItem('jwt', res.data.accessToken);
      }
      setSuccess('비밀번호가 성공적으로 설정되었습니다!');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setError('비밀번호 설정에 실패했습니다.');
    }
    setIsSubmitting(false);
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