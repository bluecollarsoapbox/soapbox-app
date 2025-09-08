// app/lib/api.ts

// Public base URL for the server (Render)
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://soapbox-server.onrender.com';

// API key the server expects in x-soapbox-key
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

// Standard auth header you can spread into fetch calls
export const AUTH_HEADER: Record<string, string> = API_KEY
  ? { 'x-soapbox-key': API_KEY }
  : {};
