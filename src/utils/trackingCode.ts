// src/utils/trackingCode.ts

const ALLOWED_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateTrackingCode = async (): Promise<string> => {
  let result = 'TWL';
  for (let i = 0; i < 10; i++) {
    result += ALLOWED_CHARS.charAt(Math.floor(Math.random() * ALLOWED_CHARS.length));
  }
  return result;
};