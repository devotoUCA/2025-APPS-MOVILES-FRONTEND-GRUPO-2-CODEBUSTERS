// app/_layout.tsx (EL CEREBRO - CÓDIGO FINAL)

import { InventoryProvider } from "@/contexts/InventoryContext";
import { restoreSession } from "@/redux/actions/authActions";
import store from "@/redux/store";
import { router, Slot, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
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

    // Si llegamos aquí, AMBOS están listos.
    SplashScreen.hideAsync();

    if (player) { // Si hay un 'player', está logueado
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/signin");
    }
  }, [player, isLoading, navigationState?.key]);

  // 4. ¡LA CORRECCIÓN MÁS IMPORTANTE!
  //    Renderiza el <Slot /> INMEDIATAMENTE.
  //    Esto evita el error 'Attempted to navigate...'
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