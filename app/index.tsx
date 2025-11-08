import { restoreSession } from "@/redux/actions/authActions";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function AppEntry() {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state: any) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Intentar restaurar sesión desde AsyncStorage
    const init = async () => {
      await dispatch(restoreSession() as any);
      // Pequeño delay para asegurar que todo esté montado
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    };
    
    init();
  }, []);

  useEffect(() => {
    // Redirigir solo cuando esté listo
    if (isReady && !isLoading) {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/signin");
      }
    }
  }, [isLoggedIn, isLoading, isReady]);

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