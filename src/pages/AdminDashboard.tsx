import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isHost } from '../utils/jwtUtils';

interface Booking {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
}

interface Room {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Occupied' | 'Blocked';
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 로그인 상태 및 HOST 권한 확인
    const token = localStorage.getItem('jwt');
    if (!token || !isHost()) {
      navigate('/');
      return;
    }

    // 샘플 데이터 로드
    loadSampleData();
  }, [navigate]);

  const loadSampleData = () => {
    // 샘플 예약 데이터
    const sampleBookings: Booking[] = [
      {
        id: '1',
        guestName: 'Ethan Harper',
        roomType: 'Family Suite',
        checkIn: '2024-07-15',
        checkOut: '2024-07-20',
        status: 'Confirmed'
      },
      {
        id: '2',
        guestName: 'Sophia Clark',
        roomType: 'Double Room',
        checkIn: '2024-07-15',
        checkOut: '2024-07-18',
        status: 'Confirmed'
      },
      {
        id: '3',
        guestName: 'Liam Foster',
        roomType: 'Single Room',
        checkIn: '2024-07-15',
        checkOut: '2024-07-16',
        status: 'Confirmed'
      },
      {
        id: '4',
        guestName: 'Olivia Morgan',
        roomType: 'Double Room',
        checkIn: '2024-07-15',
        checkOut: '2024-07-18',
        status: 'Cancelled'
      }
    ];

    // 샘플 객실 데이터
    const sampleRooms: Room[] = [
      { id: '1', name: '101', type: 'Single Room', status: 'Occupied' },
      { id: '2', name: '102', type: 'Double Room', status: 'Available' },
      { id: '3', name: '201', type: 'Family Suite', status: 'Occupied' },
      { id: '4', name: '202', type: 'Double Room', status: 'Blocked' }
    ];

    setBookings(sampleBookings);
    setRooms(sampleRooms);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
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
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
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
            { id: 'rooms', label: 'Rooms', icon: '🛏️' },
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
                { title: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, color: '#4caf50' },
                { title: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length, color: '#f44336' },
                { title: 'Available Rooms', value: rooms.filter(r => r.status === 'Available').length, color: '#ff9800' }
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
                <button style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Cancel Booking
                </button>
                <button style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Modify Booking
                </button>
              </div>

              {/* 예약 테이블 */}
              <div style={{
                overflowX: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid #444'
                    }}>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Guest Name
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Room Type
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Check-in
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Check-out
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} style={{
                        borderBottom: '1px solid #333'
                      }}>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {booking.guestName}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {booking.roomType}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {booking.checkIn}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {booking.checkOut}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
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
                Room Management
              </h3>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <button style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Add Room
                </button>
                <button style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Modify Room
                </button>
                <button style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Block Room
                </button>
              </div>

              {/* 객실 테이블 */}
              <div style={{
                overflowX: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid #444'
                    }}>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Room Number
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Type
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id} style={{
                        borderBottom: '1px solid #333'
                      }}>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {room.name}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          {room.type}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '14px'
                        }}>
                          <span style={{
                            background: getStatusColor(room.status),
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {room.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2>Bookings Management</h2>
            <p>예약 관리 기능이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <h2>Room Management</h2>
            <p>객실 관리 기능이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeTab === 'guests' && (
          <div>
            <h2>Guest Management</h2>
            <p>게스트 관리 기능이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>Settings</h2>
            <p>설정 기능이 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
