import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ouvriersApi, enginsApi, appareilsApi } from '@/lib/api';
import { Colors } from '@/constants/Colors';

type Tab = 'ouvriers' | 'engins' | 'appareils';

export default function ListeScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('ouvriers');
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (t: Tab, q: string) => {
    setLoading(true);
    try {
      const apiMap = { ouvriers: ouvriersApi, engins: enginsApi, appareils: appareilsApi };
      const res = await apiMap[t].getAll({ search: q, limit: 100 });
      setItems(res.data.data ?? res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(tab, search), 250);
    return () => clearTimeout(timer);
  }, [tab, search, load]);

  const isConforme = (item: any) => {
    if (tab === 'ouvriers') return !item.habilitations?.some((h: any) => h.statut === 'EXPIRE');
    if (tab === 'engins') return item.statut === 'CONFORME';
    return item.statut === 'DISPONIBLE' || item.statut === 'EN_SERVICE';
  };

  const renderItem = ({ item }: { item: any }) => {
    const ok = isConforme(item);
    let title = '', subtitle = '';
    if (tab === 'ouvriers') {
      title = `${item.prenom} ${item.nom}`;
      const valides = item.habilitations?.filter((h: any) => h.statut === 'VALIDE').length ?? 0;
      subtitle = `${valides}/${item.habilitations?.length ?? 0} habilitations valides`;
    } else if (tab === 'engins') {
      title = `${item.type} ${item.marque ?? ''}`;
      subtitle = item.immatriculation;
    } else {
      title = item.nom;
      subtitle = `${item.reference} · ${item.type}`;
    }
    return (
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: ok ? Colors.green : Colors.red }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSub}>{subtitle}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: ok ? '#DCFCE7' : '#FEE2E2' }]}>
          <Text style={[styles.statusPillText, { color: ok ? '#166534' : '#991B1B' }]}>
            {ok ? 'OK' : '!'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.header}>Registre</Text>

      <View style={styles.tabs}>
        {(['ouvriers', 'engins', 'appareils'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'ouvriers' ? 'Ouvriers' : t === 'engins' ? 'Engins' : 'Appareils'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.slate400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor={Colors.slate400}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.red} size="large" /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(tab, search); }} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucun résultat</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate50, paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: '700', color: Colors.slate800, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: Colors.slate200, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.slate800, borderColor: Colors.slate800 },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.slate500 },
  tabTextActive: { color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.slate200, marginBottom: 14 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.slate800 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.slate200 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: Colors.slate800 },
  itemSub: { fontSize: 12, color: Colors.slate500, marginTop: 2 },
  statusPill: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statusPillText: { fontSize: 13, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: Colors.slate400, fontStyle: 'italic', marginTop: 40 },
});
