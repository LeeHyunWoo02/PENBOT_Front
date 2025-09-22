import React, { useEffect } from 'react';

interface DirectionsPageProps {
  onLoginClick: () => void;
}

const DirectionsPage: React.FC<DirectionsPageProps> = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 중복 로드 방지
    const existing = document.querySelector('script[data-naver-maps-loader="true"]') as HTMLScriptElement | null;
    if (existing && (window as any).naver && (window as any).naver.maps) {
      console.log('[NaverMap] script already loaded, initializing map');
      (window as any).initNaverMap?.();
      return;
    }

    // 인증 실패 핸들러 (공식 문서 권장 네이밍)
    (window as any).navermap_authFailure = function () {
      console.error('[NaverMap] OPENAPI 인증 실패', {
        origin: window.location.origin,
        href: window.location.href
      });
      alert('네이버 지도 인증에 실패했습니다. 콘솔 로그를 확인하세요.');
    };

    // 콜백에서 지도 초기화
    (window as any).initNaverMap = function () {
      try {
        console.log('[NaverMap] initNaverMap callback fired');
        if (!(window as any).naver || !(window as any).naver.maps) {
          console.error('[NaverMap] naver.maps not available after load');
          return;
        }
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
          console.error('[NaverMap] map container not found');
          return;
        }
        const center = new (window as any).naver.maps.LatLng(37.207427, 126.568411);
        const mapOptions = {
          center,
          zoom: 15,
          mapTypeControl: true,
          mapTypeControlOptions: { style: (window as any).naver.maps.MapTypeControlStyle.DROPDOWN }
        } as any;
        const map = new (window as any).naver.maps.Map(mapContainer, mapOptions);
        console.log('[NaverMap] map created', mapOptions);

        const marker = new (window as any).naver.maps.Marker({ position: center, map });
        const infoWindow = new (window as any).naver.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;"><strong>라온아띠 키즈 펜션</strong><br/>강원도 평창군 진부면 라온아띠길 123</div>'
        });
        (window as any).naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) infoWindow.close(); else infoWindow.open(map, marker);
        });
      } catch (e) {
        console.error('[NaverMap] init error', e);
      }
    };

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAPS_API_KEY}&callback=initNaverMap`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-naver-maps-loader', 'true');
    script.onerror = () => {
      console.error('[NaverMap] script load error');
    };
    console.log('[NaverMap] injecting script', { src: script.src, origin: window.location.origin, href: window.location.href });
    document.head.appendChild(script);

    return () => {
      try {
        (window as any).initNaverMap = undefined;
        (window as any).navermap_authFailure = undefined;
      } catch {}
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* 메인 이미지 섹션 */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <img
          src="/images/intro_img1.png"
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
              경기도 안산시 단원구 멍골2길 11-1
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
          마을 입구 근처에 있는 "라온아띠" 간판을 찾으시면 됩니다. <br/>
          근처 편의점은 없으니 들어오는 길에 마트에서 물품을 구입해 주세요.
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