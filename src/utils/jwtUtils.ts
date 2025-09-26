
/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 페이로드 객체 또는 null
 */
export const decodeJWT = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

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
    return true; 
  }

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

  // 수집 가능한 권한/역할 필드들 추출
  const candidates: any[] = [];
  if (payload.role) candidates.push(payload.role);
  if (payload.roles) candidates.push(payload.roles);
  if (payload.authorities) candidates.push(payload.authorities);
  if (payload.authority) candidates.push(payload.authority);
  if (payload.permissions) candidates.push(payload.permissions);

  // 문자열/배열 모두 대문자 문자열 배열로 정규화
  const flatRoles: string[] = candidates
    .flatMap((v) => Array.isArray(v) ? v : [v])
    .filter((v) => typeof v === 'string')
    .map((v: string) => v.toUpperCase());

  // 포함 규칙: 'HOST' 또는 'ROLE_HOST' 등이 하나라도 포함
  if (flatRoles.some((r) => r === 'HOST' || r === 'ROLE_HOST' || r.includes('HOST'))) {
    return true;
  }

  // 백업: 서버가 boolean 플래그 제공 시
  if (payload.isHost === true) return true;

  return false;
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

  if (isTokenExpired(token)) {
    localStorage.removeItem(tokenKey);
    onTokenExpired?.();
    return null;
  }

  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (timeUntilExpiry <= 0) {
    localStorage.removeItem(tokenKey);
    onTokenExpired?.();
    return null;
  }
  
  const timer = setTimeout(() => {
    localStorage.removeItem(tokenKey);
    console.log('JWT 토큰이 만료되어 localStorage에서 제거되었습니다.');
    onTokenExpired?.();
  }, timeUntilExpiry);

  console.log(`JWT 토큰 만료 모니터링 시작: ${Math.floor(timeUntilExpiry / 1000)}초 후 만료`);
  
  return timer;
};