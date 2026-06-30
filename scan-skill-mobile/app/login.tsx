import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authApi, auth } from '@/lib/api';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@scanskill.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Champs requis', 'Entrez votre email et mot de passe.');
    return;
  }
  setLoading(true);
  try {
    const res = await authApi.login(email, password);
    console.log('LOGIN OK:', res.status);
    await auth.saveToken(res.data.access_token);
    await auth.saveUser(res.data.user);
    // Petit délai pour s'assurer que SecureStore a bien sauvegardé
    await new Promise(resolve => setTimeout(resolve, 500));
    router.replace('/(tabs)' as any);
  } catch (err: any) {
    console.log('LOGIN ERREUR:', err.message, err.response?.status, JSON.stringify(err.response?.data));
    Alert.alert('Échec', err.response?.data?.message || err.message || 'Erreur réseau');
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <Ionicons name="qr-code" size={36} color={Colors.white} />
        </View>
        <Text style={styles.title}>SCAN SKILL</Text>
        <Text style={styles.subtitle}>Conformité HSE</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="admin@scanskill.com"
          placeholderTextColor={Colors.slate400}
        />
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={Colors.slate400}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy, justifyContent: 'center', paddingHorizontal: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(213,0,50,0.2)',
    borderWidth: 2, borderColor: 'rgba(213,0,50,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  title: { color: Colors.white, fontSize: 30, fontWeight: '800', letterSpacing: 1 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 },
  form: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: Colors.white, fontSize: 16,
  },
  button: {
    backgroundColor: Colors.red, borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
