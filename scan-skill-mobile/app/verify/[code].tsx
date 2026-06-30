import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { verifyApi } from '@/lib/api';
import { Colors } from '@/constants/Colors';

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR');

export default function VerifyScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [result, setResult] = useState<any>(null);
  const [ai, setAi] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await verifyApi.check(code);
        setResult(res.data);
        setAiLoading(true);
        verifyApi.analyze(res.data.type, res.data.entity)
          .then((r) => setAi(r.data.analyse))
          .catch(() => {})
          .finally(() => setAiLoading(false));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [code]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.navy }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={[styles.center, { backgroundColor: Colors.redBg }]}>
        <Ionicons name="close-circle" size={72} color="#fff" />
        <Text style={styles.bigStatus}>QR invalide</Text>
        <Text style={styles.errSub}>Ce code n'est pas reconnu</Text>
        <TouchableOpacity style={styles.whiteBtn} onPress={() => router.back()}>
          <Text style={styles.whiteBtnText}>Retour au scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { type, conforme, entity } = result;
  const bg = conforme ? Colors.greenBg : Colors.redBg;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.statusWrap}>
          <Ionicons name={conforme ? 'checkmark-circle' : 'alert-circle'} size={64} color="#fff" />
          <Text style={styles.bigStatus}>{conforme ? 'CONFORME' : 'NON CONFORME'}</Text>
        </View>

        <View style={styles.card}>
          {type === 'ouvrier' && (
            <>
              <Text style={styles.name}>{entity.prenom} {entity.nom}</Text>
              <View style={styles.tag}><Text style={styles.tagText}>OUVRIER</Text></View>
              <Text style={styles.cardSection}>Habilitations</Text>
              {entity.habilitations?.length ? entity.habilitations.map((h: any) => (
                <View key={h.id} style={[styles.habRow, { backgroundColor: h.statut === 'VALIDE' ? '#F0FDF4' : '#FEF2F2', borderColor: h.statut === 'VALIDE' ? '#BBF7D0' : '#FECACA' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.habName}>{h.nom}</Text>
                    <Text style={styles.habDate}>Expire le {fmt(h.dateExpiration)}</Text>
                  </View>
                  <View style={[styles.habBadge, { backgroundColor: h.statut === 'VALIDE' ? '#BBF7D0' : '#FECACA' }]}>
                    <Text style={[styles.habBadgeText, { color: h.statut === 'VALIDE' ? '#166534' : '#991B1B' }]}>{h.statut}</Text>
                  </View>
                </View>
              )) : <Text style={styles.empty}>Aucune habilitation</Text>}
            </>
          )}

          {type === 'engin' && (
            <>
              <Text style={styles.name}>{entity.type}</Text>
              <Text style={styles.sub}>{entity.marque} {entity.modele}</Text>
              <View style={styles.immatBox}>
                <Text style={styles.immatLabel}>IMMATRICULATION</Text>
                <Text style={styles.immat}>{entity.immatriculation}</Text>
              </View>
              <InfoRow label="Prochain contrôle" value={entity.prochainControle ? fmt(entity.prochainControle) : '—'} />
              <InfoRow label="Exp. assurance" value={entity.dateExpirationAssurance ? fmt(entity.dateExpirationAssurance) : '—'} />
              <InfoRow label="VPG fourni" value={entity.vpgFournit || '—'} />
            </>
          )}

          {type === 'appareil' && (
            <>
              <Text style={styles.name}>{entity.nom}</Text>
              <Text style={styles.sub}>{entity.type}</Text>
              <InfoRow label="Référence" value={entity.reference} />
              <InfoRow label="Localisation" value={entity.localisation || '—'} />
            </>
          )}

          {/* Analyse IA */}
          <View style={styles.aiBox}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={16} color={Colors.slate500} />
              <Text style={styles.aiTitle}>ANALYSE IA</Text>
            </View>
            {aiLoading ? (
              <View style={styles.aiLoadingRow}>
                <ActivityIndicator size="small" color={Colors.slate400} />
                <Text style={styles.aiLoadingText}>Analyse en cours...</Text>
              </View>
            ) : ai ? (
              <Text style={styles.aiText}>{ai}</Text>
            ) : (
              <Text style={styles.empty}>Non disponible</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.whiteBtn} onPress={() => router.back()}>
          <Ionicons name="scan" size={20} color={Colors.slate800} />
          <Text style={styles.whiteBtnText}>Nouveau scan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '500' },
  statusWrap: { alignItems: 'center', marginBottom: 20 },
  bigStatus: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 8 },
  errSub: { color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 22 },
  name: { fontSize: 24, fontWeight: '800', color: Colors.slate800 },
  sub: { fontSize: 15, color: Colors.slate500, marginTop: 2 },
  tag: { alignSelf: 'flex-start', backgroundColor: Colors.slate100, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.slate500, letterSpacing: 0.5 },
  cardSection: { fontSize: 14, fontWeight: '700', color: Colors.slate700, marginTop: 20, marginBottom: 10 },
  habRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  habName: { fontSize: 14, fontWeight: '600', color: Colors.slate800 },
  habDate: { fontSize: 12, color: Colors.slate500, marginTop: 2 },
  habBadge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  habBadgeText: { fontSize: 11, fontWeight: '700' },
  empty: { color: Colors.slate400, fontStyle: 'italic', fontSize: 14 },
  immatBox: { backgroundColor: Colors.slate100, borderRadius: 12, padding: 12, marginTop: 14, alignSelf: 'flex-start' },
  immatLabel: { fontSize: 11, color: Colors.slate500, letterSpacing: 0.5 },
  immat: { fontSize: 18, fontWeight: '800', color: Colors.slate800 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.slate50, borderRadius: 10, padding: 12, marginTop: 8 },
  infoLabel: { fontSize: 12, fontWeight: '700', color: Colors.slate500, textTransform: 'uppercase' },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.slate800 },
  aiBox: { backgroundColor: Colors.slate50, borderWidth: 1, borderColor: Colors.slate200, borderRadius: 16, padding: 16, marginTop: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiTitle: { fontSize: 11, fontWeight: '700', color: Colors.slate500, letterSpacing: 0.5 },
  aiLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiLoadingText: { color: Colors.slate400, fontSize: 14 },
  aiText: { color: Colors.slate700, fontSize: 14, lineHeight: 21 },
  whiteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, marginTop: 20 },
  whiteBtnText: { color: Colors.slate800, fontSize: 16, fontWeight: '700' },
});
