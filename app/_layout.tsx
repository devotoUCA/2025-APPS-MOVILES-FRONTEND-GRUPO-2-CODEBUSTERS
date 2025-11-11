import { InventoryProvider } from "@/contexts/InventoryContext";
import { restoreSession } from "@/redux/actions/authActions";
import store from "@/redux/store";
import { router, Slot, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

SplashScreen.preventAutoHideAsync();


function RootLayoutNav() {
  const { player, isLoading } = useSelector((state: any) => state.auth);
  const navigationState = useRootNavigationState();
  const dispatch = useDispatch();
  
  const splashHidden = useRef(false);

  useEffect(() => {
    dispatch(restoreSession() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!navigationState?.key || isLoading) {
      return;
    }

    if (!splashHidden.current) {
      SplashScreen.hideAsync();
      splashHidden.current = true; 
    }

    if (player) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/signin");
    }
  }, [player, isLoading, navigationState?.key]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <InventoryProvider>
        <RootLayoutNav />
      </InventoryProvider>
    </Provider>
  );
}