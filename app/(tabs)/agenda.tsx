import Task, { TipoTarea } from "@/components/task";
import { useTasks } from "@/hooks/useTasks";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { InventoryContext } from "./InventoryContext";

const CATEGORIAS = [
  { tipo: "Productividad", icon: "briefcase", libreria: "FontAwesome", color: "#4a90e2" },
  { tipo: "Alimentación", icon: "cutlery", libreria: "FontAwesome", color: "#f5a623" },
  { tipo: "Ejercicio", icon: "heartbeat", libreria: "FontAwesome", color: "#d0021b" },
  { tipo: "SaludMental", icon: "yoga", libreria: "MaterialCommunityIcons", color: "#9013fe" },
] as const;

const Agenda: React.FC = () => {
  const { tasks, addTask } = useTasks();
  const [input, setInput] = useState("");
  const [tipo, setTipo] = useState<TipoTarea>("Productividad");
  const inventoryContext = useContext(InventoryContext);

  if (!inventoryContext) return null;
  const { inventory, setInventory } = inventoryContext;

  const agregarTarea = async () => {
    if (input.trim() === "") return;
    await addTask(input, tipo);
    setInput("");
  };

  const handleTaskCompletion = (id: number) => {
    const consumibles = ["agua", "polvo", "fertilizante"];
    const random = consumibles[Math.floor(Math.random() * consumibles.length)];

    setInventory((prev) =>
      prev.map((item) =>
        item.type === random ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    Alert.alert("¡Tarea completada!", `Has recibido un consumible: ${random}`);
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
            onEliminar={() => console.log("Eliminar tarea", item.task_id)}
          />
        )}
      />
    </View>
  );
};

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
