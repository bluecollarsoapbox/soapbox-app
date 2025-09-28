// app/(tabs)/spotlight/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Shared API config – only need the base URL
import { API_URL } from '../../lib/api';

type SpotItem = {
  id: string;
  title: string;
  thumb?: string | null; // may be relative (e.g. /static/Spotlights/..)
  url: string;
  date?: string;
};

export default function SpotlightHome() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<SpotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/spotlights`);
      const j = await r.json();
      if (Array.isArray(j)) setItems(j);
      else setItems([]);
    } catch (e: any) {
      setErr('Could not load spotlights.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(it => it.title?.toLowerCase().includes(s));
  }, [q, items]);

  const open = (url: string) => Linking.openURL(url);

  const renderThumbUri = (thumb?: string | null) => {
    if (!thumb) return undefined;
    if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb;
    return `${API_URL}${thumb}`;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0b0d10' }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9fb0c0" />}
    >
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../../../assets/spotlight-banner.png')}
          style={styles.banner}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Soapbox Spotlight</Text>
        <Text style={styles.body}>
          Real wins, real struggles, real blue-collar stories. Interviews, documentaries, and podcasts start here.
        </Text>
        <Text style={[styles.body, { marginTop: 8, color: '#b8c7d6' }]}>
          Your submission goes straight to Blue Collar Soapbox (not public). Nothing moves forward without your say-so.
        </Text>

        <Pressable onPress={() => router.push('/spotlight/form')} style={styles.cta}>
          <Ionicons name="mic-outline" size={18} color="#fff" />
          <Text style={styles.ctaText}>Tell Us Your Story</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Spotlights</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search spotlights…"
          placeholderTextColor="#6b7a89"
          style={styles.input}
        />

        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ color: '#8fa2b6', marginTop: 8 }}>Loading…</Text>
          </View>
        ) : err ? (
          <Text style={{ color: '#ffb4b4' }}>{err}</Text>
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#8fa2b6' }}>No results.</Text>
        ) : (
          filtered.map(item => {
            const thumbUri = renderThumbUri(item.thumb);
            return (
              <Pressable key={item.id} onPress={() => open(item.url)} style={styles.bigTile}>
                {thumbUri ? (
                  <Image source={{ uri: thumbUri }} style={styles.bigThumb} resizeMode="cover" />
                ) : null}
                <Text numberOfLines={2} style={styles.bigTitle}>{item.title}</Text>
              </Pressable>
            );
          })
        )}
      </View>

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const W = Dimensions.get('window').width;

const styles = StyleSheet.create({
  banner: {
    width: 290,
    height: undefined,
    aspectRatio: 16 / 9,
    maxWidth: '90%',
    transform: [{ scale: 1.78 }],
  },
  card: {
    backgroundColor: '#0f141b',
    borderWidth: 1,
    borderColor: '#1e2630',
    borderRadius: 12,
    padding: 12,
  },
  title: { color: '#e8f0ff', fontWeight: '800', fontSize: 20, marginBottom: 6 },
  body: { color: '#9fb0c0' },
  section: { color: '#cfe0ff', fontWeight: '800', marginBottom: 8 },
  input: {
    backgroundColor: '#0b0d10',
    borderWidth: 1,
    borderColor: '#1e2630',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: '#e6edf3',
    marginBottom: 10,
  },
  cta: {
    marginTop: 12,
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
  bigTile: { marginBottom: 12 },
  bigThumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e2630',
    backgroundColor: '#0b0d10',
    marginBottom: 8,
  },
  bigTitle: { color: '#d8e2ee', fontWeight: '800', fontSize: 16 },
});
