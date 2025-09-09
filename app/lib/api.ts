// app/lib/api.ts

// Leave base URL EXACTLY like before (no /api here)
export const API_URL = 'https://soapbox-server.onrender.com';

// 🔐 HARD-SET your key so the header is never empty
export const API_KEY = '99dnfneeekdegnrJJSN3JdenrsdnJ';

// Standard auth header used by your fetch calls
export const AUTH_HEADER: Record<string, string> = {
  'x-soapbox-key': API_KEY,
};
