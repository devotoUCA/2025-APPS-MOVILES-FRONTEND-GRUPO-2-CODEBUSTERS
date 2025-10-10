import { Stack } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DraggableInventory from "../../components/DraggableInventory";

const { width, height } = Dimensions.get("window");

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
  { id: "1", type: "agua", quantity: 2, image: require("../../assets/Consumables/water.png") },
  { id: "2", type: "polvo", quantity: 3, image: require("../../assets/Consumables/bone_powder.png") },
  { id: "3", type: "fertilizante", quantity: 1, image: require("../../assets/Consumables/fertilizer.png") },
];

export default function HomeScreen() {
  const [inventory, setInventory] = useState(initialInventory);
  const [progress, setProgress] = useState(0);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gardenScaleAnim = useRef(new Animated.Value(1)).current;

  const gardenFile = "../../assets/Gardens/Jungle/jungle_1.png";
  const fileName = gardenFile.split("/").pop()?.replace(".png", "") || "";
  const [gardenName, gardenLevelRaw] = fileName.split("_");
  const [level, setLevel] = useState(parseInt(gardenLevelRaw || "1"));

  const glowColor = gardenColors[gardenName] || "#FFFFFF";
  const currentKey = `${gardenName}_${level}`;
  const gardenSource = gardenImages[currentKey] || gardenImages["jungle_1"];

  // Definir el área del jardín
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

  const handleItemDrop = (item: InventoryItem, dropX: number, dropY: number) => {
    // Verificar si se soltó dentro del jardín
    const isInsideGarden = 
      dropX >= gardenBounds.left &&
      dropX <= gardenBounds.right &&
      dropY >= gardenBounds.top &&
      dropY <= gardenBounds.bottom;

    if (isInsideGarden && item.quantity > 0) {
      playSuccessAnimation();
      
      // Actualizar inventario
      setInventory((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
      
      // Actualizar progreso
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 3) {
          setLevel((lvl) => (lvl < 5 ? lvl + 1 : lvl));
          return 0;
        }
        return newProgress;
      });
      
      return true; // Indica que el drop fue exitoso
    }
    
    return false; // Indica que el drop falló
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName?.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {level}</Text>
      </View>

      {/* Garden con área de drop visual */}
      <View style={[styles.gardenContainer, { top: gardenBounds.top, height: gardenBounds.bottom - gardenBounds.top }]}>
        <Animated.View 
          style={[
            styles.gardenWrapper, 
            { 
              shadowColor: glowColor,
              transform: [
                { scale: Animated.multiply(pulseAnim, gardenScaleAnim) }
              ]
            }
          ]}
        >
          <Image source={gardenSource} style={styles.gardenImage} resizeMode="contain" />
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressFill, { width: `${(progress / 3) * 100}%` }]} />
        <Text style={styles.progressText}>{progress}/3</Text>
      </View>

      {/* Inventory Button */}
      <TouchableOpacity
        style={styles.inventoryButton}
        onPress={() => setInventoryOpen(!inventoryOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.inventoryButtonText}>
          {inventoryOpen ? "Cerrar" : "Inventario"}
        </Text>
      </TouchableOpacity>

      {/* Draggable Inventory Component */}
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
  container: { 
    flex: 1, 
    backgroundColor: "#000"
  },
  header: { 
    position: "absolute", 
    top: 40, 
    left: 20, 
    zIndex: 10 
  },
  appName: { 
    color: "#00FFAA", 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 4 
  },
  gardenName: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  gardenLevel: { 
    color: "#aaa", 
    fontSize: 14 
  },
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
  gardenImage: { 
    width: "90%", 
    height: "90%" 
  },
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
  inventoryButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});