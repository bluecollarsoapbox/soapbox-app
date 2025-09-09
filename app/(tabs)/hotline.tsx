// app/(tabs)/hotline.tsx
import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Background from '../../components/Background';
import LogoHeader from '../../components/LogoHeader';

// Make sure this file exists at assets/soapbox-flier.png
const FLIER = require('../../assets/soapbox-flier.png');

export default function Hotline() {
  const { width: screenW } = useWindowDimensions();

  // Keep a 4:3 box and clamp width so it never gets massive
  const maxBoxW = Math.min(screenW * 0.92, 460);
  const flierW = maxBoxW;
  const flierH = Math.round(maxBoxW * (3 / 4));

  const tel = useMemo(
    () => (Platform.OS === 'ios' ? 'telprompt:13237433744' : 'tel:13237433744'),
    []
  );

  const onCall = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const supported = await Linking.canOpenURL(tel);
    if (supported) Linking.openURL(tel);
  };

  return (
    <Background useImage>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 0 }]}
        contentInsetAdjustmentBehavior="never"           // prevent iOS from pushing content down
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentInset={{ top: 0, left: 0, right: 0, bottom: 0 }}
        scrollIndicatorInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Top logo — keep it at the very top, small margin to breathe */}
        <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
          <LogoHeader />
        </View>

        {/* Flier — centered, no crop (contain) */}
        <Image
          source={FLIER}
          style={[styles.flier, { width: flierW, height: flierH }]}
          resizeMode="contain"
          accessible
          accessibilityLabel="Soapbox Hotline flier"
        />

        <Pressable onPress={onCall} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}>
          <Text style={styles.buttonText}>📞 Call the Hotline</Text>
        </Pressable>

        <View style={[styles.card, { width: Math.min(screenW * 0.92, 640) }]}>
          <Text style={styles.cardText}>
            This is the heartbeat of the Soapbox! All the news stories come from THESE voicemails! Leave your rant, story, or confession. We pick the best voicemails every week and turn them into Soapbox News Stories. Totally Anonymous, Totally Real.</Text>
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12, alignItems: 'center' },

  title: {
    color: '#e8f0ff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  caption: { color: '#9fb0c0', marginBottom: 16, textAlign: 'center', alignSelf: 'stretch' },
  bold: { fontWeight: '700', color: '#ffffff' },

  // Flier box (size injected via useWindowDimensions)
  flier: {
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#0b0d10',
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '92%',
    maxWidth: 460,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 20 },

  card: {
    backgroundColor: '#14181d',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#313942ff',
    alignSelf: 'center',
  },
  cardText: { color: '#e8f0ff', textAlign: 'center' },
});
