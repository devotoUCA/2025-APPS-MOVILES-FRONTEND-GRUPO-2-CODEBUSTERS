import API_CONFIG from '@/config/api';
import { updatePlayerData } from "@/redux/actions/authActions";
import { Stack } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import DraggableInventory from "../../components/DraggableInventory";
import { InventoryContext, InventoryItem } from "../../contexts/InventoryContext";

const { width, height } = Dimensions.get("window");


const gardenColors: Record<string, string> = {
  jungle: "#00FFAA",
  peach: "#FFC0CB", 
  valley: "#87CEEB", 
  desert: "#FFD700",
};

const gardenImages: Record<string, any> = {
  jungle_1: require("../../assets/Gardens/Jungle/jungle_1.png"),
  jungle_2: require("../../assets/Gardens/Jungle/jungle_2.png"),
  jungle_3: require("../../assets/Gardens/Jungle/jungle_3.png"),
  jungle_4: require("../../assets/Gardens/Jungle/jungle_4.png"),
  jungle_5: require("../../assets/Gardens/Jungle/jungle_5.png"),
  
  peach_1: require("../../assets/Gardens/Peach/peach_1.png"), 
  peach_2: require("../../assets/Gardens/Peach/peach_2.png"), 
  peach_3: require("../../assets/Gardens/Peach/peach_3.png"), 
  peach_4: require("../../assets/Gardens/Peach/peach_4.png"), 
  peach_5: require("../../assets/Gardens/Peach/peach_5.png"), 
  
  valley_1: require("../../assets/Gardens/Valley/valley_1.png"), 
  valley_2: require("../../assets/Gardens/Valley/valley_2.png"), 
  valley_3: require("../../assets/Gardens/Valley/valley_3.png"),
  valley_4: require("../../assets/Gardens/Valley/valley_4.png"),
  valley_5: require("../../assets/Gardens/Valley/valley_5.png"),
};

const findGardenProgress = (player: any, gardenId: number) => {
  if (!player || !player.GardenProgress) return null;
  return player.GardenProgress.find((p: any) => p.garden_id === gardenId);
};


