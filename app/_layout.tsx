// app/_layout.tsx
import { Slot } from "expo-router";
import { InventoryProvider } from "./(tabs)/InventoryContext";

export default function RootLayout() {
  return (
    <InventoryProvider>
      <Slot />
    </InventoryProvider>
  );
}
