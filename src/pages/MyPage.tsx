import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  myBookings?: { [key: string]: Booking };
}

interface Booking {
  bookingId: number;
  startDate: string;
  endDate: string;
  headcount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  name: string;
  phone: string;
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
        const res = await axios.get('https://www.penbot.site/api/user/search', {
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

        {/* 예약 내역 섹션 */}
        <div style={{
          marginTop: '40px',
          paddingTop: '40px',
          borderTop: '2px solid #f0f0f0'
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
              예약 내역
            </h2>
            <p style={{
              color: '#666',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              나의 펜션 예약 현황을 확인하세요
            </p>
          </div>

          {userInfo.myBookings && Object.keys(userInfo.myBookings).length > 0 ? (
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {Object.entries(userInfo.myBookings).map(([, booking]) => (
                <div key={booking.bookingId} style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    flex: '1'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        예약 #{booking.bookingId}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: booking.status === 'CONFIRMED' ? '#e8f5e8' : 
                                       booking.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                        color: booking.status === 'CONFIRMED' ? '#155724' : 
                               booking.status === 'PENDING' ? '#856404' : '#721c24'
                      }}>
                        {booking.status === 'CONFIRMED' ? '확정' : 
                         booking.status === 'PENDING' ? '대기중' : '취소됨'}
                      </span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '20px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <div>
                        <span style={{ fontWeight: '500', color: '#333' }}>체크인:</span> {booking.startDate}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#333' }}>체크아웃:</span> {booking.endDate}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#333' }}>인원:</span> {booking.headcount}명
                      </div>
                    </div>
                    <div style={{
                      marginTop: '8px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <span style={{ fontWeight: '500', color: '#333' }}>예약자:</span> {booking.name} ({booking.phone})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📅
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                예약 내역이 없습니다
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px'
              }}>
                아직 예약한 펜션이 없습니다.
              </p>
              <button
                onClick={() => navigate('/booking-system')}
                style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                펜션 예약하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
