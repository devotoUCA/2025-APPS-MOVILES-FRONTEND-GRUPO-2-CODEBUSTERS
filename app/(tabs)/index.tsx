import { Stack } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableInventory from "../../components/DraggableInventory";

const { width, height } = Dimensions.get("window"); // ✅ Declaración única

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
};

export type InventoryItem = {
  id: string;
  type: string;
  quantity: number;
  image: any;
};

const initialInventory: InventoryItem[] = [
  {
    id: "1",
    type: "agua",
    quantity: 6,
    image: require("../../assets/Consumables/water.png"),
  },
  {
    id: "2",
    type: "polvo",
    quantity: 6,
    image: require("../../assets/Consumables/bone_powder.png"),
  },
  {
    id: "3",
    type: "fertilizante",
    quantity: 6,
    image: require("../../assets/Consumables/fertilizer.png"),
  },
];

export default function HomeScreen() {
  const [inventory, setInventory] = useState(initialInventory);
  const [progress, setProgress] = useState(0);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [level, setLevel] = useState(1);
  const [maxLevelReached, setMaxLevelReached] = useState(false);

  // Animaciones base
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gardenScaleAnim = useRef(new Animated.Value(1)).current;
  const evolveAnim = useRef(new Animated.Value(0)).current;

  const gardenFile = "../../assets/Gardens/Jungle/jungle_1.png";
  const fileName = gardenFile.split("/").pop()?.replace(".png", "") || "";
  const [gardenName] = fileName.split("_");

  const glowColor = gardenColors[gardenName] || "#FFFFFF";
  const currentKey = `${gardenName}_${level}`;
  const gardenSource = gardenImages[currentKey] || gardenImages["jungle_1"];

  // Área del jardín
  const gardenBounds = {
    top: height * 0.25,
    bottom: height * 0.65,
    left: width * 0.075,
    right: width * 0.925,
  };

  // Animación de éxito
  const playSuccessAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(gardenScaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(gardenScaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Animación especial (evolución de 6 segundos)
  const playLevelUpAnimation = () => {
    evolveAnim.setValue(0);
    Animated.timing(evolveAnim, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Manejo del drop con tope de nivel
  const handleItemDrop = (
    item: InventoryItem,
    dropX: number,
    dropY: number
  ) => {
    const isInsideGarden =
      dropX >= gardenBounds.left &&
      dropX <= gardenBounds.right &&
      dropY >= gardenBounds.top &&
      dropY <= gardenBounds.bottom;

    // Si ya está en el nivel máximo, bloquear consumo
    if (level >= 5) {
      setMaxLevelReached(true);
      return false;
    }

    if (isInsideGarden && item.quantity > 0) {
      playSuccessAnimation();

      // Consumir ítem solo si no está en el nivel máximo
      setInventory((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );

      // Actualizar progreso y nivel
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 3) {
          setLevel((lvl) => {
            if (lvl < 5) {
              playLevelUpAnimation();
              return lvl + 1;
            } else {
              setMaxLevelReached(true);
              return lvl;
            }
          });
          return 0;
        }
        return newProgress;
      });

      return true;
    }

    return false;
  };

  // Efectos visuales de evolución
  const evolveOpacity = evolveAnim.interpolate({
    inputRange: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
    outputRange: [0, 1, 0.2, 1, 0.3, 1, 0],
  });

  const evolveScale = evolveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.25, 1],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName?.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {level}</Text>
      </View>

      {/* Jardín */}
      <View
        style={[
          styles.gardenContainer,
          { top: gardenBounds.top, height: gardenBounds.bottom - gardenBounds.top },
        ]}
      >
        <Animated.View
          style={[
            styles.gardenWrapper,
            {
              shadowColor: glowColor,
              transform: [
                { scale: Animated.multiply(pulseAnim, gardenScaleAnim) },
              ],
            },
          ]}
        >
          <Animated.Image
            source={gardenSource}
            style={[
              styles.gardenImage,
              { transform: [{ scale: evolveScale }] },
            ]}
            resizeMode="contain"
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: "#00FFAA",
                opacity: evolveOpacity,
                borderRadius: 30,
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressFill, { width: `${(progress / 3) * 100}%` }]}
        />
        <Text style={styles.progressText}>
          {maxLevelReached ? "🌿 COMPLETO 🌿" : `${progress}/3`}
        </Text>
      </View>

      {/* Botón de inventario */}
      <TouchableOpacity
        style={styles.inventoryButton}
        onPress={() => setInventoryOpen(!inventoryOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.inventoryButtonText}>
          {inventoryOpen ? "Cerrar" : "Inventario"}
        </Text>
      </TouchableOpacity>

      {/* Inventario arrastrable */}
      <DraggableInventory
        inventory={inventory}
        isOpen={inventoryOpen}
        onItemDrop={handleItemDrop}
        gardenBounds={gardenBounds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  appName: { color: "#00FFAA", fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  gardenName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  gardenLevel: { color: "#aaa", fontSize: 14 },
  gardenContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  gardenWrapper: {
    width: width * 0.85,
    height: "100%",
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
    position: "absolute",
    bottom: 100,
    left: width * 0.15,
    width: width * 0.7,
    height: 20,
    borderColor: "#00FFAA",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#222",
    justifyContent: "center",
  },
  progressFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#00FFAA",
    borderRadius: 9,
  },
  progressText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  inventoryButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4e342e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  inventoryButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
