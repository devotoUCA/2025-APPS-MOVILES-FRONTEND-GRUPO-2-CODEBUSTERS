// _layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Tarjetas" }} />
      <Tabs.Screen name="counter" options={{ title: "Contador" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      <Tabs.Screen name="gallery" options={{ title: "Galería" }} />
    </Tabs>
  );
}
