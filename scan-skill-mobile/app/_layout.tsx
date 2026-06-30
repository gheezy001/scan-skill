import { useEffect, useState, createContext, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '@/lib/api';
import { Colors } from '@/constants/Colors';

// Contexte global pour gérer l'état de connexion
export const AuthContext = createContext<{
  signedIn: boolean;
  setSignedIn: (v: boolean) => void;
}>({ signedIn: false, setSignedIn: () => {} });

export function useAuthContext() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    auth.getToken().then((token) => {
      setSignedIn(!!token);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === 'login';
    if (!signedIn && !inAuthGroup) {
      router.replace('/login' as any);
    } else if (signedIn && inAuthGroup) {
      router.replace('/(tabs)' as any);
    }
  }, [ready, signedIn, segments]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.navy, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ signedIn, setSignedIn }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="verify/[code]" options={{ presentation: 'fullScreenModal' }} />
        </Stack>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}