import React, { useEffect } from 'react';

interface DirectionsPageProps {
  onLoginClick: () => void;
}

const DirectionsPage: React.FC<DirectionsPageProps> = ({ onLoginClick }) => {
  useEffect(() => {
    // 네이버 지도 API 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID';
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표 (실제 펜션 좌표로 변경 필요)
          zoom: 15,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.DROPDOWN
          }
        };

        const map = new window.naver.maps.Map('map', mapOptions);
        
        // 펜션 위치 마커 추가
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(37.5665, 126.9780),
          map: map
        });

        // 정보창 추가
        const infoWindow = new window.naver.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;"><strong>라온아띠 키즈 펜션</strong><br/>강원도 평창군 진부면 라온아띠길 123</div>'
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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

      {/* 지도 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div 
          id="map" 
          style={{ 
            width: '100%', 
            height: 400, 
            borderRadius: 12,
            border: '1px solid #eee'
          }}
        />
      </div>

      {/* Getting Here 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          찾아오는 길
        </h2>
        <p style={{
          fontSize: 18,
          color: '#666',
          lineHeight: 1.6,
          marginBottom: 30
        }}>
          라온아띠 키즈 펜션은 대부도에 위치해 있으며, 
          대부도 초입에서 차로 약 20분 거리에 있습니다.
        </p>
      </div>

      {/* Address 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          주소
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
              도로명 주소
            </h3>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
              강원도 평창군 진부면 라온아띠길 123
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
              지번 주소
            </h3>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>
                경기도 안산시 단원구 멍골2길 11
            </p>
          </div>
        </div>
      </div>

      {/* Transportation 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          교통편
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24, marginTop: 4 }}>🚗</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                자동차 이용
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                경기도 안산시 단원구 멍골2길 11
                카카오 맵 혹은 네이버 지도에 주소를 검색하시면
                펜션까지 쉽게 찾아오실 수 있습니다.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24, marginTop: 4 }}>🚌</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                대중교통 이용
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                평창역에서 진부면행 버스를 이용하시면 됩니다. 
                진부면사무소 정류장에서 하차 후 도보 5분 거리입니다.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24, marginTop: 4 }}>🚶</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                도보
              </h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                마을을 걸으며 신선한 공기와 지역의 매력을 느껴보세요. 
                진부면사무소에서 도보로 약 5분 거리입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Arrival Tips 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20,
          textAlign: 'left'
        }}>
          도착 팁
        </h2>
        <p style={{
          fontSize: 16,
          color: '#666',
          lineHeight: 1.6
        }}>
          마을 입구 근처에 있는 "라온아띠" 간판을 찾으시면 됩니다. 
          주요 랜드마크로는 진부면사무소와 근처 편의점이 있습니다. 
          버스 정류장은 면사무소 바로 앞에 있습니다.
        </p>
      </div>

      {/* 지도 앱 링크 섹션 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#000',
          marginBottom: 20
        }}>
          지도 앱으로 길찾기
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.open('https://map.naver.com', '_blank')}
            style={{
              background: '#03C75A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            🗺️ 카카오맵
          </button>
          
          <button 
            onClick={() => window.open('https://maps.google.com', '_blank')}
            style={{
              background: '#4285F4',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            🗺️ 구글맵
          </button>
          
          <button 
            onClick={() => window.open('https://www.tmap.co.kr', '_blank')}
            style={{
              background: '#FF6B35',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            🗺️ 티맵
          </button>
        </div>
        
        <p style={{
          fontSize: 16,
          color: '#666',
          lineHeight: 1.6
        }}>
          상세한 길안내를 원하시면 위의 지도 앱을 이용해 주세요.
        </p>
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
              연락처: (010) 1234-5678
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

export default DirectionsPage; 