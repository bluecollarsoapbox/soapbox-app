// components/Background.tsx
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

// Try to require the image; if not found, fallback to null
let bgImage: any = null;
try {
  bgImage = require('../assets/app-bg.png');
} catch {
  bgImage = null;
}

export default function Background({
  children,
  useImage = false,   // ✅ new prop
}: {
  children: React.ReactNode;
  useImage?: boolean;
}) {
  if (useImage && bgImage) {
    return (
      <ImageBackground
        source={bgImage}
        style={styles.bg}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  }

  // fallback: solid black
  return <View style={[styles.bg, { backgroundColor: '#0b0d10' }]}>{children}</View>;
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
