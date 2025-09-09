// app/(tabs)/confessions.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking
} from 'react-native';
import LogoHeader from '../../components/LogoHeader';
export const SHOW_WITNESS_FEED = false;
export const SHOW_CONFESSION_FEED = false;


// ✅ shared API config (points at Render)
import { API_URL, AUTH_HEADER } from '../lib/api';

const BASE_URL = API_URL;
const AUTH = AUTH_HEADER;

type Confession = {
  id: string;
  text: string;
  ts: number;
  deviceId?: string;
};

export default function Confessions() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<Confession[]>([]);
  const [text, setText] = useState('');

  // --- FEED DISABLED: keep loader function but don't call it ---
  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${BASE_URL}/confessions`, { headers: AUTH as any });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as Confession[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.warn('Confessions load error:', e?.message || e);
      Alert.alert('Error', 'Could not load confessions.');
    } finally {
      setLoading(false);
    }
  };

  // --- FEED DISABLED: no initial load ---
  useEffect(() => {
    setLoading(false);
  }, []);

  const submit = async () => {
    const body = text.trim();
    if (!body) return Alert.alert('Empty', 'Type your confession first.');

    try {
      setSubmitting(true);
      const r = await fetch(`${BASE_URL}/confessions`, {
        method: 'POST',
        headers: { ...(AUTH as any), 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: body, deviceId: 'expo-app' }),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);

      setText('');
      Alert.alert('Sent', 'Your confession was posted.');
      // --- FEED DISABLED: don't reload a local feed ---
      // load();
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
      <LogoHeader />
      <Text style={styles.title}>Anonymous Confessions</Text>
      <Text style={styles.caption}>Post something real. We trust no lies will be told here. Right?</Text>

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
        <Pressable onPress={submit} disabled={submitting} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}>
          <Text style={styles.btnText}>{submitting ? 'Sending…' : 'Send Confession'}</Text>
        </Pressable>
      </View>

      {/* --- FEED DISABLED: replace list with Discord notice --- */}
      <Text style={styles.sectionTitle}>Where to read confessions</Text>
      <View style={styles.noticeCard}>
        <Text style={{ color: '#cfe0ff', marginBottom: 8, fontWeight: '700' }}>
          Confessions are posted ANNONYMOUSLY by our Soapbox News bot in Discord. No data is collected, Nobody knows who tf you are. Check out the channel to read them!
        </Text>
        <Pressable onPress={() => Linking.openURL('https://discord.gg/SoapBox')} style={styles.btn}>
          <Text style={styles.btnText}>Open Discord</Text>
        </Pressable>
      </View>

      {/* Old feed UI left here for reference, but disabled:
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
          scrollEnabled={false}
        />
      )}
      */}
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
  input: { color: '#e8f0ff', minHeight: 90, textAlignVertical: 'top' },
  btn: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '800' },
  sectionTitle: { color: '#cfe0ff', fontWeight: '800', fontSize: 16, marginBottom: 8 },
  noticeCard: {
    backgroundColor: '#11161b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2935',
    padding: 12,
    marginBottom: 10,
  },
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
