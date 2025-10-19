import type { JWTPayload } from "../types/Jwt";

export function decodeJWTToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    const decodedPayload = atob(paddedPayload);
    
    const parsedPayload: JWTPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean | null {
  const payload = decodeJWTToken(token);
  if (!payload) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function getUserRole(token: string): string | null {
  const payload = decodeJWTToken(token);
  return payload?.scope || null;
}

export function getUsername(token: string): string | null {
  const payload = decodeJWTToken(token);
  return payload?.sub || null;
}