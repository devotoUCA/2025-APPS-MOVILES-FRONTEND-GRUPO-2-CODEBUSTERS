import { Stack } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Chest, { InventoryItem } from "../../components/chest";

const gardenColors: Record<string, string> = {
  jungle: "#00FFAA",
  peach: "#1ADFED",
  valley: "#9BA0A0",
  desert: "#FFD700",
};

const gardenImages: Record<string, any> = {
  jungle_1: require("../../assets/Gardens/Jungle/jungle_1.png"),
  jungle_2: require("../../assets/Gardens/Jungle/jungle_2.png"),
  jungle_3: require("../../assets/Gardens/Jungle/jungle_3.png"),
  jungle_4: require("../../assets/Gardens/Jungle/jungle_4.png"),
  jungle_5: require("../../assets/Gardens/Jungle/jungle_5.png"),
  desert_1: require("../../assets/Gardens/Desert/desert_1.png"),
  desert_2: require("../../assets/Gardens/Desert/desert_2.png"),
  desert_3: require("../../assets/Gardens/Desert/desert_3.png"),
  // agregar más jardines y niveles aquí
};

export default function HomeScreen() {
  const [chestVisible, setChestVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const gardenFile = "../../assets/Gardens/Jungle/jungle_1.png";
  const fileName = gardenFile.split("/").pop()?.replace(".png", "") || "";
  const [gardenName, gardenLevelRaw] = fileName.split("_");
  const [level, setLevel] = useState(parseInt(gardenLevelRaw || "1"));

  const glowColor = gardenColors[gardenName] || "#FFFFFF";
  const currentKey = `${gardenName}_${level}`;
  const gardenSource = gardenImages[currentKey] || gardenImages["jungle_1"];

  const handleUseItem = (item: InventoryItem) => {
    setProgress((prev) => {
      const newProgress = prev + 1;
      if (newProgress >= 3) {
        setLevel((lvl) => (lvl < 3 ? lvl + 1 : lvl));
        return 0;
      }
      return newProgress;
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.appName}>MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName?.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {level}</Text>
      </View>

      <View style={[styles.gardenWrapper, { shadowColor: glowColor }]}>
        <Image source={gardenSource} style={styles.gardenImage} resizeMode="contain" />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressFill, { width: `${(progress / 3) * 100}%` }]} />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.chestButton,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.85 },
        ]}
        onPress={() => setChestVisible(true)}
      >
        <Text style={styles.chestText}>Inventario</Text>
      </Pressable>

      <Chest visible={chestVisible} onClose={() => setChestVisible(false)} onUseItem={handleUseItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  header: { position: "absolute", top: 40, left: 20 },
  appName: { color: "#00FFAA", fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  gardenName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  gardenLevel: { color: "#aaa", fontSize: 14 },
  gardenWrapper: {
    width: "85%",
    height: "60%",
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 30,
  },
  gardenImage: { width: "90%", height: "90%" },
  progressBarContainer: {
    width: "70%",
    height: 10,
    borderColor: "#00FFAA",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  progressFill: { height: "100%", backgroundColor: "#00FFAA" },
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
  chestText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
