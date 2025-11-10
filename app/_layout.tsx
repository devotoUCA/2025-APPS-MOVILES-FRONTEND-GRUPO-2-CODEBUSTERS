// app/_layout.tsx (CORREGIDO - SIN ERROR DE SPLASH SCREEN)

import { InventoryProvider } from "@/contexts/InventoryContext";
import { restoreSession } from "@/redux/actions/authActions";
import store from "@/redux/store";
import { router, Slot, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

// Mantenemos la splash screen visible
SplashScreen.preventAutoHideAsync();

/**
 * Este componente es el guardián.
 * Vive dentro de los Providers.
 */
function RootLayoutNav() {
  // 1. Lee el estado de Redux
  const { player, isLoading } = useSelector((state: any) => state.auth);
  const navigationState = useRootNavigationState();
  const dispatch = useDispatch();
  
  // ✅ SOLUCIÓN: Flag para asegurar que splash screen solo se oculte UNA VEZ
  const splashHidden = useRef(false);

  // 2. Despacha la restauración de sesión DESDE AQUÍ
  useEffect(() => {
    dispatch(restoreSession() as any);
  }, [dispatch]);

  // 3. Este efecto maneja la navegación
  useEffect(() => {
    // Espera a que el router esté listo (navigationState.key)
    // Y a que Redux haya terminado de cargar (isLoading === false)
    if (!navigationState?.key || isLoading) {
      return;
    }

    // ✅ Solo ocultar splash screen si NO se ha ocultado antes
    if (!splashHidden.current) {
      SplashScreen.hideAsync();
      splashHidden.current = true; // Marcar como ocultado
      console.log("✅ Splash screen ocultado");
    }

    // Navegar según el estado de autenticación
    if (player) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/signin");
    }
  }, [player, isLoading, navigationState?.key]);

  // 4. Renderiza el <Slot /> INMEDIATAMENTE
  return <Slot />;
}

export default function RootLayout() {
  return (
    // Configura todos los providers...
    <Provider store={store}>
      <InventoryProvider>
        {/* ...y luego renderiza nuestro guardián inteligente */}
        <RootLayoutNav />
      </InventoryProvider>
    </Provider>
  );
}