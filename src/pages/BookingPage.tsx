import React from 'react';

interface BookingPageProps {
  onLoginClick: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onLoginClick: _onLoginClick }) => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* 메인 이미지 섹션 */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <img
          src="/images/introduce.jpg"
          alt="라온아띠 펜션 실내"
          style={{
            width: '100%',
            height: 400,
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Booking Information 섹션 */}
      <div style={{ textAlign: 'center', padding: '0 20px 40px 20px' }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#000',
          marginBottom: 20
        }}>
          예약 정보
        </h1>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6,
          maxWidth: 800,
          margin: '0 auto'
        }}>
          예약 및 문의사항은 010-2661-7200 로 연락해 주세요.
        </p>
      </div>

      {/* Deposit Account Details 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          입금 계좌 정보
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 20
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
              은행명
            </h3>
            <p style={{ fontSize: 16, color: '#666' }}>카카오뱅크</p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
              계좌번호
            </h3>
            <p style={{ fontSize: 16, color: '#666' }}>123-456-789012</p>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
            예금주
          </h3>
          <p style={{ fontSize: 16, color: '#666' }}>라온아띠 키즈 펜션</p>
        </div>
      </div>

      {/* Booking Methods 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          예약 방법
        </h2>
        <p style={{
          fontSize: 16,
          color: '#666',
          lineHeight: 1.6,
          marginBottom: 30
        }}>
          아래 방법을 통해 예약하실 수 있습니다:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>📞</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                전화
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}> 010-2661-7200</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>💬</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                문자
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>010-2661-7200</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>🌐</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                온라인
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>웹사이트 방문 | 여기어때 예약 | 네이버 예약</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Policy 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          환불 정책
        </h2>
        <p style={{
          fontSize: 16,
          color: '#666',
          lineHeight: 1.6,
          marginBottom: 30
        }}>
          환불 정책은 다음과 같습니다:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>📅</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                체크인 30일 전까지
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>전액 환불</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>📅</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                체크인 15-29일 전
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>50% 환불</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>📅</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                체크인 14일 이내
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>환불 불가</p>
            </div>
          </div>
        </div>
        
        <p style={{
          fontSize: 14,
          color: '#666',
          lineHeight: 1.6,
          marginTop: 20,
          fontStyle: 'italic'
        }}>
          자연재해나 개인사정 등 특별한 경우에는 환불 규정이 적용될 수 있습니다. 
          자세한 사항은 문의해 주세요.
        </p>
      </div>

      {/* Other Important Notes 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          기타 중요 사항
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>🕒</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                체크인
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>오후 3시</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>🕒</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                체크아웃
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>오전 11시</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>👥</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                추가 인원 요금
              </h3>
              <p style={{ fontSize: 16, color: '#666' }}>1명당 20,000원</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer 정보 */}
      <div style={{ 
        padding: '40px 20px', 
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: 800,
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
              위치: 경기도 안산시 단원구 멍골2길 11
            </p>
            <p style={{ fontSize: 16, color: '#666' }}>
              연락처: 010-2661-7200
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>ⓕ</span>
              <span style={{ fontSize: 20 }}>📷</span>
            </div>
            <p style={{ fontSize: 14, color: '#999' }}>
              ©2025 라온아띠 키즈 펜션. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 