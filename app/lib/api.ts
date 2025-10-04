// soapbox-app/lib/api.ts

export const API_URL = 'https://soapbox-server.onrender.com';

// this adds your admin key header so all uploads and admin actions work
export const AUTH_HEADER = {
  'x-soapbox-key': '99dnfneeekdegnrJJSN3JdenrsdnJ',
};

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return (await r.json()) as T;
}

export type Story = {
  id: string;
  headline: string;
  subtitle: string;
  youtubeId?: string;
  thumbUrl?: string;
  voicemailUrl?: string;
};

export const getStories = () => j<Story[]>('/stories');

export const postConfession = (text: string) =>
  j<{ ok: boolean }>('/confessions', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

export const postSpotlight = (payload: { name: string; link: string; notes?: string }) =>
  j<{ ok: boolean }>('/spotlights', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
