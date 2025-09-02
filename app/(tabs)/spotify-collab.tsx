// app/(tabs)/spotify-collab.tsx
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Background from '../../components/Background';
import LogoHeader from '../../components/LogoHeader';

const SPOTIFY_USER_ID = '31qsebtdwdt6g4tzkanmz3zjyhpe';
const SPOTIFY_PROFILE_WEB = `https://open.spotify.com/user/${SPOTIFY_USER_ID}`;

type P = { label: string; web: string; asset: any };

const PLAYLISTS: P[] = [
  {
    label: 'Soapbox Country',
    web: 'https://open.spotify.com/playlist/2DOlwKty67F5cENBO1OI6l?si=iskOssm7SaSSH2ueOrCWmw&pi=El87UXrpQYS4H&pt=a03e954ae29da435c114e9234dc328f4',
    asset: require('../../assets/country.png'),
  },
  {
    label: 'Soapbox Rock / Alt',
    web: 'https://open.spotify.com/playlist/4cY0d6uq88Ur9KfsI5HXJr?si=-i6wIOO0QPamNibkgCgCgQ&pi=apXN5HhYRhyEF&pt=3fc536db7c376bfbd0478a9e279dc293',
    asset: require('../../assets/rock.png'),
  },
  {
    label: 'Soapbox Rap / Hip Hop',
    web: 'https://open.spotify.com/playlist/3DeaxVUt2BW3Xq2xHR9eE7?si=XCOej2pfTlqiQB2E6lC11Q&pt=118dec7cab65ff82c5c48445ae527dcd&pi=hkFj-WKSRCab-',
    asset: require('../../assets/rap.png'),
  },
  {
    label: 'Soapbox Metal',
    web: 'https://open.spotify.com/playlist/12AaEJDNtwcfVqfV1IQ4KV?si=0Jo4YFeWQyGiIOPSx0ryZg&pi=VIR5MyITRBOP3&pt=f1c4b2d38657c5b5c54ccd63164979da',
    asset: require('../../assets/metal.png'),
  },
  {
    label: 'Soapbox Digital / Dub / EDM',
    web: 'https://open.spotify.com/playlist/6AYQoVZsG9NZH1PJr1kV0D?si=25nLwoiHTZysoG0hqjFwKQ&pt=f02150de84309c1308c51be23cae5e6b&pi=poo63OACRW6or',
    asset: require('../../assets/digital.png'),
  },
  {
    label: 'Soapbox AI / Troll',
    web: 'https://open.spotify.com/playlist/7r1WA8wh58hmZApHaSVSXx?si=Q8l2iWUkRKKCXeIOFN5pRQ&pt=cdaac08e797893ea9675d6352f8c137c&pi=Z87uRmBrSw617',
    asset: require('../../assets/troll.png'),
  },
];

async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch (e: any) {
    Alert.alert('Could not open link', e?.message ?? 'Unknown error');
  }
}

async function shareLink(url: string, label?: string) {
  try {
    await Share.share({ message: url, title: label || 'Link' });
  } catch {}
}

export default function SpotifyCollab() {
  return (
    <Background useImage>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 0 }]}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
          <LogoHeader />
        </View>

        {/* Spotify profile tile */}
        <ImageTile
          source={require('../../assets/main.png')}
          onPress={() => openUrl(SPOTIFY_PROFILE_WEB)}
          onLongPress={() => shareLink(SPOTIFY_PROFILE_WEB, 'Profile')}
          style={{ marginBottom: 12 }}
        />

        {/* Title */}
        <Text style={styles.title}>Community Playlists</Text>

        {/* Rules / instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Collaborate</Text>
          <Text style={styles.cardText}>
            1) Tap any <Text style={styles.bold}>Playlist</Text> below once to accept collaboration.{'\n'}
            2) It will then appear in <Text style={styles.bold}>Your Library</Text> — no need to re-accept.{'\n'}
            3) Add songs anytime — these are <Text style={styles.bold}>community-curated</Text> lists.{'\n'}
            4) That&apos;s it! Now <Text style={styles.bold}>jam out!</Text>{'\n'}
            <Text style={styles.bold}>***BULLSHIT ADDS = BAN</Text> Don&apos;t be stupid. Love you.
          </Text>
        </View>

        {/* Playlist image buttons */}
        <View style={{ gap: 12 }}>
          {PLAYLISTS.map((p, i) => (
            <ImageTile
              key={`${p.label}-${i}`}
              source={p.asset}
              onPress={() => openUrl(p.web)}
              onLongPress={() => shareLink(p.web, p.label)}
            />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </Background>
  );
}

/** Wide image button (1400x200 → 7:1) */
function ImageTile({
  source,
  onPress,
  onLongPress,
  style,
}: {
  source: any;
  onPress: () => void;
  onLongPress?: () => void;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={220}
      style={({ pressed }) => [styles.tile, style, pressed && styles.pressed]}
    >
      <Image source={source} style={styles.img} resizeMode="cover" />
    </Pressable>
  );
}

// Tunables
const BOX_ALPHA = 0.75;  // rules card opacity
const TILE_RATIO = 7 / 1; // 1400x200 assets

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

  card: {
    backgroundColor: `rgba(15,20,27,${BOX_ALPHA})`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: '#fff', fontWeight: '900', marginBottom: 6, fontSize: 16 },
  cardText: { color: '#fff', fontSize: 13, lineHeight: 18 },
  bold: { fontWeight: '900', color: '#fa7d7d' },

  tile: {
    width: '100%',
    aspectRatio: TILE_RATIO,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  pressed: { opacity: 0.92 },
});
