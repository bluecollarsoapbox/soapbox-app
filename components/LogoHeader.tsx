// app/components/LogoHeader.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// assets folder is at project root, this component is in app/components → go up twice
const LOGO = require('../assets/logo.png');

export default function LogoHeader() {
  const [failed, setFailed] = React.useState(false);

  return (
    <View style={styles.wrap}>
      {failed ? (
        <View style={styles.fallback}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>LOGO NOT FOUND</Text>
          <Text style={{ color: '#9fb0c0', fontSize: 12, marginTop: 4 }}>
            expected: assets/logo.png
          </Text>
        </View>
      ) : (
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: 150,
  },
  fallback: {
    width: '100%',
    height: 150,
    backgroundColor: '#331a1a',
    borderWidth: 1,
    borderColor: '#d33',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
