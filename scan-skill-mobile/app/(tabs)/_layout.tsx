import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.slate400,
        tabBarStyle: { paddingTop: 6, height: 88 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size + 4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="liste"
        options={{
          title: 'Registre',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
