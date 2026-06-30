import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Réactive le scan à chaque fois qu'on revient sur l'onglet
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );


  const handleScan = ({ data }: { data: string }) => {
  if (scanned) return;
  setScanned(true);
  let code = data;
  if (code.includes('/verify/')) code = code.split('/verify/')[1];
  if (code.includes('/api/verify/')) code = code.split('/api/verify/')[1];
  router.push(`/verify/${code}`);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.red} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color={Colors.slate400} />
        <Text style={styles.permTitle}>Accès caméra requis</Text>
        <Text style={styles.permText}>
          Scan Skill a besoin de la caméra pour lire les QR codes de conformité.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'], }}
        onBarcodeScanned={scanned ? undefined : handleScan}
        videoStabilizationMode="off"
      />


      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Text style={styles.topText}>Pointez vers un QR code</Text>
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
        </View>

        <View style={styles.bottomBar}>
          {scanned ? (
            <View style={styles.scanningRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.bottomText}>Vérification...</Text>
            </View>
          ) : (
            <Text style={styles.bottomText}>Le scan est automatique</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.slate50, paddingHorizontal: 32 },
  permTitle: { fontSize: 20, fontWeight: '700', color: Colors.slate800, marginTop: 16 },
  permText: { fontSize: 14, color: Colors.slate500, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  permBtn: { backgroundColor: Colors.red, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, marginTop: 24 },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { paddingTop: 70, alignItems: 'center' },
  topText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  frameWrap: { alignItems: 'center', justifyContent: 'center' },
  frame: { width: 260, height: 260 },
  corner: { position: 'absolute', width: 44, height: 44, borderColor: Colors.green },
  tl: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 16 },
  tr: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 16 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 16 },
  br: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 16 },
  bottomBar: { paddingBottom: 60, alignItems: 'center' },
  bottomText: { color: 'rgba(255,255,255,0.9)', fontSize: 15 },
  scanningRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
