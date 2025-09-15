// app/(tabs)/links.tsx
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Background from '../../components/Background';
import LogoHeader from '../../components/LogoHeader';

// point this at your server
const API_URL = 'https://soapbox-server.onrender.com';

type LinkItem = { title: string; url: string; imageKey?: string; imageUrl?: string };

// fallback = your current hard-coded links (uses bundled images)
const FALLBACK: LinkItem[] = [
  { title: 'YouTube',   url: 'https://www.youtube.com/@bluecollarsoapbox' },
  { title: 'Discord',   url: 'https://discord.gg/SoapBox' },
  { title: 'Twitch',    url: 'https://www.twitch.tv/themarshallpatrick' },
  { title: 'Spotify',   url: 'https://open.spotify.com/user/31qsebtdwdt6g4tzkanmz3zjyhpe' },
  { title: 'Facebook',  url: 'https://www.facebook.com/bluecollarsoapbox' },
  { title: 'Instagram', url: 'https://www.instagram.com/bluecollarsoapbox/' },
  { title: 'TikTok',    url: 'https://www.tiktok.com/@bluecollarsoapbox' },
  { title: 'Website',   url: 'https://www.bluecollarsoapbox.com' },
  { title: 'Store',     url: 'https://www.marshallpatrick.com/collections/blue-collar-soapbox' },
];

export default function Links() {
  const [items, setItems] = useState<LinkItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/links`, { headers: { 'Cache-Control': 'no-store' } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as { items?: LinkItem[] };
        const list = (data?.items || []).map((it) => ({
          title: String(it.title || '').trim(),
          url: String(it.url || '').trim(),
          imageUrl: it.imageKey
            ? `${API_URL}/static-s3/${encodeURIComponent(it.imageKey)}`
            : (it as any).imageUrl || '',
        })).filter(x => x.title && x.url);
        if (!stop) setItems(list.length ? list : FALLBACK);
      } catch (e: any) {
        if (!stop) {
          setErr(e?.message || 'Failed to load links');
          setItems(FALLBACK);
        }
      }
    })();
    return () => { stop = true; };
  }, []);

  return (
    <Background useImage>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 0 }]}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentInset={{ top: 0, left: 0, right: 0, bottom: 0 }}
        scrollIndicatorInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
          <LogoHeader />
        </View>

        <Text style={styles.title}>Links</Text>

        {!!err && (
          <Text style={{ color: '#ffa7a7', textAlign: 'center', marginBottom: 8 }}>
            {err} (showing saved list)
          </Text>
        )}

        {!items && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator />
          </View>
        )}

        {!!items && (
          <View style={styles.stack}>
            {items.map((it, idx) => (
              <Tile
                key={`${it.title}-${idx}`}
                title={it.title}
                imageUrl={it.imageUrl}
                onPress={() => Linking.openURL(it.url)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </Background>
  );
}

function Tile({ title, imageUrl, onPress }: { title: string; imageUrl?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.img} resizeMode="cover" />
      ) : (
        // if imageUrl missing, just show a text tile
        <View style={[styles.img, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }]}>
          <Text style={{ color: '#e6edf3', fontSize: 18, fontWeight: '700' }}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, alignItems: 'stretch' },

  title: {
    color: '#e6edf3',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },

  stack: { gap: 12 },

  tile: {
    width: '100%',
    aspectRatio: 7 / 2, // matches your 1400x400 art
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  pressed: { opacity: 0.92 },
});
