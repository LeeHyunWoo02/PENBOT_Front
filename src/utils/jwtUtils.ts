// JWT 토큰 유틸리티 함수들

/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 페이로드 객체 또는 null
 */
export const decodeJWT = (token: string): any | null => {
  try {
    // JWT 토큰은 header.payload.signature 형식
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // payload 부분을 디코딩 (Base64)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('JWT 토큰 디코딩 실패:', error);
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰 문자열
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true; // 페이로드가 없거나 exp가 없으면 만료된 것으로 간주
  }

  // exp는 Unix timestamp (초 단위)
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * JWT 토큰의 만료 시간까지 남은 시간을 계산합니다.
 * @param token JWT 토큰 문자열
 * @returns 만료까지 남은 시간 (밀리초), 만료되었으면 0
 */
export const getTimeUntilExpiry = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = (payload.exp - currentTime) * 1000; // 밀리초로 변환
  
  return Math.max(0, timeUntilExpiry);
};

/**
 * 현재 사용자가 호스트(관리자)인지 확인합니다.
 * @param tokenKey localStorage의 토큰 키 (기본값: 'jwt')
 * @returns 호스트 여부
 */
export const isHost = (tokenKey: string = 'jwt'): boolean => {
  const token = localStorage.getItem(tokenKey);
  if (!token || isTokenExpired(token)) {
    return false;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return false;
  }

  // JWT 페이로드에서 role 또는 권한 정보 확인
  // 서버에서 'role': 'HOST' 또는 'isHost': true 등을 설정한다고 가정
  return payload.role === 'HOST' || payload.isHost === true || payload.authorities?.includes('HOST');
};

/**
 * localStorage에서 만료된 JWT 토큰을 자동으로 제거합니다.
 * @param tokenKey localStorage의 토큰 키 (기본값: 'jwt')
 */
export const removeExpiredToken = (tokenKey: string = 'jwt'): void => {
  const token = localStorage.getItem(tokenKey);
  if (token && isTokenExpired(token)) {
    console.log('만료된 JWT 토큰을 localStorage에서 제거합니다.');
    localStorage.removeItem(tokenKey);
  }
};

/**
 * JWT 토큰 만료를 모니터링하고 자동으로 제거하는 타이머를 설정합니다.
 * @param onTokenExpired 토큰 만료 시 호출될 콜백 함수
 * @param tokenKey localStorage의 토큰 키 (기본값: 'jwt')
 * @returns 타이머 ID (clearTimeout으로 정리 가능)
 */
export const startTokenExpiryMonitor = (
  onTokenExpired?: () => void,
  tokenKey: string = 'jwt'
): number | null => {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    return null;
  }

  // 이미 만료된 토큰이면 즉시 제거
  if (isTokenExpired(token)) {
    localStorage.removeItem(tokenKey);
    onTokenExpired?.();
    return null;
  }

  // 만료까지 남은 시간 계산
  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (timeUntilExpiry <= 0) {
    localStorage.removeItem(tokenKey);
    onTokenExpired?.();
    return null;
  }

  // 만료 시간에 맞춰 타이머 설정
  const timer = setTimeout(() => {
    localStorage.removeItem(tokenKey);
    console.log('JWT 토큰이 만료되어 localStorage에서 제거되었습니다.');
    onTokenExpired?.();
  }, timeUntilExpiry);

  console.log(`JWT 토큰 만료 모니터링 시작: ${Math.floor(timeUntilExpiry / 1000)}초 후 만료`);
  
  return timer;
};