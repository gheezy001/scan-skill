import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { statsApi, auth } from '@/lib/api';
import { Colors } from '@/constants/Colors';
import { useAuthContext } from '../_layout';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSignedIn } = useAuthContext();
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, u] = await Promise.all([statsApi.dashboard(), auth.getUser()]);
      setStats(s.data);
      setUser(u);
    } catch (e) {
      // silencieux
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleLogout = async () => {
    await auth.logout();
    setSignedIn(false); // Met à jour le contexte global → déclenche la redirection
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.red} />
      </View>
    );
  }

  const kpis = [
    { label: 'Ouvriers', value: stats?.totalOuvriers ?? 0, sub: `${stats?.ouvriersConformes ?? 0} conformes`, color: Colors.slate800 },
    { label: 'Engins', value: stats?.totalEngins ?? 0, sub: `${stats?.enginsConformes ?? 0} conformes`, color: Colors.slate800 },
    { label: 'Appareils', value: stats?.totalAppareils ?? 0, sub: `${stats?.appareilsDisponibles ?? 0} dispo.`, color: Colors.slate800 },
    { label: 'Alertes', value: stats?.alertesTotal ?? 0, sub: 'a traiter', color: Colors.red },
  ];

  const taux = [
    { label: 'Ouvriers', pct: stats?.tauxConformiteOuvriers ?? 0 },
    { label: 'Engins', pct: stats?.tauxConformiteEngins ?? 0 },
    { label: 'Appareils', pct: stats?.tauxDisponibiliteAppareils ?? 0 },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Bonjour{user ? `, ${user.firstName}` : ''}</Text>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={Colors.slate500} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.scanCta} onPress={() => router.push('/(tabs)/scan' as any)}>
        <Ionicons name="scan" size={26} color="#fff" />
        <Text style={styles.scanCtaText}>Scanner un QR code</Text>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <View style={styles.kpiGrid}>
        {kpis.map((k) => (
          <View key={k.label} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{k.label}</Text>
            <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
            <Text style={styles.kpiSub}>{k.sub}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Taux de conformite</Text>
      {taux.map((t) => (
        <View key={t.label} style={styles.tauxRow}>
          <Text style={styles.tauxLabel}>{t.label}</Text>
          <View style={styles.tauxBarBg}>
            <View style={[styles.tauxBarFill, {
              width: `${t.pct}%` as any,
              backgroundColor: t.pct >= 80 ? Colors.green : t.pct >= 50 ? Colors.yellow : Colors.red
            }]} />
          </View>
          <Text style={styles.tauxPct}>{t.pct}%</Text>
        </View>
      ))}

      {(stats?.habExpirantBientot ?? 0) > 0 && (
        <View style={styles.alertBox}>
          <Ionicons name="warning" size={22} color="#92400E" />
          <Text style={styles.alertText}>
            {stats.habExpirantBientot} habilitation(s) expirent dans 30 jours
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate50, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.slate50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 20 },
  hello: { color: Colors.slate500, fontSize: 14 },
  headerTitle: { color: Colors.slate800, fontSize: 24, fontWeight: '700' },
  logoutBtn: { padding: 8 },
  scanCta: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.red,
    borderRadius: 16, padding: 18, marginBottom: 20,
  },
  scanCtaText: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  kpiCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, width: '47.5%',
    borderWidth: 1, borderColor: Colors.slate200,
  },
  kpiLabel: { color: Colors.slate500, fontSize: 12, marginBottom: 4 },
  kpiValue: { fontSize: 26, fontWeight: '700' },
  kpiSub: { color: Colors.slate400, fontSize: 11, marginTop: 2 },
  sectionTitle: { color: Colors.slate700, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  tauxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  tauxLabel: { color: Colors.slate500, fontSize: 13, width: 70 },
  tauxBarBg: { flex: 1, height: 8, backgroundColor: Colors.slate200, borderRadius: 4, overflow: 'hidden' },
  tauxBarFill: { height: '100%', borderRadius: 4 },
  tauxPct: { color: Colors.slate700, fontSize: 13, fontWeight: '600', width: 40, textAlign: 'right' },
  alertBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.yellowBg,
    borderRadius: 14, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#FDE68A',
  },
  alertText: { color: '#92400E', fontSize: 14, flex: 1 },
});