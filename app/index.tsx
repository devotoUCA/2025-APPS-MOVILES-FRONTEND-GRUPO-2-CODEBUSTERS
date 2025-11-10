// app/index.tsx (EL SPINNER - CÓDIGO FINAL)

import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Esta es la pantalla de carga por defecto.
 * _layout.tsx la mostrará gracias al <Slot />
 * mientras 'restoreSession' está en curso.
 */
export default function AppEntry() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00FFAA" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});