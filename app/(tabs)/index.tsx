// app/index.tsx
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Chest from "../../components/chest";

// Colores hardcodeados por jardín
const gardenColors: Record<string, string> = {
  jungle: "#00FFAA",
  peach: "#1ADFED",
  valley: "#9BA0A0",
  desert: "#FFD700",
  // agregar más según sea necesario
};

export default function HomeScreen() {
  const [chestVisible, setChestVisible] = useState(false);

  // Imagen del jardín actual
  const gardenFile = "../../assets/Gardens/Jungle/jungle_1.png";
  const gardenSource = require("../../assets/Gardens/Jungle/jungle_1.png");

  // Extraer nombre y nivel desde el string
  const fileName = gardenFile.split("/").pop()?.replace(".png", "") || "";
  const [gardenName, gardenLevel] = fileName.split("_");

  // Color dinámico según el jardín (hardcodeado)
  const glowColor = gardenColors[gardenName] || "#FFFFFF";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Info superior izquierda */}
      <View style={styles.header}>
        <Text style={styles.appName}>MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName?.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {gardenLevel}</Text>
      </View>

      {/* Jardín con glow */}
      <View style={[styles.gardenWrapper, { shadowColor: glowColor }]}>
        <Image
          source={gardenSource}
          style={styles.gardenImage}
          resizeMode="cover"
        />
      </View>

      {/* Botón Inventario */}
      <Pressable
        style={({ pressed }) => [
          styles.chestButton,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.85 },
        ]}
        onPress={() => setChestVisible(true)}
      >
        <Text style={styles.chestText}>Inventario</Text>
      </Pressable>

      {/* Modal Inventario */}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gardenName: {
    color: "#fff",
    fontSize: 18,
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
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 30, // Android glow
  },
  gardenImage: {
    width: "100%",
    height: "100%",
  },
  chestButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4e342e",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  chestText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