export default function HomeScreen() {
  const inventoryContext = useContext(InventoryContext);
  const { player } = useSelector((state: any) => state.auth); 
  const dispatch = useDispatch(); 

  const gardenName = player?.current_garden?.garden_name || "jungle";
  const gardenId = player?.current_garden?.garden_id || 1;
  const currentProgress = findGardenProgress(player, gardenId);

  const [level, setLevel] = useState(currentProgress?.level || 1);
  const [progress, setProgress] = useState(currentProgress?.progress || 0); 
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [maxLevelReached, setMaxLevelReached] = useState(level >= 5);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gardenScaleAnim = useRef(new Animated.Value(1)).current;
  const evolveAnim = useRef(new Animated.Value(0)).current;

  const glowColor = gardenColors[gardenName] || "#FFFFFF";
  const currentKey = `${gardenName}_${level}`;
  const gardenSource = gardenImages[currentKey] || gardenImages[`${gardenName}_1`] || gardenImages["jungle_1"];
  
  const gardenBounds = {
    top: height * 0.25,
    bottom: height * 0.65,
    left: width * 0.075,
    right: width * 0.925,
  };

  
  useEffect(() => {
    const gardenProgress = findGardenProgress(player, player?.current_garden?.garden_id);
    const newLevel = gardenProgress?.level || 1;
    const newProgress = gardenProgress?.progress || 0;
    
    setLevel((currentLevel:number) => {
      if (currentLevel !== newLevel) {
        setProgress(newProgress); 
        setMaxLevelReached(newLevel >= 5);
        return newLevel;
      }
      return currentLevel;
    });

    
    if (newProgress !== progress) {
      setProgress(newProgress);
    }
  }, [player?.current_garden?.garden_id, currentProgress?.level, currentProgress?.progress]);


  if (!inventoryContext) return null;
  const { inventory, setInventory } = inventoryContext;
  
  // --- Animaciones ---
  const playSuccessAnimation = () => { 
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
        Animated.timing(gardenScaleAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(gardenScaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
  };
  
  const playLevelUpAnimation = () => { 
    evolveAnim.setValue(0);
    Animated.timing(evolveAnim, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  

  const handleItemDrop = async (
    item: InventoryItem,
    dropX: number,
    dropY: number
  ): Promise<boolean> => { 
    
    const isInsideGarden =
      dropX >= gardenBounds.left &&
      dropX <= gardenBounds.right &&
      dropY >= gardenBounds.top &&
      dropY <= gardenBounds.bottom;

    if (level >= 5) {
      setMaxLevelReached(true);
      Alert.alert("Nivel máximo", "Tu jardín ya está en el nivel máximo.");
      return false; 
    }

    if (isInsideGarden && item.quantity > 0) {
      playSuccessAnimation();

      try {
        const consumableId = parseInt(item.id);
        
        
        let newProgress = 0;
        let levelUp = false;

        setProgress((prev:number) => {
          newProgress = prev + 1;
          
          if (newProgress >= 3) {
            levelUp = true;
            
            setLevel((currentLevel: number) => { 
              const newLevel = currentLevel + 1;
              
              if (currentLevel < 5) {
                playLevelUpAnimation();
                
                saveLevelToBackend(newLevel, gardenId, 0);
                return newLevel;
              } else {
                setMaxLevelReached(true);
                return currentLevel;
              }
            });
            return 0; 
          }
          return newProgress;
        });

        
        const responseInv = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consumableId: consumableId, quantity: -1 }), 
        });
        
        if (!responseInv.ok) {
          throw new Error("Error guardando inventario");
        }
        
        const data = await responseInv.json();
        
        
        if (data.success && data.player) {
          dispatch(updatePlayerData(data.player) as any);
        }

        
        if (!levelUp && newProgress < 3) {
          await saveProgressToBackend(newProgress, gardenId);
        }

        return true;
        
      } catch (error: any) {
        Alert.alert("Error", "No se pudo usar el consumible. Verifica tu conexión.");
        return false;
      }
    }
    
    return false; 
  };

  
  const saveProgressToBackend = async (progressValue: number, activeGardenId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/progress-only`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: progressValue, gardenId: activeGardenId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al guardar el progreso.");
      }
      
      const data = await response.json();
      dispatch(updatePlayerData(data.player) as any);

    } catch (error: any) {
    }
  };

  
  const saveLevelToBackend = async (newLevel: number, activeGardenId: number, progressValue: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel, gardenId: activeGardenId, progress: progressValue }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error del backend al guardar el nivel.");
      }
      
      const data = await response.json();
      dispatch(updatePlayerData(data.player) as any);

    } catch (error: any) {
      Alert.alert("Error de guardado", `No se pudo guardar tu nuevo nivel (${newLevel}). El progreso se perderá al reiniciar.`);
    }
  };


  
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

      <View style={styles.header}>
        
        <Text style={styles.appName}>🌱 MindGarden</Text>
        <Text style={styles.gardenName}>{gardenName?.toUpperCase()}</Text>
        <Text style={styles.gardenLevel}>Nivel {level}</Text>
      </View>

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
                backgroundColor: glowColor,
                opacity: evolveOpacity, 
                borderRadius: 30,
              },
            ]}
          />
        </Animated.View>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressFill, { width: `${(progress / 3) * 100}%` }]}
        />
        <Text style={styles.progressText}>
          {maxLevelReached ? "🌿 COMPLETO 🌿" : `${progress}/3`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.inventoryButton}
        onPress={() => setInventoryOpen(!inventoryOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.inventoryButtonText}>
          {inventoryOpen ? "Cerrar" : "Inventario"}
        </Text>
      </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#000"},
  header: { position: "absolute", top: 60, left: 20, zIndex: 10 },
  appName: { color: "#00FFAA", fontSize: 30, fontWeight: "bold", marginBottom: 4 },
  gardenName: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 10},
  gardenLevel: { color: "#aaa", fontSize: 18 },
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