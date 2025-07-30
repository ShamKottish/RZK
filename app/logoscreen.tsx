// app/logoscreen.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// Metro‑compatible require
const logo = require('../assets/images/rzksimple.png');

export default function LogoScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // fade in  → 1
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // hold at 1 for 500ms
      Animated.delay(500),
      // fade out → 1
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/login');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logo}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 1000,
    height: 6100,
  },
});
