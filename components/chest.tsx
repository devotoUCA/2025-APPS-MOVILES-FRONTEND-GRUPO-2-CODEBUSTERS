// components/chest.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableItem from "./draggableItem";

const { width, height } = Dimensions.get("window");

export type InventoryItem = {
  id: string;
  type: string;
  quantity: number;
  image: any;
};

const initialInventory: InventoryItem[] = [
  { id: "1", type: "agua", quantity: 2, image: require("../assets/Consumables/water.png") },
  { id: "2", type: "polvo", quantity: 3, image: require("../assets/Consumables/bone_powder.png") },
  { id: "3", type: "fertilizante", quantity: 1, image: require("../assets/Consumables/fertilizer.png") },
];

type ChestProps = {
  visible: boolean;
  onClose: () => void;
  onUseItem: (item: InventoryItem) => void;
};

export default function Chest({ visible, onClose, onUseItem }: ChestProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const { bottom } = useSafeAreaInsets();

  const imageSize = width * 0.15;
  const verticalPadding = 80;
  const modalHeight = imageSize + verticalPadding;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height - modalHeight - (bottom + 30),
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [bottom, modalHeight]);

  const slideOut = useCallback(
    (callback?: () => void) => {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        slideAnim.setValue(height);
        callback?.();
      });
    },
    [slideAnim]
  );

  useEffect(() => {
    if (visible) slideIn();
    else slideOut();
  }, [visible]);

  const handleDrop = (item: InventoryItem) => {
    if (item.quantity > 0) {
      setInventory((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
      onUseItem(item);
    }
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Fondo oscuro al abrir el inventario */}
      <Pressable style={styles.backdrop} onPress={() => slideOut(onClose)} />

      {/* Contenedor animado del inventario */}
      <Animated.View
        style={[styles.modalContent, { top: slideAnim, height: modalHeight }]}
      >
        <Text style={styles.modalTitle}>Inventario</Text>

        <FlatList
          horizontal
          data={inventory.filter((i) => i.quantity > 0)} // 🔹 solo ítems con stock
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <DraggableItem item={item} onDrop={handleDrop} />
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    left: 0,
    right: 0,
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
  },
  flatList: {
    paddingHorizontal: 5,
    alignItems: "center",
  },
  itemWrapper: {
    zIndex: 1,
  },
});
