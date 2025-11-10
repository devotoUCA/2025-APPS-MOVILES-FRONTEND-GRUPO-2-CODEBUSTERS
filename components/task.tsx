// components/task.tsx (SWIPE ROBUSTO CON GESTURE-HANDLER)

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export type TipoTarea = "Productividad" | "Alimentación" | "Ejercicio" | "SaludMental";

const CATEGORIAS_CONFIG = {
  "Productividad": { 
    icon: "briefcase", 
    libreria: "FontAwesome", 
    color: "#4a90e2",
    colorClaro: "#6ba3e8"
  },
  "Alimentación": { 
    icon: "cutlery", 
    libreria: "FontAwesome", 
    color: "#f5a623",
    colorClaro: "#f7b851"
  },
  "Ejercicio": { 
    icon: "heartbeat", 
    libreria: "FontAwesome", 
    color: "#d0021b",
    colorClaro: "#e63946"
  },
  "SaludMental": { 
    icon: "yoga", 
    libreria: "MaterialCommunityIcons", 
    color: "#9013fe",
    colorClaro: "#a855f7"
  },
};

interface TaskProps {
  titulo: string;
  tipo: TipoTarea;
  completada: boolean;
  onToggle: () => void;
  onEliminar: () => void;
}

const Task: React.FC<TaskProps> = ({ titulo, tipo, completada, onToggle, onEliminar }) => {
  const categoryConfig = CATEGORIAS_CONFIG[tipo];
  const swipeableRef = React.useRef<Swipeable>(null);

  // Renderiza la acción de la DERECHA (completar)
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX: trans }] }]}>
        <RectButton
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
            onToggle();
          }}
        >
          <FontAwesome name="check-circle" size={26} color="#FFF" />
          <Text style={styles.actionText}>Completar</Text>
        </RectButton>
      </Animated.View>
    );
  };

  // Renderiza la acción de la IZQUIERDA (eliminar)
  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.leftAction, { transform: [{ translateX: trans }] }]}>
        <RectButton
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
            onEliminar();
          }}
        >
          <FontAwesome name="trash" size={24} color="#FFF" />
          <Text style={styles.actionText}>Eliminar</Text>
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <View
        style={[
          styles.taskCard,
          { backgroundColor: categoryConfig.color }
        ]}
      >
        {/* Icono de categoría */}
        <View style={[styles.iconContainer, { backgroundColor: categoryConfig.colorClaro }]}>
          {categoryConfig.libreria === "FontAwesome" && (
            <FontAwesome name={categoryConfig.icon as any} size={22} color="#FFF" />
          )}
          {categoryConfig.libreria === "MaterialCommunityIcons" && (
            <MaterialCommunityIcons name={categoryConfig.icon as any} size={26} color="#FFF" />
          )}
        </View>

        {/* Contenido */}
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {titulo}
          </Text>
          <Text style={styles.taskCategory}>{tipo}</Text>
        </View>

        {/* Indicador de swipe */}
        <View style={styles.swipeIndicator}>
          <FontAwesome name="angle-left" size={16} color="rgba(255,255,255,0.4)" />
          <FontAwesome name="angle-right" size={16} color="rgba(255,255,255,0.4)" />
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    height: 85,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  taskCategory: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
  swipeIndicator: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 8,
  },
  rightAction: {
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "flex-end",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 12,
    marginRight: 20,
    width: 100,
  },
  leftAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "flex-start",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginBottom: 12,
    marginLeft: 20,
    width: 100,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
});

export default Task;