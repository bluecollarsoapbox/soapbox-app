// app/lib/api.ts
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://soapbox-server.onrender.com";

export const API_KEY = "99dnfneeekdegnrJJSN3JdenrsdnJ";
export const AUTH_HEADER = { "x-soapbox-key": API_KEY };
