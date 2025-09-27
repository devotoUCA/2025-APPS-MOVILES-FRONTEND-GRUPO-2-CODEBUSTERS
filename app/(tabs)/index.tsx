// app/index.tsx
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Chest from "../../components/chest";

// Tabla de colores por jardín
const gardenColors: Record<string, string> = {
  jungle: "#00FFAA",
  peach: "#1adfedff",
  valley: "#9ba0a0ff",
};

export default function HomeScreen() {
  const [chestVisible, setChestVisible] = useState(false);

  // Imagen del jardín
  const gardenFile = "../../assets/Gardens/Jungle/jungle_1.png";
  const gardenSource = require("../../assets/Gardens/Jungle/jungle_1.png");

  // Extraer nombre y nivel desde el string
  const fileName = gardenFile.split("/").pop()?.replace(".png", "") || "";
  const [gardenName, gardenLevel] = fileName.split("_");

  // Color dinámico según el jardín
  const glowColor = gardenColors[gardenName] || "#FFFFFF";

  return (
    <View style={styles.container}>
      {/* Ocultar header de Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.appName}>MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {gardenLevel}</Text>
      </View>

      {/* Contenedor con bordes redondeados + glow dinámico */}
      <View style={[{ shadowColor: glowColor }, styles.gardenWrapper]}>
        <Image
          source={gardenSource}
          style={styles.gardenImage}
          resizeMode="cover"
        />
      </View>

      {/* Botón para abrir Chest */}
      <TouchableOpacity style={styles.chestButton} onPress={() => setChestVisible(true)}>
        <Text style={{ color: "white" }}>Inventario</Text>
      </TouchableOpacity>

      {/* Chest Modal */}
      <Chest visible={chestVisible} onClose={() => setChestVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  appName: {
    color: "#00FFAA",
    fontSize: 18,
    fontWeight: "bold",
  },
  gardenName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gardenLevel: {
    color: "#aaa",
    fontSize: 14,
  },
  gardenWrapper: {
    width: "85%",
    height: "65%",
    borderRadius: 30,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  gardenImage: {
    width: "100%",
    height: "100%",
  },
  chestButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#795548",
    padding: 10,
    borderRadius: 8,
  },
});
