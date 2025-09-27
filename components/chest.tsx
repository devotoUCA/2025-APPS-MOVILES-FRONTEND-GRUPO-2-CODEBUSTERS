// app/chest.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const inventory = [
  { id: "1", type: "agua", quantity: 2, image: require("../assets/Consumables/water.png") },
  { id: "2", type: "polvo", quantity: 3, image: require("../assets/Consumables/bone_powder.png") },
  { id: "3", type: "fertilizante", quantity: 1, image: require("../assets/Consumables/fertilizer.png") },
];

type ChestProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Chest({ visible, onClose }: ChestProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  const imageSize = width * 0.15;
  const verticalPadding = 80; // espacio extra arriba y abajo
  const modalHeight = imageSize + verticalPadding;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: height - modalHeight - 30, // espacio inferior para el navegador
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop semi-transparente */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Modal tipo carrusel */}
      <Animated.View style={[styles.modalContent, { top: slideAnim, height: modalHeight }]}>
        <Text style={styles.modalTitle}>Inventario</Text>
        <FlatList
          horizontal
          data={inventory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image
                source={item.image}
                style={[styles.itemImage, styles.imageBorder]}
                resizeMode="contain"
              />
              {/* Contador encima de la imagen */}
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
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
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center", // centra verticalmente el contenido
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
    alignItems: "center", // centra verticalmente cada item del FlatList
  },
  itemContainer: {
    marginHorizontal: 8,
    justifyContent: "center", // centra la imagen dentro de su contenedor
    alignItems: "center",
  },
  itemImage: {
    width: width * 0.15,
    height: width * 0.15,
  },
  imageBorder: {
    borderWidth: 2,
    borderColor: "#00FFAA",
    borderRadius: 8,
  },
  quantityBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#00FFAA",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  quantityText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 10,
  },
});
