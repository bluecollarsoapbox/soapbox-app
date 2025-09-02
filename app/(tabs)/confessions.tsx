// app/(tabs)/confessions.tsx
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LogoHeader from '../../components/LogoHeader';


// ===== config (shared) =====
function getBaseUrl() {
  try {
    if (Platform.OS === 'web') {
      // Use the same host the page was served from, but port 3030
      return (typeof window !== 'undefined'
        ? window.location.origin.replace(/:\d+$/, ':3030')
        : 'http://localhost:3030');
    }
    // Try to read the LAN host from Expo dev info
    const hostFromExpo =
      (Constants.expoConfig?.hostUri ??
        (Constants as any).manifest?.debuggerHost ??
        '')
        .split(':')[0];

    if (hostFromExpo) return `http://${hostFromExpo}:3030`;
  } catch {}
  // Fallback: last known IP from your bot logs
  return 'http://192.168.1.176:3030';
}

export const BASE_URL = getBaseUrl();
const API_KEY = '99dnfneeekdegnrJJSN3JdenrsdnJ'; // matches bot .env
const AUTH = { 'x-soapbox-key': API_KEY };

// ===== types =====
type Confession = {
  id: string;
  text: string;
  ts: number;       // timestamp
  deviceId?: string;
};

export default function Confessions() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<Confession[]>([]);
  const [text, setText] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${BASE_URL}/confessions`, { headers: AUTH });
      if (!r.ok) {
        const t = await r.text().catch(() => '');
        throw new Error(`HTTP ${r.status} ${t}`);
      }
      const data = (await r.json()) as Confession[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.warn('Confessions load error:', e?.message || e);
      Alert.alert('Error', 'Could not load confessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    const body = text.trim();
    if (!body) return Alert.alert('Empty', 'Type your confession first.');

    try {
      setSubmitting(true);
      const r = await fetch(`${BASE_URL}/confessions`, {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: body,
          deviceId: 'expo-app', // tag; server rate-limits per deviceId
        }),
      });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(j?.error || `HTTP ${r.status}`);
      }

      setText('');
      Alert.alert('Sent', 'Your confession was posted.');
      load(); // refresh list
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Confession }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.text}</Text>
      <Text style={styles.cardMeta}>{new Date(item.ts).toLocaleString()}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0d10' }} contentContainerStyle={{ padding: 16 }}>
      {/* Logo at the very top */}
      <LogoHeader />

      <Text style={styles.title}>Anonymous Confessions</Text>
      <Text style={styles.caption}>Post something real. We moderate for spam and extreme content.</Text>

      {/* Compose box */}
      <View style={styles.box}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type your confession…"
          placeholderTextColor="#6f8296"
          multiline
          style={styles.input}
          maxLength={1000}
        />
        <View style={{ height: 10 }} />
        <Pressable
          onPress={submit}
          disabled={submitting}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.btnText}>{submitting ? 'Sending…' : 'Send Confession'}</Text>
        </Pressable>
      </View>

      {/* Feed */}
      <Text style={styles.sectionTitle}>Recent Confessions</Text>
      {loading ? (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : items.length === 0 ? (
        <Text style={{ color: '#9fb0c0' }}>No confessions yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          scrollEnabled={false} // let ScrollView handle scrolling
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#e8f0ff', fontSize: 20, fontWeight: '800' },
  caption: { color: '#9fb0c0', marginTop: 6, marginBottom: 12 },

  box: {
    backgroundColor: '#0f141b',
    borderColor: '#1e2630',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  input: {
    color: '#e8f0ff',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '800' },

  sectionTitle: { color: '#cfe0ff', fontWeight: '800', fontSize: 16, marginBottom: 8 },

  card: {
    backgroundColor: '#11161b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2935',
    padding: 12,
    marginBottom: 10,
  },
  cardText: { color: '#e8f0ff' },
  cardMeta: { color: '#6f8296', fontSize: 12, marginTop: 8 },
});
