import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,

  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

export type InventoryItem = {
  id: string;
  type: string;
  quantity: number;
  image: any;
};

type DraggableInventoryProps = {
  inventory: InventoryItem[];
  isOpen: boolean;
  onItemDrop: (item: InventoryItem, x: number, y: number) => Promise<boolean>;
  gardenBounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export default function DraggableInventory({
  inventory,
  isOpen,
  onItemDrop,
  gardenBounds,
}: DraggableInventoryProps) {
  const [draggingItem, setDraggingItem] = useState<InventoryItem | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  
  const panelAnim = useRef(new Animated.Value(0)).current;
  const dragPosition = useRef(new Animated.ValueXY()).current;
  const dragOpacity = useRef(new Animated.Value(0)).current;
  const dragScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: isOpen ? 1 : 0,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const createPanResponder = (item: InventoryItem) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { pageX, pageY } = evt.nativeEvent;
        setDraggingItem(item);
        setDragStartPosition({ x: pageX - 30, y: pageY - 30 });
        
        dragPosition.setValue({ x: pageX - 30, y: pageY - 30 });
        
        Animated.parallel([
          Animated.timing(dragOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(dragScale, {
            toValue: 1.2,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start();
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { pageX, pageY } = evt.nativeEvent;
        dragPosition.setValue({ x: pageX - 30, y: pageY - 30 });
      },

      onPanResponderRelease: async (evt: GestureResponderEvent) => {
        const { pageX, pageY } = evt.nativeEvent;
        
        if (draggingItem) {
          const dropSuccess = await onItemDrop(draggingItem, pageX, pageY);
          
          if (dropSuccess) {
            
            Animated.parallel([
              Animated.timing(dragScale, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(dragOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              resetDrag();
            });
          } else {
            
            Animated.parallel([
              Animated.spring(dragPosition, {
                toValue: dragStartPosition,
                friction: 5,
                useNativeDriver: true,
              }),
              Animated.timing(dragOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.spring(dragScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
              }),
            ]).start(() => {
              resetDrag();
            });
          }
        }
      },

      onPanResponderTerminate: () => {
        
        Animated.timing(dragOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          resetDrag();
        });
      },
    });
  };

  const resetDrag = () => {
    setDraggingItem(null);
    dragPosition.setValue({ x: 0, y: 0 });
    dragScale.setValue(1);
    dragOpacity.setValue(0);
  };

  const translateY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  return (
    <>
      
      <Animated.View 
        style={[
          styles.inventoryPanel,
          {
            transform: [{ translateY }],
            opacity: panelAnim,
          }
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <View style={styles.handle} />
        <Text style={styles.inventoryTitle}>Inventario</Text>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.inventoryContent}
          scrollEnabled={!draggingItem}
        >
          {inventory.filter(item => item.quantity > 0).map(item => {
            const panResponder = createPanResponder(item);
            const isDragging = draggingItem?.id === item.id;
            
            return (
              <View 
                key={item.id} 
                style={styles.itemContainer}
                {...panResponder.panHandlers}
              >
                <View style={[styles.item, isDragging && styles.draggingItem]}>
                  <Image
                    source={item.image}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>

      
      {draggingItem && (
        <View 
          style={[
            styles.dropZone,
            {
              top: gardenBounds.top,
              left: gardenBounds.left,
              width: gardenBounds.right - gardenBounds.left,
              height: gardenBounds.bottom - gardenBounds.top,
            }
          ]}
          pointerEvents="none"
        />
      )}

      
      {draggingItem && (
        <Animated.View
          style={[
            styles.draggedItem,
            {
              transform: [
                { translateX: dragPosition.x },
                { translateY: dragPosition.y },
                { scale: dragScale },
              ],
              opacity: dragOpacity,
            }
          ]}
          pointerEvents="none"
        >
          <Image
            source={draggingItem.image}
            style={styles.draggedItemImage}
            resizeMode="contain"
          />
          <View style={styles.draggedQuantityBadge}>
            <Text style={styles.draggedQuantityText}>{draggingItem.quantity}</Text>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inventoryPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
  },
  handle: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
  },
  inventoryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  inventoryContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  itemContainer: {
    marginHorizontal: 10,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  draggingItem: {
    opacity: 0.3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#00FFAA",
    borderRadius: 10,
    backgroundColor: "#000",
  },
  quantityBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#00FFAA",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: "center",
  },
  quantityText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  dropZone: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#00FFAA",
    borderStyle: "dashed",
    borderRadius: 30,
    backgroundColor: "rgba(0, 255, 170, 0.05)",
  },
  draggedItem: {
    position: "absolute",
    width: 60,
    height: 60,
    zIndex: 1000,
  },
  draggedItemImage: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: "#00FF66",
    borderRadius: 10,
    backgroundColor: "#000",
    shadowColor: "#00FFAA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  draggedQuantityBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#00FFAA",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: "center",
  },
  draggedQuantityText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
});