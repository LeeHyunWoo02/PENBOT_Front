import axios from 'axios';
import React, { useState } from 'react';

interface BookingSystemPageProps {
  onLoginClick: () => void;
}

const BookingSystemPage: React.FC<BookingSystemPageProps> = ({ onLoginClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState('');

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 이전 달의 마지막 날들
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const prevMonthDays = [];
  for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
    prevMonthDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay.getDate() - i + 1));
  }
  
  // 현재 달의 모든 날들
  const currentMonthDays = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    currentMonthDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }
  
  // 다음 달의 첫 번째 날들
  const nextMonthDays = [];
  const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length); // 6주 고정
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    // 오늘 이전 날짜는 선택 불가
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 시작 날짜 선택 또는 새로운 선택
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // 종료 날짜 선택
      if (date > selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        // 시작 날짜보다 이전 날짜를 선택한 경우 시작 날짜로 설정
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date) => {
    if (!selectedStartDate) return false;
    
    if (selectedEndDate) {
      // 범위 선택된 경우
      return date >= selectedStartDate && date <= selectedEndDate;
    } else {
      // 시작 날짜만 선택된 경우
      return date.getTime() === selectedStartDate.getTime();
    }
  };

  const isStartDate = (date: Date) => {
    return selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  const isEndDate = (date: Date) => {
    return selectedEndDate && date.getTime() === selectedEndDate.getTime();
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateDisplay = () => {
    if (!selectedStartDate) return "날짜를 선택해주세요";
    
    const startDateStr = selectedStartDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
    
    if (!selectedEndDate) {
      return `${startDateStr} (1박)`;
    }
    
    const endDateStr = selectedEndDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
    
    const nights = Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${startDateStr} ~ ${endDateStr} (${nights}박)`;
  };

  // 종료일 없으면 +1 반환 ( 1일 예약 가능하게 함 )
  const getEndDateForAPI = () => {
    if (selectedEndDate) return selectedEndDate;
    if (selectedStartDate) {
      const nextDay = new Date(selectedStartDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10);
  };


  const handleCheckAvailability = async () => {
    if (!selectedStartDate ) {
      alert('날짜를 선택해주세요.');
      return;
    }

    const endDate = getEndDateForAPI();
    if (!endDate) {
      alert('종료일 계산에 실패했습니다.');
      return;
    }

    const params = {
      startDate: formatDate(selectedStartDate),
      endDate: formatDate(endDate),
    };
  
    try {
      const res = await axios.get('http://localhost:8080/api/bookings/available',{
        params
      });
      console.log(res.data);
      alert('예약이 가능합니다다!');
    
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert('예약 불가능: ' + error.response.data.message);
      } else {
        alert('예약 가능 여부 조회 중 오류가 발생했습니다.');
      }
    }
  }
  const [loading, setLoading] = useState(false);


  const handleBooking = async () => {
    if(loading) return;

    setLoading(true);

    if (!selectedStartDate || !guestCount) {
      alert('모든 정보를 입력해 주세요.');
      return;
    }
    const endDate = getEndDateForAPI();
    if (!endDate) {
      alert('종료일 계산에 실패했습니다.');
      return;   
    }

    const body = {
      startDate: formatDate(selectedStartDate),
      endDate: formatDate(endDate),
      headcount: Number(guestCount),
    };
    
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        alert('로그인이 필요합니다.');
        onLoginClick(); 
        return;
      }
      const res = await axios.post('http://localhost:8080/api/bookings/', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('예약이 완료되었습니다!');
      window.location.href = '/';
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert('예약 실패: ' + error.response.data.message);
      } else {
        alert('예약 중 오류가 발생했습니다.');
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      minHeight: '100vh',
      color: '#fff',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 10
          }}>
            실시간 예약
          </h1>
          <p style={{
            fontSize: 18,
            color: '#ccc',
            lineHeight: 1.6
          }}>
            편리한 예약 시스템으로 완벽한 숙박을 찾아보세요.
          </p>
        </div>

        {/* 예약 폼 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          marginBottom: 40
        }}>
          {/* 캘린더 섹션 */}
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: 12,
            padding: 30
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <button
                onClick={handlePrevMonth}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                ‹
              </button>
              <h2 style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#fff'
              }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={handleNextMonth}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                ›
              </button>
            </div>

            {/* 요일 헤더 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginBottom: 10
            }}>
              {weekDays.map((day, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#888',
                  padding: '8px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8
            }}>
              {allDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  style={{
                    background: isStartDate(date) || isEndDate(date) ? '#2196f3' : 
                               isInRange(date) ? '#1976d2' : 'transparent',
                    border: isStartDate(date) || isEndDate(date) ? '2px solid #fff' : 'none',
                    borderRadius: 8,
                    padding: '12px 8px',
                    fontSize: 14,
                    color: isPastDate(date) ? '#444' : (isCurrentMonth(date) ? '#fff' : '#666'),
                    cursor: isPastDate(date) ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isPastDate(date) ? 0.5 : 1
                  }}
                  disabled={isPastDate(date)}
                >
                  {date.getDate()}
                  {isToday(date) && (
                    <div style={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      backgroundColor: '#2196f3',
                      borderRadius: '50%'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 예약 옵션 섹션 */}
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: 12,
            padding: 30
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 20
            }}>
              예약 정보
            </h3>

            {/* 선택된 날짜 표시 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 16,
                color: '#ccc',
                marginBottom: 8
              }}>
                선택된 날짜
              </label>
              <div style={{
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #444',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                fontSize: 16,
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {getDateDisplay()}
              </div>
            </div>

            {/* 투숙객 수 선택 */}
            <div style={{ marginBottom: 30 }}>
              <label style={{
                display: 'block',
                fontSize: 16,
                color: '#ccc',
                marginBottom: 8
              }}>
                투숙객 수
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: '1px solid #444',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: 16
                }}
              >
                <option value="">투숙객 수를 선택하세요</option>
                <option value="6">6명</option>
                <option value="7">7명</option>
                <option value="8">8명</option>
                <option value="9">9명</option>
                <option value="10">10명</option>
                <option value="11">11명</option>
                <option value="12">12명</option>
                <option value="13">13명</option>
                <option value="14">14명</option>
                <option value="15">15명</option>
              </select>
            </div>

            {/* 가용성 확인 버튼 */}
            <button
              onClick={handleCheckAvailability}
              style={{
                width: '100%',
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: 20
              }}
            >
              가용성 확인
            </button>

            {/* 예약하기 버튼 */}
            <button
              onClick={handleBooking}
              disabled={loading}
              style={{
                width: '100%',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              예약하기
            </button>
          </div>
        </div>

        {/* 예약 정보 표시 */}
        {selectedStartDate && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: 12,
            padding: 30,
            marginBottom: 40
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 20
            }}>
              선택된 예약 정보
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20
            }}>
              <div>
                <p style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>선택된 날짜</p>
                <p style={{ fontSize: 16, color: '#fff' }}>
                  {getDateDisplay()}
                </p>
              </div>
              {guestCount && (
                <div>
                  <p style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>투숙객 수</p>
                  <p style={{ fontSize: 16, color: '#fff' }}>{guestCount}명</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSystemPage; 