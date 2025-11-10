// app/(tabs)/agenda.tsx (CÓDIGO COMPLETO Y CORREGIDO)

import Task, { TipoTarea } from "@/components/task";
import API_CONFIG from '@/config/api';
import { useTasks } from "@/hooks/useTasks";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';
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

  if (!inventoryContext) return null;
  const { inventory, setInventory } = inventoryContext;

  const agregarTarea = async () => {
    if (input.trim() === "") return;
    await addTask(input, tipo);
    setInput("");
  };

  // 1. Esta función es para COMPLETAR (da recompensa)
  const handleTaskCompletion = async (id: number) => { 
    console.log("Iniciando handleTaskCompletion (con recompensa)...");

    const taskExists = tasks.find(t => t.task_id === id);
    if (!taskExists) return;

    if (!player || !player.player_id) {
      console.error("¡ERROR FATAL! No hay 'player.player_id' en Redux.");
      return;
    }

    const consumibles = [
      { id: 1, name: "agua", image: require("../../assets/Consumables/water.png") },
      { id: 2, name: "polvo", image: require("../../assets/Consumables/bone_powder.png") },
      { id: 3, name: "fertilizante", image: require("../../assets/Consumables/fertilizer.png") }
    ];
    const random = consumibles[Math.floor(Math.random() * consumibles.length)];

    // 2. ✅ ¡AQUÍ ESTÁ LA CORRECCIÓN!
    //    El 'catch (error)' ahora está escrito correctamente.
    try {
      console.log(`Enviando +1 de '${random.name}' (ID: ${random.id}) al backend...`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumableId: random.id, quantity: 1 }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error del backend al dar recompensa');
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

      Alert.alert("¡Tarea completada!", `Has recibido un consumible: ${random.name}`);
      
      deleteTask(id);

    } catch (error: any) { // <- 'error' (sin la S)
      console.error("Error en handleTaskCompletion:", error.message || error);
      Alert.alert("Error", "No se pudo completar la tarea. Revisa la consola.");
    }
  };

  // 3. Esta función es para BORRAR (sin recompensa)
  const handleTaskDelete = async (id: number) => {
    console.log("Iniciando handleTaskDelete (sin recompensa)...");
    await deleteTask(id);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.inputContainer}>
         <TextInput
          style={styles.input}
          placeholder="Escribe una nueva tarea..."
          placeholderTextColor="#777"
          value={input}
          onChangeText={setInput}
        />
        <View style={styles.selectorCategoria}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat.tipo}
              style={[
                styles.iconoCategoria,
                tipo === cat.tipo && { backgroundColor: cat.color, borderColor: "#FFF" },
              ]}
              onPress={() => setTipo(cat.tipo)}
            >
              {cat.libreria === "FontAwesome" && (
                <FontAwesome name={cat.icon as any} size={20} color="#FFF" />
              )}
              {cat.libreria === "MaterialCommunityIcons" && (
                <MaterialCommunityIcons name={cat.icon as any} size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarTarea}>
          <Text style={styles.textoBoton}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

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
      />
    </View>
  );
};

// --- Estilos (sin cambios) ---
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, backgroundColor: "#121212" },
  inputContainer: { paddingHorizontal: 20, marginBottom: 20 },
  input: {
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 15,
  },
  selectorCategoria: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  iconoCategoria: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderWidth: 2,
    borderColor: "transparent",
  },
  botonAgregar: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#00FFAA",
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: { color: "#000", fontWeight: "bold", fontSize: 16 },
});

export default Agenda;