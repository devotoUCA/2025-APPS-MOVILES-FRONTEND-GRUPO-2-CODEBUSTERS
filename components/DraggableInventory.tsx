import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { InventoryItem } from "../contexts/InventoryContext";

const { width, height } = Dimensions.get("window");

interface Props {
  inventory: InventoryItem[];
  isOpen: boolean;
  onItemDrop: (
    item: InventoryItem,
    x: number,
    y: number
  ) => Promise<boolean>;
  gardenBounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  onDragStart?: () => void; // NUEVO
  onDragEnd?: () => void; // NUEVO
}

// Información de los consumibles
const CONSUMABLE_INFO: Record<string, { name: string; description: string; effect: number }> = {
  "1": {
    name: "💧 Agua Cristalina",
    description: "Esencial para la vida. Este líquido vital hidrata profundamente las raíces de tu jardín, permitiendo que absorba nutrientes con mayor eficiencia.",
    effect: 2
  },
  "2": {
    name: "🦴 Polvo de Huesos",
    description: "Rico en minerales ancestrales. Los antiguos jardineros lo utilizaban como fuente natural de calcio y fósforo para fortalecer el crecimiento de las plantas.",
    effect: 1
  },
  "3": {
    name: "🌿 Fertilizante Premium",
    description: "La fórmula secreta de los maestros jardineros. Una mezcla concentrada de nutrientes que acelera dramáticamente el desarrollo de tu jardín.",
    effect: 3
  }
};

export default function DraggableInventory({
  inventory,
  isOpen,
  onItemDrop,
  gardenBounds,
  onDragStart, // NUEVO
  onDragEnd, // NUEVO
}: Props) {
  const [draggingItem, setDraggingItem] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const panPosition = useRef(new Animated.ValueXY()).current;

  const createPanResponder = (item: InventoryItem) => {
    let startTime = 0;
    let hasMoved = false;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startTime = Date.now();
        hasMoved = false;
        panPosition.setOffset({
          x: (panPosition.x as any)._value,
          y: (panPosition.y as any)._value,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        // Detectar si hubo movimiento significativo
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          hasMoved = true;
          if (!draggingItem) {
            setDraggingItem(item);
            onDragStart?.(); // NUEVO: Notificar inicio de drag
          }
          Animated.event([null, { dx: panPosition.x, dy: panPosition.y }], {
            useNativeDriver: false,
          })(e, gestureState);
        }
      },
      onPanResponderRelease: async (e, gestureState) => {
        const timeElapsed = Date.now() - startTime;
        
        // Si fue un tap rápido sin movimiento, mostrar modal
        if (!hasMoved && timeElapsed < 200) {
          setSelectedItem(item);
          setModalVisible(true);
          panPosition.flattenOffset();
          return;
        }

        // Si hubo movimiento, procesar el drop
        if (hasMoved && draggingItem) {
          const dropX = gestureState.moveX;
          const dropY = gestureState.moveY;

          const success = await onItemDrop(item, dropX, dropY);

          if (success) {
            onDragEnd?.(); // NUEVO: Notificar fin de drag
            Animated.spring(panPosition, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start(() => {
              setDraggingItem(null);
              
              panPosition.setValue({ x: 0, y: 0 });
            });
          } else {
            onDragEnd?.(); // NUEVO: Notificar fin de drag
            Animated.spring(panPosition, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }).start(() => {
              setDraggingItem(null);
              panPosition.setValue({ x: 0, y: 0 });
            });
          }
        } else {
          panPosition.flattenOffset();
          panPosition.setValue({ x: 0, y: 0 });
          setDraggingItem(null);
        }
      },
    });
  };

  if (!isOpen) return null;

  const itemInfo = selectedItem ? CONSUMABLE_INFO[selectedItem.id] : null;

  return (
    <>
      <View style={styles.inventoryContainer}>
        <Text style={styles.inventoryTitle}>Consumibles</Text>
        <View style={styles.itemsGrid}>
          {inventory.map((item) => {
            const panResponder = createPanResponder(item);
            const isDragging = draggingItem?.id === item.id;

            return (
              <View key={item.id} style={styles.itemSlot}>
                <Animated.View
                  {...panResponder.panHandlers}
                  style={[
                    styles.itemWrapper,
                    isDragging && {
                      transform: [
                        { translateX: panPosition.x },
                        { translateY: panPosition.y },
                      ],
                      zIndex: 1000,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.itemCard,
                      isDragging && styles.itemCardDragging,
                    ]}
                  >
                    <Image source={item.image} style={styles.itemImage} />
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Modal informativo */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{itemInfo?.name}</Text>
            </View>
            
            <View style={styles.modalBody}>
              {selectedItem && (
                <Image source={selectedItem.image} style={styles.modalImage} />
              )}
              <Text style={styles.modalDescription}>{itemInfo?.description}</Text>
              
              <View style={styles.effectContainer}>
                <Text style={styles.effectLabel}>Efecto en el jardín:</Text>
                <View style={styles.effectBadge}>
                  <Text style={styles.effectText}>+{itemInfo?.effect} progreso</Text>
                </View>
              </View>

              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Cantidad disponible:</Text>
                <Text style={styles.quantityValue}>{selectedItem?.quantity}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 10,
  },
  inventoryTitle: {
    color: "#00FFAA",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  itemsGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
  },
  itemSlot: {
    width: 70,
    height: 70,
  },
  itemWrapper: {
    width: "100%",
    height: "100%",
  },
  itemCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3a3a3a",
  },
  itemCardDragging: {
    opacity: 0.8,
    transform: [{ scale: 1.1 }],
    borderColor: "#00FFAA",
    shadowColor: "#00FFAA",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  quantityBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#00FFAA",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  quantityText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 25,
    width: width * 0.85,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#00FFAA",
    shadowColor: "#00FFAA",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00FFAA",
    textAlign: "center",
  },
  modalBody: {
    alignItems: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  effectContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  effectLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  effectBadge: {
    backgroundColor: "#00FFAA",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  effectText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#999",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00FFAA",
  },
  closeButton: {
    backgroundColor: "#00FFAA",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});