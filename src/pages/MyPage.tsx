import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
  });
  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/');
      return;
    }

    // 사용자 정보 불러오기
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://13.125.18.129:8080/api/user/search', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(res.data);
      } catch (error: any) {
        alert('사용자 정보 조회에 실패했습니다.');
        navigate('/');
      }
    };
    fetchUserInfo();
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: '40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }}>
            마이페이지
          </h1>
          <button
            onClick={handleLogout}
            style={{
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* 프로필 이미지 */}
          <div style={{
            flex: '0 0 200px'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '3px solid #e0e0e0'
            }}>
              {userInfo.profileImage ? (
                <img 
                  src={userInfo.profileImage} 
                  alt="프로필" 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{
                  fontSize: '48px',
                  color: '#999'
                }}>
                  👤
                </span>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div style={{
            flex: '1'
          }}>
            <div style={{
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                개인정보
              </h2>
              <p style={{
                color: '#666',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                계정 정보를 관리하세요
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              {/* 이름 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  이름
                </label>
                <div style={{
                  padding: '12px',
                  fontSize: '16px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {userInfo.name}
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  이메일
                </label>
                <div style={{
                  padding: '12px',
                  fontSize: '16px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {userInfo.email}
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  전화번호
                </label>
                <div style={{
                  padding: '12px',
                  fontSize: '16px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {userInfo.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
