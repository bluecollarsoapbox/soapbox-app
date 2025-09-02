// app/(tabs)/story/[id].tsx
import { useFocusEffect } from '@react-navigation/native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import LogoHeader from '../../../components/LogoHeader';

const API_KEY = '99dnfneeekdegnrJJSN3JdenrsdnJ';
const AUTH = { 'x-soapbox-key': API_KEY };

const BASE_URL =
  Platform.OS === 'web'
    ? (typeof window !== 'undefined'
        ? window.location.origin.replace(/:\d+$/, ':3030')
        : 'http://localhost:3030')
    : 'http://192.168.1.176:3030';

type StoryId = 'Story1' | 'Story2' | 'Story3' | 'Story4' | 'Story5';

export default function StoryDetail() {
  const { id, title } = useLocalSearchParams<{ id: StoryId; title?: string }>();
  const router = useRouter();

  const [vmLoading, setVmLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<{ positionMillis?: number; durationMillis?: number }>({});
  const [rulesOpen, setRulesOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const vmUri = useMemo(() => `${BASE_URL}/voicemail/${id}`, [id]);
  const storyTitle = useMemo(() => (title ? String(title) : String(id)), [title, id]);

  

  const onStatus = useCallback((s: AVPlaybackStatus) => {
    if (!('isLoaded' in s) || !s.isLoaded) return;
    setStatus({ positionMillis: s.positionMillis, durationMillis: s.durationMillis });
    setIsPlaying(!!s.isPlaying);
  }, []);

  // Load prompts + thumbnail from metadata.json
  useEffect(() => {
    let alive = true;
    (async () => {
      const metaUrl = `${BASE_URL}/static/${id}/metadata.json`;
      try {
        const r = await fetch(metaUrl); // static should be public; no auth header
        if (!r.ok) {
          console.warn(`[story/${String(id)}] metadata fetch failed ${r.status} at ${metaUrl}`);
          return;
        }
        const j = await r.json();
        if (!alive || !j) return;

        const arr = Array.isArray(j.prompts) ? j.prompts.slice(0, 8).map((s: any) => String(s)) : [];
        setIdeas(arr);

        if (j.youtubeThumbnail) {
          const raw = String(j.youtubeThumbnail);
          const isAbs = /^https?:\/\//i.test(raw);
          setThumbnail(isAbs ? raw : `${BASE_URL}/static/${id}/${raw}`);
        } else {
          setThumbnail(null);
        }
      } catch (e) {
        console.warn(`[story/${String(id)}] metadata fetch/parse error at ${metaUrl}`, e);
        setIdeas([]);
        setThumbnail(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const createSound = useCallback(
    async (autoPlay: boolean) => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
      const { sound } = await Audio.Sound.createAsync(
        { uri: vmUri },
        { shouldPlay: autoPlay, progressUpdateIntervalMillis: 250 },
        onStatus
      );
      soundRef.current = sound;
      setVmLoading(false);
    },
    [vmUri, onStatus]
  );

  const hardStopAndUnload = async () => {
    try {
      const s = soundRef.current;
      if (s) {
        await s.stopAsync().catch(() => {});
        await s.setPositionAsync(0).catch(() => {});
        await s.setStatusAsync({ shouldPlay: false, positionMillis: 0 }).catch(() => {});
        await s.unloadAsync().catch(() => {});
      }
    } finally {
      soundRef.current = null;
      setIsPlaying(false);
      setStatus(prev => ({ ...prev, positionMillis: 0 }));
    }
  };

  // Always autoplay when screen focuses; cleanup on blur
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        await hardStopAndUnload();
        setVmLoading(true);
        try {
          await createSound(true); // autoplay on every entry
        } catch {
          if (!cancelled) setVmLoading(false);
        }
      })();

      return () => {
        cancelled = true;
        void hardStopAndUnload();
      };
    }, [createSound])
  );

  const playPause = async () => {
    const s = soundRef.current;
    if (!s) return;
    try {
      const st = (await s.getStatusAsync()) as any;
      if (!st.isLoaded) return;
      if (st.isPlaying) {
        await s.pauseAsync();
        setIsPlaying(false);
      } else {
        await s.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  };

  const stopAudio = async () => {
    try {
      await hardStopAndUnload();
      setVmLoading(true);
      await createSound(false); // reload, paused at 0
      setIsPlaying(false);
      setStatus(prev => ({ ...prev, positionMillis: 0 }));
    } catch {
      setVmLoading(false);
    }
  };

  const msFmt = (m?: number) => {
    if (!m && m !== 0) return '--:--';
    const sec = Math.floor(m / 1000);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // ===== Witness upload flow =====
  const openRules = () => setRulesOpen(true);

  // Permissions (expo-image-picker: 'granted' or 'denied')
  const ensurePickerPermission = async () => {
    if (Platform.OS === 'web') return true; // web doesn't need this
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return req.status === 'granted';
    }
    return true;
  };

  // Videos only — stable across SDKs (fine to keep even if warned as deprecated)
  const videoOnlyMediaTypes = ImagePicker.MediaTypeOptions.Videos as const;

  // Open picker (returns chosen asset or null)
  const launchPicker = async () => {
    const ok = await ensurePickerPermission();
    if (!ok) {
      Alert.alert('Permission needed', 'Please allow photo/video access to upload.');
      return null;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: videoOnlyMediaTypes,
      allowsEditing: false,
      quality: 1,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
    });

    if ((res as any).canceled) return null;
    const asset = (res as any).assets?.[0];
    if (!asset) {
      Alert.alert('No file', 'Could not read the selected video.');
      return null;
    }
    return asset;
  };

  // IMPORTANT: open picker directly from the button's onPress (same user gesture)
  const onAgreeAndPick = async () => {
    if (picking) return;
    setPicking(true); // show spinner on the button

    try {
      const asset = await launchPicker(); // open picker *before* closing modal
      setRulesOpen(false); // close after picker returns

      if (!asset) return;

      Alert.alert(
        'Submit to Witness Feed?',
        'Are you sure you want to submit this video to the witness feed for this story?',
        [
          { text: 'Back', style: 'cancel' },
          { text: 'Upload', onPress: () => actuallyUpload(asset) },
        ]
      );
    } catch (e: any) {
      Alert.alert('Picker error', String(e?.message || e));
    } finally {
      setPicking(false);
    }
  };

  const actuallyUpload = async (asset: any) => {
    try {
      setUploading(true);

      const uri = asset.uri;
      const nameGuess = (uri.split('/').pop() || 'witness.mp4').replace(/[^\w.\-]/g, '_');
      const typeGuess =
        asset.mimeType || (nameGuess.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4');

      const form = new FormData();
      form.append('storyId', String(id));
      form.append('note', '');
      form.append('file', { uri, name: nameGuess, type: typeGuess } as any);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      const r = await fetch(`${BASE_URL}/witness`, {
        method: 'POST',
        headers: AUTH,
        body: form,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!r.ok) {
        const j = await r.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${r.status}`);
      }
      Alert.alert('Uploaded', 'Your video was posted to the witness feed.');
    } catch (e: any) {
      Alert.alert('Upload failed', String(e?.message || e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0b0d10' }}
      contentContainerStyle={{ padding: 16 }}
     
    >
      <LogoHeader />

      {/* YouTube thumbnail centered under the logo */}
      {thumbnail ? (
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumb}
            resizeMode="cover"
            accessible
            accessibilityLabel="Story thumbnail"
          />
        </View>
      ) : null}

      <Text style={styles.title}>{storyTitle}</Text>

      {/* Audio controls */}
      <View style={styles.audioBar}>
        <Text style={styles.audioMeta}>
          {msFmt(status.positionMillis)} / {msFmt(status.durationMillis)}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={playPause} style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>
              {isPlaying ? 'Pause' : vmLoading ? 'Loading…' : 'Play'}
            </Text>
          </Pressable>
          <Pressable onPress={stopAudio} style={styles.btnGhost}>
            <Text style={styles.btnGhostText}>Stop</Text>
          </Pressable>
        </View>
      </View>

      {/* Suggested characters / ideas (BLUE) */}
      <Pressable onPress={() => setIdeasOpen(true)} style={styles.btnWideBlue}>
        <Text style={styles.btnWideBlueText}>Suggested Witness Characters</Text>
      </Pressable>

      {/* Submit button (blue) */}
      <Pressable onPress={openRules} style={styles.btnWideBlue} disabled={picking}>
        <Text style={styles.btnWideBlueText}>{picking ? 'Opening…' : 'Submit Witness Video'}</Text>
      </Pressable>

      {/* Back button (blue) BELOW submit */}
      <Pressable onPress={() => router.back()} style={styles.btnWideBlue}>
        <Text style={styles.btnWideBlueText}>Back</Text>
      </Pressable>

      {/* Rules modal */}
<Modal visible={rulesOpen} transparent animationType="fade" onRequestClose={() => setRulesOpen(false)}>
  <View style={styles.modalWrap}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Before You Upload</Text>
      <Text style={styles.modalText}>
        • Film landscape (sideways){'\n'}
        • Outside light is best{'\n'}
        • Use a tripod{'\n'}
        • Speak up — audio matters{'\n'}
        • 1 minute max{'\n'}
        • One upload per story per device
      </Text>

      {/* Disclaimer on its own line, bold */}
      <Text style={[styles.modalText, { fontWeight: '800', marginTop: 10 }]}>
By clicking "I Agree," below, you grant Marshall Patrick and Blue Collar Soapbox permission to use the uploaded video as content on any social media account owned or operated by Marshall Patrick and/or Blue Collar Soapbox      </Text>

      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
        <Pressable onPress={() => setRulesOpen(false)} style={styles.btnGhost} disabled={picking}>
          <Text style={styles.btnGhostText}>Back</Text>
        </Pressable>
        <Pressable onPress={onAgreeAndPick} style={styles.btnPrimary} disabled={picking}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {picking ? <ActivityIndicator size="small" /> : null}
            <Text style={styles.btnPrimaryText}>{picking ? 'Opening…' : 'I Agree'}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>



      {/* Ideas modal */}
      <Modal visible={ideasOpen} transparent animationType="fade" onRequestClose={() => setIdeasOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Character Ideas</Text>
            {ideas.length ? (
              <View style={{ gap: 8 }}>
                {ideas.map((s, i) => (
                  <Text key={i} style={styles.modalText}>• {s}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.modalText}>No prompts yet. Be creative!</Text>
            )}
            <View style={{ height: 12 }} />
            <Pressable onPress={() => setIdeasOpen(false)} style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Uploading overlay spinner */}
      <Modal visible={uploading} transparent animationType="fade">
        <View style={styles.overlayWrap}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" />
            <Text style={styles.overlayText}>Uploading…</Text>
          </View>
        </View>
      </Modal>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#e8f0ff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  thumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2630',
    backgroundColor: '#0f141b',
  },
  audioBar: {
    backgroundColor: '#12161b',
    borderWidth: 1, borderColor: '#1f2731',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  audioMeta: { color: '#9fb0c0' },
  btnPrimary: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: {
    backgroundColor: '#18202a',
    borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: '#233041',
  },
  btnGhostText: { color: '#cfe0ff', fontWeight: '700' },
  btnWide: {
    backgroundColor: '#0f141b',
    borderColor: '#1e2630',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnWideText: { color: '#e6edf3', fontWeight: '700' },
  btnWideBlue: {
    backgroundColor: '#1f6feb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnWideBlueText: { color: '#fff', fontWeight: '800' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 16 },
  modalCard: { backgroundColor: '#0b0d10', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1e2630' },
  modalTitle: { color: '#e8f0ff', fontWeight: '800', marginBottom: 8, fontSize: 18 },
  modalText: { color: '#9fb0c0' },
  overlayWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#0b0d10', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1e2630' },
  overlayText: { marginTop: 10, color: '#e8f0ff', fontWeight: '700' },
});
