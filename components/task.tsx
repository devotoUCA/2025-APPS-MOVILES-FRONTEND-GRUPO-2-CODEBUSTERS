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
  deadline?: string | null;
}

const Task: React.FC<TaskProps> = ({ titulo, tipo, completada, onToggle, onEliminar, deadline }) => {
  const categoryConfig = CATEGORIAS_CONFIG[tipo];
  const swipeableRef = React.useRef<Swipeable>(null);

  // Calcular si está vencida o próxima a vencer
  const getDeadlineInfo = () => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const isOverdue = diffMs < 0;
    const isUrgent = diffHours > 0 && diffHours <= 24;
    
    const formatDate = () => {
      const day = deadlineDate.getDate().toString().padStart(2, '0');
      const month = (deadlineDate.getMonth() + 1).toString().padStart(2, '0');
      const hours = deadlineDate.getHours().toString().padStart(2, '0');
      const minutes = deadlineDate.getMinutes().toString().padStart(2, '0');
      return `${day}/${month} ${hours}:${minutes}`;
    };
    
    return {
      isOverdue,
      isUrgent,
      formatted: formatDate()
    };
  };

  const deadlineInfo = getDeadlineInfo();

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
          <Text style={styles.actionText}>Completa</Text>
        </RectButton>
      </Animated.View>
    );
  };

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
        <View style={[styles.iconContainer, { backgroundColor: categoryConfig.colorClaro }]}>
          {categoryConfig.libreria === "FontAwesome" && (
            <FontAwesome name={categoryConfig.icon as any} size={22} color="#FFF" />
          )}
          {categoryConfig.libreria === "MaterialCommunityIcons" && (
            <MaterialCommunityIcons name={categoryConfig.icon as any} size={26} color="#FFF" />
          )}
        </View>

        <View style={styles.taskContent}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {titulo}
          </Text>
          <View style={styles.metadataRow}>
            <Text style={styles.taskCategory}>{tipo}</Text>
            {deadlineInfo && (
              <View style={styles.deadlineBadge}>
                <FontAwesome 
                  name="clock-o" 
                  size={10} 
                  color="#FFF" 
                  style={{ marginRight: 4 }} 
                />
                <Text style={styles.deadlineText}>
                  {deadlineInfo.formatted}
                </Text>
              </View>
            )}
          </View>
        </View>

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
    minHeight: 85,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginBottom: 6,
    lineHeight: 22,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taskCategory: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
  deadlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deadlineText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
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