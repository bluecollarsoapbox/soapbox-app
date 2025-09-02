// app/(tabs)/index.tsx
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import LogoHeader from '../../components/LogoHeader';


const API_KEY = '99dnfneeekdegnrJJSN3JdenrsdnJ';
const AUTH = { 'x-soapbox-key': API_KEY };

const BASE_URL =
  Platform.OS === 'web'
    ? (typeof window !== 'undefined'
        ? window.location.origin.replace(/:\d+$/, ':3030')
        : 'http://localhost:3030')
    : 'http://192.168.1.176:3030'; // ← your PC LAN IP if needed

const FALLBACK_IMAGE = require('../../assets/soapbox-flier.png');

type Story = {
  id: 'Story1' | 'Story2' | 'Story3' | 'Story4' | 'Story5';
  title: string;
  subtitle: string;
  thumbUrl?: string | null;
};

export default function Stories() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const router = useRouter();


  const loadStories = async () => {
    try {
      const r = await fetch(`${BASE_URL}/stories`, { headers: AUTH });
      const data = await r.json();

      const ids: Story['id'][] = ['Story1', 'Story2', 'Story3', 'Story4', 'Story5'];
      const byId = new Map<string, Story>();
      (Array.isArray(data) ? data : []).forEach((s: any) => {
        if (s?.id && ids.includes(s.id)) {
          byId.set(s.id, {
            id: s.id,
            title: s.title ?? s.id,
            subtitle: s.subtitle ?? '',
            thumbUrl: s.thumbUrl ? `${BASE_URL}${s.thumbUrl}` : null,
          });
        }
      });

      const filled = ids.map(
        id => byId.get(id) || ({ id, title: id.toUpperCase(), subtitle: '', thumbUrl: null } as Story)
      );
      setStories(filled);
    } catch {
      setStories(
        ['Story1', 'Story2', 'Story3', 'Story4', 'Story5'].map(
          id => ({ id: id as Story['id'], title: id, subtitle: '', thumbUrl: null } as Story)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
    const t = setInterval(loadStories, 30000); // refresh every 30s so metadata changes show up
    return () => clearInterval(t);
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0b0d10' }}
      contentContainerStyle={{ padding: 16 }}
    >
      <LogoHeader />

      <Text style={styles.title}>This Week’s Top 5 Stories</Text>
      <Text style={styles.subtitleTop}>Tap a card to open the story</Text>

      {loading && stories.length === 0 ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 24 }} />
      ) : (
        stories.map(s => (
          <Pressable
            key={s.id}
            onPress={() => router.push({ pathname: '/story/[id]', params: { id: s.id, title: s.title } })}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <StoryCard story={s} />
          </Pressable>
        ))
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function StoryCard({ story }: { story: Story }) {
  const { title, subtitle, thumbUrl } = story;
  return (
    <View style={styles.card}>
      {thumbUrl ? (
        <Image source={{ uri: thumbUrl }} style={styles.thumb} contentFit="cover" transition={200} />
      ) : (
        <Image source={FALLBACK_IMAGE} style={styles.thumb} contentFit="cover" transition={200} />
      )}
      <Text style={styles.cardTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: '#e8f0ff', fontSize: 20, fontWeight: '800' },
  subtitleTop: { color: '#9fb0c0', marginTop: 6, marginBottom: 12 },
  card: {
    backgroundColor: '#0f141b',
    borderColor: '#1e2630',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  thumb: { width: '100%', height: 140, borderRadius: 10, marginBottom: 10, backgroundColor: '#0b0d10' },
  cardTitle: { color: '#e6edf3', fontWeight: '800', marginBottom: 4, fontSize: 16 },
  cardSubtitle: { color: '#9fb0c0' },

});
