// app/(tabs)/links.tsx
import { router } from 'expo-router';
import {
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

// real Spotify user id for your profile URL
const SPOTIFY_USER_ID = '31qsebtdwdt6g4tzkanmz3zjyhpe';
const SPOTIFY_PROFILE_WEB = `https://open.spotify.com/user/${SPOTIFY_USER_ID}`;

function showSpotifyPopup() {
  Alert.alert(
    'Spotify',
    'Community playlists + collab invites live here.',
    [
      { text: 'Community Playlists', onPress: () => router.push('/spotify-collab') },
      // universal link (acts like texting a link; iOS/Android hand off to the app if installed)
      { text: 'Open Spotify Profile', onPress: () => Linking.openURL(SPOTIFY_PROFILE_WEB) },
      { text: 'Cancel', style: 'cancel' },
    ],
    { cancelable: true }
  );
}

export default function Links() {
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
        {/* Top logo */}
        <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
          <LogoHeader />
        </View>

        <Text style={styles.title}>Links</Text>

        <View style={styles.stack}>
          {/* YouTube */}
          <Tile
            source={require('../../assets/youtubebutton.png')}
            onPress={() => Linking.openURL('https://www.youtube.com/@bluecollarsoapbox')}
          />
          {/* Discord */}
          <Tile
            source={require('../../assets/discordbutton.png')}
            onPress={() => Linking.openURL('https://discord.gg/SoapBox')}
          />
          {/* Twitch */}
          <Tile
            source={require('../../assets/twitchbutton.png')}
            onPress={() => Linking.openURL('https://www.twitch.tv/themarshallpatrick')}
          />
          {/* Spotify (popup) */}
          <Tile
            source={require('../../assets/spotifybutton.png')}
            onPress={showSpotifyPopup}
          />
          {/* Facebook */}
          <Tile
            source={require('../../assets/facebookbutton.png')}
            onPress={() => Linking.openURL('https://www.facebook.com/bluecollarsoapbox')}
          />
          {/* Instagram */}
          <Tile
            source={require('../../assets/instagrambutton.png')}
            onPress={() => Linking.openURL('https://www.instagram.com/bluecollarsoapbox/')}
          />
          {/* TikTok */}
          <Tile
            source={require('../../assets/tiktokbutton.png')}
            onPress={() => Linking.openURL('https://www.tiktok.com/@bluecollarsoapbox')}
          />
          {/* Website */}
          <Tile
            source={require('../../assets/websitebutton.png')}
            onPress={() => Linking.openURL('https://www.bluecollarsoapbox.com')}
          />
          {/* Store */}
          <Tile
            source={require('../../assets/merchbutton.png')}
            onPress={() =>
              Linking.openURL('https://www.marshallpatrick.com/collections/blue-collar-soapbox')
            }
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </Background>
  );
}

function Tile({ source, onPress }: { source: any; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <Image source={source} style={styles.img} resizeMode="cover" />
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

  // Full-bleed images; no bg/border/shadow
  tile: {
    width: '100%',
    aspectRatio: 7 / 2, // your 1400x400 banners
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  pressed: { opacity: 0.92 },
});
