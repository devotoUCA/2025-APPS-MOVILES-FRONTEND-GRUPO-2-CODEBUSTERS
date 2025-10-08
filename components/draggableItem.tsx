import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { InventoryItem } from "./chest";

const { height, width } = Dimensions.get("window");

type DraggableItemProps = {
  item: InventoryItem;
  onDrop: (item: InventoryItem) => void;
};

export default function DraggableItem({ item, onDrop }: DraggableItemProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current; // “levanta” el ítem visualmente
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragging(true);

        // Efecto de levantar el ítem
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.1,
            friction: 4,
            useNativeDriver: false,
          }),
          Animated.timing(lift, {
            toValue: -10,
            duration: 120,
            useNativeDriver: false,
          }),
        ]).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        const droppedOverGarden = gestureState.moveY < height * 0.6;
        if (droppedOverGarden) onDrop(item);

        // Retorno suave a posición inicial
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 80,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: false,
          }),
          Animated.timing(lift, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start(() => setDragging(false));
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: Animated.add(pan.y, lift) },
      { scale },
    ],
    zIndex: dragging ? 10 : 1,
  };

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]} {...panResponder.panHandlers}>
      <Image
        source={item.image}
        style={[styles.itemImage, styles.imageBorder]}
        resizeMode="contain"
      />
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.quantity}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: width * 0.13,
    height: width * 0.13,
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
