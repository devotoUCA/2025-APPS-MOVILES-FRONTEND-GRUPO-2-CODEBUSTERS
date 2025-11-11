import Task, { TipoTarea } from "@/components/task";
import API_CONFIG from '@/config/api';
import { useTasks } from "@/hooks/useTasks";
import { updatePlayerData } from "@/redux/actions/authActions";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from 'react-redux';
import { InventoryContext, InventoryItem } from "../../contexts/InventoryContext";

const CATEGORIAS = [
  { tipo: "Productividad", icon: "briefcase", libreria: "FontAwesome", color: "#4a90e2" },
  { tipo: "Alimentación", icon: "cutlery", libreria: "FontAwesome", color: "#f5a623" },
  { tipo: "Ejercicio", icon: "heartbeat", libreria: "FontAwesome", color: "#d0021b" },
  { tipo: "SaludMental", icon: "yoga", libreria: "MaterialCommunityIcons", color: "#9013fe" },
] as const;

const Agenda: React.FC = () => {
  const { tasks, addTask, deleteTask } = useTasks();
  const [input, setInput] = useState("");
  const [tipo, setTipo] = useState<TipoTarea>("Productividad");
  const inventoryContext = useContext(InventoryContext);
  const { player } = useSelector((state: any) => state.auth); 
  const dispatch = useDispatch();

  if (!inventoryContext) return null;
  const { inventory, setInventory } = inventoryContext;


  const agregarTarea = async () => {
    if (input.trim() === "") return;
    await addTask(input, tipo);
    setInput("");
  };

  const handleTaskCompletion = async (id: number) => { 

    const taskExists = tasks.find(t => t.task_id === id);
    if (!taskExists) return;

    if (!player || !player.player_id) {
      return;
    }

    const consumibles = [
      { id: 1, name: "agua", image: require("../../assets/Consumables/water.png") },
      { id: 2, name: "polvo", image: require("../../assets/Consumables/bone_powder.png") },
      { id: 3, name: "fertilizante", image: require("../../assets/Consumables/fertilizer.png") }
    ];
    const random = consumibles[Math.floor(Math.random() * consumibles.length)];

    try {
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumableId: random.id, quantity: 1 }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error del backend al dar recompensa');
      }

      const data = await response.json();
      
      if (data.success && data.player) {
        dispatch(updatePlayerData(data.player) as any);
      }

      setInventory((prev: InventoryItem[]) => {
        const itemInInventory = prev.find(item => item.id === random.id.toString());
        if (itemInInventory) {
          return prev.map((item) =>
            item.id === random.id.toString() ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [
            ...prev, 
            { id: random.id.toString(), type: random.name, quantity: 1, image: random.image }
          ];
        }
      });

      Alert.alert("¡Tarea completada! 🎉", `Has recibido: ${random.name}`);
      
      deleteTask(id);

    } catch (error: any) {
      Alert.alert("Error", "No se pudo completar la tarea. Revisa la consola.");
    }
  };

  const handleTaskDelete = async (id: number) => {
    await deleteTask(id);
  };


  const categoriaSeleccionada = CATEGORIAS.find(c => c.tipo === tipo);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Tareas</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{tasks.length}</Text>
          </View>
        </View>

        
        <View style={styles.inputSection}>
          <View style={styles.inputWrapper}>
            <FontAwesome name="pencil" size={18} color="#00FFAA" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nueva tarea..."
              placeholderTextColor="#666"
              value={input}
              onChangeText={setInput}
              returnKeyType="done"
              onSubmitEditing={agregarTarea}
            />
          </View>

          
          <View style={styles.categorySelector}>
            {CATEGORIAS.map((cat) => {
              const isSelected = tipo === cat.tipo;
              return (
                <TouchableOpacity
                  key={cat.tipo}
                  style={[
                    styles.categoryButton,
                    isSelected && { 
                      backgroundColor: cat.color,
                      transform: [{ scale: 1.05 }]
                    }
                  ]}
                  onPress={() => setTipo(cat.tipo)}
                  activeOpacity={0.7}
                >
                  {cat.libreria === "FontAwesome" && (
                    <FontAwesome 
                      name={cat.icon as any} 
                      size={20} 
                      color={isSelected ? "#FFF" : cat.color} 
                    />
                  )}
                  {cat.libreria === "MaterialCommunityIcons" && (
                    <MaterialCommunityIcons 
                      name={cat.icon as any} 
                      size={24} 
                      color={isSelected ? "#FFF" : cat.color} 
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: categoriaSeleccionada?.color }]} 
            onPress={agregarTarea}
            activeOpacity={0.8}
          >
            <FontAwesome name="plus" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Agregar Tarea</Text>
          </TouchableOpacity>
        </View>

        
        {tasks.length > 0 && (
          <View style={styles.instructionContainer}>
            <FontAwesome name="hand-o-right" size={14} color="#666" />
            <Text style={styles.instructionText}>
              Desliza para completar y eliminar
            </Text>
          </View>
        )}

        
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.task_id.toString()}
          renderItem={({ item }) => (
            <Task
              titulo={item.titulo}
              tipo={item.tipo}
              completada={item.completed_flag}
              onToggle={() => handleTaskCompletion(item.task_id)}
              onEliminar={() => handleTaskDelete(item.task_id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="check-circle-o" size={64} color="#333" />
              <Text style={styles.emptyText}>No hay tareas pendientes</Text>
              <Text style={styles.emptySubtext}>¡Crea una nueva tarea arriba!</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: "#00FFAA",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 40,
    alignItems: "center",
  },
  headerBadgeText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    paddingVertical: 16,
    fontWeight: "500",
  },
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  instructionText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  emptySubtext: {
    color: "#444",
    fontSize: 14,
    marginTop: 8,
  },
});

export default Agenda;