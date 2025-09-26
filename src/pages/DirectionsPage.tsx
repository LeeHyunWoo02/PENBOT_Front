import React, { useEffect } from 'react';

interface DirectionsPageProps {
  onLoginClick: () => void;
}

const DirectionsPage: React.FC<DirectionsPageProps> = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeKakaoMap = () => {
      try {
        if (!(window as any).kakao?.maps) {
          console.error('[KakaoMap] kakao.maps not available');
          return;
        }
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
          console.error('[KakaoMap] map container not found');
          return;
        }
        const center = new (window as any).kakao.maps.LatLng(37.207427, 126.568411);
        const mapOptions = { center, level: 4 } as any;
        const map = new (window as any).kakao.maps.Map(mapContainer, mapOptions);
        const marker = new (window as any).kakao.maps.Marker({ position: center });
        marker.setMap(map);
        const infoWindow = new (window as any).kakao.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;"><strong>라온아띠 키즈 펜션</strong><br/>경기도 안산시 단원구 멍골2길 11</div>'
        });
        (window as any).kakao.maps.event.addListener(marker, 'click', () => {
          infoWindow.getMap() ? infoWindow.close() : infoWindow.open(map, marker);
        });
      } catch (e) {
        console.error('[KakaoMap] init error', e);
      }
    };

    // 1) SDK 이미 로드되어 있고 maps 사용 가능 → 즉시 초기화
    if ((window as any).kakao?.maps) {
      (window as any).kakao.maps.load(initializeKakaoMap);
      return;
    }

    // 2) 이미 SDK 스크립트가 존재하는지 (src 기반) 확인 → 로드 완료/대기 처리
    const existing = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]') as HTMLScriptElement | null;
    if (existing) {
      console.log('[KakaoMap] script already present');
      const tryLoad = () => {
        if ((window as any).kakao?.maps?.load) {
          (window as any).kakao.maps.load(initializeKakaoMap);
        } else {
          setTimeout(tryLoad, 100);
        }
      };
      if (existing.getAttribute('data-kakao-ready') === 'true') {
        tryLoad();
      } else {
        existing.addEventListener('load', () => {
          existing.setAttribute('data-kakao-ready', 'true');
          tryLoad();
        }, { once: true });
      }
      return;
    }

    // 3) 처음 로드: 환경 변수 키 확인 후 주입
    const kakaoKey = import.meta.env.VITE_KAKAOMAP_KEY as string | undefined;
    if (!kakaoKey) {
      console.error('[KakaoMap] VITE_KAKAOMAP_KEY is not set');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-kakao-maps-loader', 'true');
    script.addEventListener('load', () => {
      script.setAttribute('data-kakao-ready', 'true');
      try {
        (window as any).kakao.maps.load(initializeKakaoMap);
      } catch (e) {
        console.error('[KakaoMap] load failed', e);
      }
    }, { once: true });
    script.addEventListener('error', () => {
      console.error('[KakaoMap] script load error');
    }, { once: true });
    document.head.appendChild(script);

    return () => {
      // no-op
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ width: '100%', marginBottom: 40 }}>
        <img
          src="/images/intro_img1.png"
          alt="라온아띠 펜션 외관"
          style={{ width: '100%', height: 400, objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div id="map" style={{ width: '100%', height: 400, borderRadius: 12, border: '1px solid #eee' }} />
      </div>
      {/* 이하 기존 섹션 유지 */}
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#000', marginBottom: 20, textAlign: 'left' }}>찾아오는 길</h2>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6, marginBottom: 30 }}>
          라온아띠 키즈 펜션은 대부도에 위치해 있으며, 
          대부도 초입에서 차로 약 20분 거리에 있습니다.
        </p>
      </div>
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#000', marginBottom: 20, textAlign: 'left' }}>주소</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>도로명 주소</h3>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>경기도 안산시 단원구 멍골2길 11-1</p>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>지번 주소</h3>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.5 }}>경기도 안산시 단원구 멍골2길 11</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#000', marginBottom: 20, textAlign: 'left' }}>교통편</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24, marginTop: 4 }}>🚗</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 8 }}>자동차 이용</h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                경기도 안산시 단원구 멍골2길 11
                카카오 맵 혹은 네이버 지도에 주소를 검색하시면
                펜션까지 쉽게 찾아오실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#000', marginBottom: 20, textAlign: 'left' }}>도착 팁</h2>
        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
          마을 입구 근처에 있는 "라온아띠" 간판을 찾으시면 됩니다. <br/>
          근처 편의점은 없으니 들어오는 길에 마트에서 물품을 구입해 주세요.
        </p>
      </div>
      <div style={{ padding: '0 20px 40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#000', marginBottom: 20 }}>지도 앱으로 길찾기</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          <button onClick={() => window.open('https://map.kakao.com', '_blank')} style={{ background: '#FEE500', color: '#000', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>🗺️ 카카오맵</button>
          <button onClick={() => window.open('https://maps.google.com', '_blank')} style={{ background: '#4285F4', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>🗺️ 구글맵</button>
          <button onClick={() => window.open('https://www.tmap.co.kr', '_blank')} style={{ background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>🗺️ 티맵</button>
        </div>
        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>상세한 길안내를 원하시면 위의 지도 앱을 이용해 주세요.</p>
      </div>
      <div style={{ padding: '40px 20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '0 auto', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>위치: 경기도 안산시 단원구 멍골2길 11</p>
            <p style={{ fontSize: 16, color: '#666' }}>연락처: (010) 1234-5678</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>ⓕ</span>
              <span style={{ fontSize: 20 }}>📷</span>
            </div>
            <p style={{ fontSize: 14, color: '#999' }}>©2025 라온아띠 키즈 펜션. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionsPage; 