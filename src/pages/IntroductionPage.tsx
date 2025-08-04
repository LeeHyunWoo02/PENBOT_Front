import React from 'react';

interface IntroductionPageProps {
  onLoginClick: () => void;
}

const IntroductionPage: React.FC<IntroductionPageProps> = ({ onLoginClick }) => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* 메인 이미지 섹션 */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
          alt="라온아띠 펜션 외관"
          style={{
            width: '100%',
            height: 400,
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Your Private Retreat Awaits 섹션 */}
      <div style={{ textAlign: 'center', padding: '0 20px 40px 20px' }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#000',
          marginBottom: 20
        }}>
          당신만의 프라이빗 휴식이 기다립니다
        </h1>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6,
          maxWidth: 800,
          margin: '0 auto'
        }}>
          라온아띠 키즈 펜션에서 편안하고 프라이빗한 휴식을 경험하세요. 
          가족, 친구, 단체 여행에 최적화된 넓은 공간에서 잊을 수 없는 추억을 만드세요.
        </p>
      </div>

      {/* Key Features 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 30,
          textAlign: 'center'
        }}>
          주요 특징
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 30
        }}>
          {/* 왼쪽 열 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                넓고 프라이빗한 공간
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                충분한 공간과 프라이빗함을 제공하여 평화롭고 편안한 휴식을 보장합니다.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                총 면적
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                펜션은 2000평방피트 이상의 넓은 공간으로, 충분한 여유 공간을 제공합니다.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                프라이빗 야외 공간
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                전용 마당과 수영장장이 있어 야외 활동과 휴식에 최적입니다.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                완전한 프라이빗
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                공유 공간 없이 완전한 프라이빗함을 경험하세요.
              </p>
            </div>
          </div>
          
          {/* 오른쪽 열 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                최대 수용 인원
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                최대 16명까지 편안하게 수용 가능합니다.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                객실 구성
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                2개의 침실, 넓은 거실, 완비된 주방, 전용 바베큐 공간을 갖추고 있습니다.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                아름다운 전망
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                람사르 습지에 등록된 갯벌 체험과 멋진 바다를 바라보며 평온한 시간을 보낼 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ideal For 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20
        }}>
          추천 대상
        </h2>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6
        }}>
          편안하고 안전한 환경을 찾는 가족, 재미있고 프라이빗한 모임 장소를 찾는 친구 그룹, 
          넓은 공간과 편의 시설을 원하는 대규모 파티에 최적입니다.
        </p>
      </div>

      {/* Facilities & Amenities 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 30,
          textAlign: 'center'
        }}>
          편의 시설
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              🍳
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>완비된 주방</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              🛁
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>개인 수영장</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              📶
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>고속 Wi-Fi</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              📺
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>스마트 TV와 노래방방</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              🔥
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>전용 바베큐</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: '2px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: 24
            }}>
              🚗
            </div>
            <p style={{ fontSize: 16, color: '#666' }}>충분한 주차</p>
          </div>
        </div>
      </div>

      {/* Pricing & Availability 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20
        }}>
          예약 및 가격
        </h2>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6,
          marginBottom: 30
        }}>
          예약 캘린더에서 가용성과 가격을 확인하세요. 
          경쟁력 있는 요금과 유연한 예약 옵션을 제공합니다.
        </p>
        <button 
          onClick={onLoginClick}
          style={{
            background: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            fontWeight: 500,
            fontSize: 18,
            cursor: 'pointer'
          }}
        >
          지금 예약하기
        </button>
      </div>

      {/* Location & Contact 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20
        }}>
          위치 및 연락처
        </h2>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6
        }}>
          대부도도에 위치한 라온아띠 키즈 펜션입니다. 
          문의사항은 [전화번호] 또는 [이메일]로 연락해 주세요.
        </p>
      </div>

      {/* Follow Us 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20
        }}>
          팔로우하기
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <p style={{ fontSize: 16, color: '#666' }}>인스타그램</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>ⓕ</div>
            <p style={{ fontSize: 16, color: '#666' }}>페이스북</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🐦</div>
            <p style={{ fontSize: 16, color: '#666' }}>트위터</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage; 