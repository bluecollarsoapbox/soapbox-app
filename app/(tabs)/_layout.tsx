// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#8aa',
        tabBarStyle: { backgroundColor: '#0b0d10', borderTopColor: '#1e2630' },
      }}
    >
      {/* HEADLINES */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Headlines',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />

      {/* CONFESSIONS */}
      <Tabs.Screen
        name="confessions"
        options={{
          title: 'Confessions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />

      {/* HOTLINE */}
      <Tabs.Screen
        name="hotline"
        options={{
          title: 'Hotline',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" color={color} size={size} />
          ),
        }}
      />

      {/* SPOTLIGHT */}
      <Tabs.Screen
        name="spotlight/Spotlight"   // 👈 must match your file path
        options={{
          title: 'Spotlight',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic-outline" color={color} size={size} />
    ),
  }}
/>

      {/* LINKS */}
      <Tabs.Screen
        name="links"
        options={{
          title: 'Links',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="link-outline" color={color} size={size} />
          ),
        }}
      />

      {/* HIDDEN (not in tab bar, but still routable) */}
      <Tabs.Screen name="pizza" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="breaking" options={{ href: null }} />
      <Tabs.Screen name="story/[id]" options={{ href: null }} />
      <Tabs.Screen name="spotify-collab" options={{ href: null }} />
      <Tabs.Screen
  name="spotlight-form"
  options={{
    href: null,         // hidden from the tab bar
    headerShown: false, // no back header
    
  }}
/>

    </Tabs>
  );
}
