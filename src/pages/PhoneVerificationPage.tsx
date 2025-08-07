import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가: 페이지 이동을 위한 useNavigate

const PhoneVerificationPage: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false); // 인증번호 발송 중 상태 추가
  const [sendMsg, setSendMsg] = useState(''); // 인증번호 발송 결과 메시지
  const navigate = useNavigate(); // 추가: 페이지 이동 함수

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
    // Only allow numbers, max 11 digits (010xxxxxxxx)
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setPhone(value);
  };

  // 인증번호 발송 버튼 클릭 시 API 연동 (수정/추가)
  const handleSendCode = async () => {
    setSendMsg('');
    setError('');
    if (!/^01[016789][0-9]{7,8}$/.test(phone)) {
      setError('올바른 휴대폰 번호를 입력하세요.');
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:8080/api/verify/sendcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (res.ok) {
        setSendMsg('인증번호가 발송되었습니다.');
      } else {
        setSendMsg('인증번호 발송에 실패했습니다.');
      }
    } catch (e) {
      setSendMsg('서버 오류로 발송에 실패했습니다.');
    }
    setIsSending(false);
  };

    // 인증번호 검증
    const verifyAuthCode = async () => {
        setSendMsg('');
        setError('');
        setIsSending(true);
        try {
            const res = await fetch('http://localhost:8080/api/verify/verifycode', {
                method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code }),
          });
          const data = await res.json();
          if (res.ok) {
            setSendMsg(data.message || '인증번호 인증에 성공했습니다.');
          } else {
            setSendMsg(data.message || '인증번호가 옳지 않습니다.');
          }
        } catch (e) {
          setSendMsg('서버 오류로 인증에 실패했습니다.');
        } finally {
          setIsSending(false);
        }
      };
      

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
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
          const res = await fetch('http://localhost:8080/api/verify/verifycode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code: code.join('') }),
          });
          console.log(res.body);
          const data = await res.json();
          console.log(data);
          if (res.ok) {
            setSendMsg(data.message || '인증번호 인증에 성공했습니다.');
            // 인증 성공 시 비밀번호 설정 페이지로 이동
            navigate('/password-setup'); // 추가: 인증 성공 시 이동
          } else {
            setError(data.message || '인증번호가 옳지 않습니다.');
          }
        } catch (e) {
          setError('서버 오류로 인증에 실패했습니다.');
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
          onClick={verifyAuthCode}
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