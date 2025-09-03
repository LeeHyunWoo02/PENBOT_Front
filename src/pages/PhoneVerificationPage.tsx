import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhoneVerificationPage: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Move to next input if value entered
    if (value && index < 5) {
      const next = document.getElementById(`code-input-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setPhone(value);
  };

  const handleSendCode = async () => {
    setSendMsg('');
    setError('');
    if (!/^01[016789][0-9]{7,8}$/.test(phone)) {
      setError('올바른 휴대폰 번호를 입력하세요.');
      return;
    }
    setIsSending(true);
    try {
      const response = await axios.post('http://15.164.225.221:8080/api/verify/sendcode', {
        phone
      });
      setSendMsg(response.data.message || '인증번호가 발송되었습니다.');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || '인증번호 발송에 실패했습니다.');
      } else {
        setError('서버 오류로 발송에 실패했습니다.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSendMsg('');

    if (!/^01[016789][0-9]{7,8}$/.test(phone)) {
      setError('올바른 휴대폰 번호를 입력하세요.');
      setIsSubmitting(false);
      return;
    }
    const codeValue = code.join('');
    if (codeValue.length !== 6) {
      setError('6자리 인증번호를 입력하세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://15.164.225.221:8080/api/verify/verifycode', {
        phone: phone,  
        code: codeValue
      });
      
      console.log('인증 응답:', response.data);
      setSendMsg(response.data.message || '인증번호 인증에 성공했습니다.');
      
      // 인증 성공 시 휴대폰 번호를 localStorage에 저장하고 비밀번호 설정 페이지로 이동
      localStorage.setItem('phone', phone);
      navigate('/password-setup');
    } catch (error: any) {
      console.error('인증 오류:', error);
      if (error.response) {
        setError(error.response.data.message || '인증번호가 옳지 않습니다.');
      } else {
        setError('서버 오류로 인증에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Verify your phone number</h2>
      <div style={{ color: '#888', marginBottom: 32 }}>We&apos;ve sent you a text with a 6-digit code.</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="휴대폰 번호 (010xxxxxxxx)"
            value={phone}
            onChange={handlePhoneChange}
            style={{
              width: '65%',
              padding: '12px',
              fontSize: 18,
              border: '1px solid #ddd',
              borderRadius: 8,
              textAlign: 'center',
              background: '#fafbfc',
            }}
            maxLength={11}
            autoFocus
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isSending}
            style={{
              background: '#65a6e4',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 18px',
              fontSize: 15,
              fontWeight: 600,
              cursor: isSending ? 'not-allowed' : 'pointer',
              opacity: isSending ? 0.7 : 1,
              minWidth: 90
            }}
          >
            {isSending ? '발송중...' : '인증번호 발송'}
          </button>
        </div>
        {sendMsg && <div style={{ color: '#2196f3', marginBottom: 8 }}>{sendMsg}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`code-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              style={{
                width: 40,
                height: 48,
                fontSize: 28,
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: 8,
                outline: 'none',
                background: '#fafbfc',
              }}
            />
          ))}
        </div>
        <div style={{ color: '#888', marginBottom: 16 }}>Didn&apos;t receive the code?</div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          onClick={handleSubmit}
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
          {isSubmitting ? 'Verifying...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default PhoneVerificationPage;