// app/(tabs)/links.tsx
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
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

// STATIC mapping to your assets (files live in /assets)
const BUTTONS: Record<string, any> = {
  youtube:   require('../../assets/youtubebutton.png'),
  discord:   require('../../assets/discordbutton.png'),
  twitch:    require('../../assets/twitchbutton.png'),
  spotify:   require('../../assets/spotifybutton.png'),
  facebook:  require('../../assets/facebookbutton.png'),
  instagram: require('../../assets/instagrambutton.png'),
  tiktok:    require('../../assets/tiktokbutton.png'),
  website:   require('../../assets/websitebutton.png'),
  store:     require('../../assets/merchbutton.png'),
};

type LinkItem = { title: string; url: string };

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

  useEffect(() => {
    setItems(FALLBACK);
  }, []);

  return (
    <Background useImage>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
          <LogoHeader />
        </View>

        <Text style={styles.title}>Links</Text>

        {!items ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.stack}>
            {items.map((it, idx) => {
              const key = it.title.toLowerCase();
              const img = BUTTONS[key as keyof typeof BUTTONS];

              // SPECIAL CASE: Spotify opens the in-app collab screen
              const onPress =
                key === 'spotify'
                  ? () => router.push('/spotify-collab')
                  : () => Linking.openURL(it.url);

              return (
                <Pressable
                  key={`${it.title}-${idx}`}
                  onPress={onPress}
                  style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
                >
                  {img ? (
                    <Image source={img} style={styles.img} resizeMode="cover" />
                  ) : (
                    <View style={[styles.img, styles.fallback]}>
                      <Text style={styles.fallbackText}>{it.title}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, alignItems: 'stretch' },
  title: { color: '#e6edf3', fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  stack: { gap: 12 },
  tile: { width: '100%', aspectRatio: 7 / 2, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  pressed: { opacity: 0.92 },
  fallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  fallbackText: { color: '#e6edf3', fontSize: 18, fontWeight: '700' },
});
