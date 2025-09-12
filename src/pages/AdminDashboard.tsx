import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isHost } from '../utils/jwtUtils';
import axios from 'axios';

interface Booking {
  bookingId: number;
  name: string;
  startDate: string;
  endDate: string;
  headcount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  phone: string;
}

interface BlockedDate {
  blockedDateId: number;
  startDate: string;                   // "2025-08-27"
  endDate: string;                     // "2025-08-28"
  reason: string;                      // "테스트"
  type: 'BLOCKED' | 'BOOKED' | string; // 서버가 주는 값
}

interface User {
  userId: number;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
  role: string;
}



const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlockCancelModalOpen, setIsBlockCancelModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token || !isHost()) {
      navigate('/');
      return;
    }
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://www.penbot.site/api/host/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error: any) {
        alert('예약 내역 조회에 실패했습니다.');
      }
    };

    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get('https://www.penbot.site/api/host/blocks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBlockedDates(res.data);
      } catch (error: any) {
        console.error('Block 날짜 조회에 실패했습니다.', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://www.penbot.site/api/host/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (error: any) {
        console.error('유저 목록 조회에 실패했습니다.', error);
      }
    };

    fetchBookings();
    fetchBlockedDates();
    fetchUsers();
  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  const openDetailModal = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('jwt'); 
      const res = await axios.get<Booking>(`https://www.penbot.site/api/host/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedBooking(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('예약 상세 조회 실패', error);
    }
  };

  const closeDetailModal = () => {
    setSelectedBooking(null);
    setIsDetailModalOpen(false);
  };

  // Block 관련 함수들
  const openBlockModal = () => {
    setStartDate('');
    setEndDate('');
    setBlockReason('');
    setIsBlockModalOpen(true);
  };

  const closeBlockModal = () => {
    setStartDate('');
    setEndDate('');
    setBlockReason('');
    setIsBlockModalOpen(false);
  };

  const openBlockCancelModal = () => {
    setIsBlockCancelModalOpen(true);
  };

  const closeBlockCancelModal = () => {
    setIsBlockCancelModalOpen(false);
  };

  const handleBlockDate = async () => {
    if (!startDate || !endDate || !blockReason.trim()) {
      alert('시작 날짜, 종료 날짜, 사유를 모두 입력해주세요.');
      return;
    }
    if (endDate < startDate) {
      alert('종료 날짜가 시작 날짜보다 빠를 수 없습니다.');
      return;
    }
  
    try {
      const token = localStorage.getItem('jwt');
      await axios.post('https://www.penbot.site/api/host/blocks', 
        {
          startDate,   // YYYY-MM-DD
          endDate,     // YYYY-MM-DD
          reason: blockReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert('날짜가 성공적으로 차단되었습니다.');
      closeBlockModal();
  
      // 차단 목록 새로고침
      const res = await axios.get('https://www.penbot.site/api/host/blocks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlockedDates(res.data);
    } catch (error) {
      console.error('날짜 차단에 실패했습니다.', error);
      alert('날짜 차단에 실패했습니다.');
    }
  };
  

  const handleUnblockDate = async (blockedDateId: number) => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.delete(`https://www.penbot.site/api/host/blocks/${blockedDateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('차단이 성공적으로 해제되었습니다.');
      
      // 차단된 날짜 목록 새로고침
      const res = await axios.get('https://www.penbot.site/api/host/blocks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlockedDates(res.data);
    } catch (error: any) {
      console.error('차단 해제에 실패했습니다.', error);
      alert('차단 해제에 실패했습니다.');
    }
  };

  // User 관련 함수들

  const openUserDetailModal = async (userId: number) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get<User>(`https://www.penbot.site/api/host/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(res.data);
      setIsUserDetailModalOpen(true);
    } catch (error) {
      console.error('유저 상세 조회 실패', error);
      alert('유저 정보 조회에 실패했습니다.');
    }
  };

  const closeUserDetailModal = () => {
    setSelectedUser(null);
    setIsUserDetailModalOpen(false);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 이 유저를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      await axios.delete(`https://www.penbot.site/api/host/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('유저가 성공적으로 삭제되었습니다.');
      closeUserDetailModal();
      
      // 유저 목록 새로고침
      const res = await axios.get('https://www.penbot.site/api/host/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error: any) {
      console.error('유저 삭제에 실패했습니다.', error);
      alert('유저 삭제에 실패했습니다.');
    }
  };

  // 예약 상태 변경 함수 추가
  const handleUpdateBookingStatus = async (bookingId: number, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    if (!window.confirm(`예약 상태를 ${newStatus === 'CONFIRMED' ? '확정' : '취소'}하시겠습니까?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      
      await axios.put(`https://www.penbot.site/api/host/bookings/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`예약 상태가 성공적으로 ${newStatus === 'CONFIRMED' ? '확정' : '취소'}되었습니다.`);
      
      // 예약 목록 새로고침
      const res = await axios.get('https://www.penbot.site/api/host/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      
      // 모달 닫기
      closeDetailModal();
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      console.error('예약 상태 변경 실패', { status, data });
      alert('예약 상태 변경에 실패했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '#4caf50';
      case 'Cancelled':
        return '#f44336';
      case 'Pending':
        return '#ff9800';
      case 'Available':
        return '#4caf50';
      case 'Occupied':
        return '#2196f3';
      case 'Blocked':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toString().includes(searchTerm)  
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      display: 'flex'
    }}>
      {/* 사이드바 */}
      <div style={{
        width: '250px',
        backgroundColor: '#2d2d2d',
        padding: '20px',
        borderRight: '1px solid #444'
      }}>
        <div style={{
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            color: '#fff'
          }}>
            Pension Manager
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#aaa',
            margin: '5px 0 0 0'
          }}>
            Manage your pension efficiently
          </p>
        </div>

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'bookings', label: 'Bookings', icon: '📅' },
            { id: 'guests', label: 'Guests', icon: '👥' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: activeTab === item.id ? '#444' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            background: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: 'auto',
            width: '100%'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        flex: 1,
        padding: '30px',
        backgroundColor: '#1a1a1a'
      }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0'
              }}>
                Dashboard
              </h2>
              <p style={{
                color: '#aaa',
                fontSize: '16px',
                margin: 0
              }}>
                Overview of your pension's performance
              </p>
            </div>

            {/* 통계 카드들 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                { title: 'Total Bookings', value: bookings.length, color: '#2196f3' },
                { title: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, color: '#4caf50' },
                { title: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length, color: '#f44336' },
              ].map((stat, index) => (
                <div key={index} style={{
                  background: '#2d2d2d',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${stat.color}`
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    color: '#aaa',
                    margin: '0 0 10px 0'
                  }}>
                    {stat.title}
                  </h3>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: stat.color,
                    margin: 0
                  }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* 예약 관리 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 20px 0'
              }}>
                Booking Management
              </h3>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <input
                  type="text"
                  placeholder="Search bookings by guest name or booking ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* 예약 테이블 */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Booking ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Guest Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Check-in</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Check-out</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Headcount</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.bookingId} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{booking.bookingId}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{booking.name}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{booking.startDate}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{booking.endDate}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{booking.headcount}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          <span style={{
                            background: getStatusColor(booking.status),
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 객실 관리 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 20px 0'
              }}>
                UnAvailable Day Management
              </h3>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <button 
                  onClick={openBlockModal}
                  style={{
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                  Block
                </button>
                <button 
                  onClick={openBlockCancelModal}
                  style={{
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                  Block Cancel
                </button>
              </div>

              {/* Block 목록 표시 */}
              <div style={{ overflowX: 'auto', marginTop: 10 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #444' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>기간</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>사유</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>유형</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockedDates.length > 0 ? (
                        blockedDates.map((b, idx) => (
                          <tr key={b.blockedDateId ?? `${b.startDate}_${b.endDate}_${idx}`} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              {b.startDate} ~ {b.endDate}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>{b.reason}</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>{b.type}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>
                            차단된 기간이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div style={{
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0'
              }}>
                예약 관리
              </h2>
              <p style={{
                color: '#aaa',
                fontSize: '16px',
                margin: 0
              }}>
                모든 예약 내역을 확인하고 관리하세요
              </p>
            </div>

            {/* 검색 바 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <input
                  type="text"
                  placeholder="예약자명 또는 예약 ID로 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* 예약 목록 테이블 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 20px 0'
              }}>
                예약 목록
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>예약 ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>예약자명</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>체크인</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>체크아웃</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>인원수</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>상태</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map(booking => (
                        <tr key={booking.bookingId} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{booking.bookingId}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{booking.name}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{booking.startDate}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{booking.endDate}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{booking.headcount}명</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            <span style={{
                              background: getStatusColor(booking.status),
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {booking.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            <button
                              onClick={() => openDetailModal(booking.bookingId)}
                              style={{
                                background: '#2196f3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ 
                          padding: '40px', 
                          textAlign: 'center', 
                          color: '#aaa',
                          fontSize: '16px'
                        }}>
                          {searchTerm ? '검색 결과가 없습니다.' : '등록된 예약이 없습니다.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div>
            <div style={{
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0'
              }}>
                유저 관리
              </h2>
              <p style={{
                color: '#aaa',
                fontSize: '16px',
                margin: 0
              }}>
                가입된 모든 유저 정보를 확인하고 관리하세요
              </p>
            </div>

            {/* 검색 바 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <input
                  type="text"
                  placeholder="유저명 또는 이메일로 검색하세요"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* 유저 목록 테이블 */}
            <div style={{
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 20px 0'
              }}>
                가입 유저 목록
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>유저 ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>이메일</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>이름</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>전화번호</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>역할</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>가입일</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(user => 
                      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                    ).length > 0 ? (
                      users.filter(user => 
                        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).map(user => (
                        <tr key={user.userId} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{user.userId}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{user.email}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{user.name}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{user.phone}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            <span style={{
                              background: user.role === 'HOST' ? '#4caf50' : '#2196f3',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            <button
                              onClick={() => openUserDetailModal(user.userId)}
                              style={{
                                background: '#2196f3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ 
                          padding: '40px', 
                          textAlign: 'center', 
                          color: '#aaa',
                          fontSize: '16px'
                        }}>
                          {userSearchTerm ? '검색 결과가 없습니다.' : '등록된 유저가 없습니다.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>Settings</h2>
            <p>설정 기능이 여기에 표시됩니다.</p>
          </div>
        )}
      </div>

      {/* 예약 상세보기 모달 */}
      {isDetailModalOpen && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d2d',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* 모달 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #444'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: '#fff'
              }}>
                예약 상세 정보
              </h3>
              <button
                onClick={closeDetailModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>예약 ID:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.bookingId || 'undefined'}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>예약자명:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.name}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>연락처:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.phone}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>체크인 날짜:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.startDate}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>체크아웃 날짜:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.endDate}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>인원수:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedBooking.headcount}명</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>예약 상태:</span>
                <span style={{
                  background: getStatusColor(selectedBooking.status),
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              {/* 예약 상태 변경 버튼들 - PENDING 상태일 때만 표시 */}
              {selectedBooking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBooking.bookingId, 'CONFIRMED')}
                    style={{
                      background: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    예약 확정
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBooking.bookingId, 'CANCELLED')}
                    style={{
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    예약 취소
                  </button>
                </>
              )}
              
              <button
                onClick={closeDetailModal}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block 날짜 선택 모달 */}
      {isBlockModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d2d',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* 모달 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #444'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: '#fff'
              }}>
                날짜 차단하기
              </h3>
              <button
                onClick={closeBlockModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                    시작 날짜
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                    종료 날짜
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                  차단 사유
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="차단 사유를 입력해주세요..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* 모달 푸터 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={closeBlockModal}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleBlockDate}
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                차단하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Cancel 모달 */}
      {isBlockCancelModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d2d',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* 모달 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #444'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: '#fff'
              }}>
                차단된 날짜 관리
              </h3>
              <button
                onClick={closeBlockCancelModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div style={{
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {blockedDates.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {blockedDates.map(blockedDate => (
                    <div key={blockedDate.blockedDateId} style={{
                      background: '#1a1a1a',
                      borderRadius: '8px',
                      padding: '15px',
                      border: '1px solid #444'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '15px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '5px'
                          }}>
                            {blockedDate.startDate}
                          </div>
                          <div style={{
                            color: '#aaa',
                            fontSize: '14px'
                          }}>
                            {blockedDate.reason}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('이 날짜의 차단을 해제하시겠습니까?')) {
                              handleUnblockDate(blockedDate.blockedDateId);
                            }
                          }}
                          style={{
                            background: '#ff9800',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          차단 해제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#aaa',
                  fontSize: '16px',
                  padding: '40px'
                }}>
                  차단된 날짜가 없습니다.
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeBlockCancelModal}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 유저 상세보기 모달 */}
      {isUserDetailModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d2d',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* 모달 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #444'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: '#fff'
              }}>
                유저 상세 정보
              </h3>
              <button
                onClick={closeUserDetailModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>유저 ID:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedUser.userId}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>이메일:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedUser.email}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>이름:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedUser.name}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>전화번호:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{selectedUser.phone}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>권한한:</span>
                <span style={{
                  background: selectedUser.role === 'HOST' ? '#4caf50' : '#2196f3',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {selectedUser.role}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>가입일:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                  {new Date(selectedUser.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <button
                onClick={() => handleDeleteUser(selectedUser.userId)}
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                유저 삭제
              </button>
              <button
                onClick={closeUserDetailModal}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
