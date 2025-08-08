interface JWTPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

export const parseJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 파싱 오류:', error);
    return null;
  }
};

export const getUserRole = (): string | null => {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  const payload = parseJWT(token);
  // chatRole 기준으로 role 반환
  if (payload?.role) return payload.role;

  return null;
};

export const isHost = (): boolean => {
  const role = getUserRole();
  return role === 'ROLE_HOST';
};
