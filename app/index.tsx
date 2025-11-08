// app/index.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AppEntry() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // simula estado de sesión

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/signin");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

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
