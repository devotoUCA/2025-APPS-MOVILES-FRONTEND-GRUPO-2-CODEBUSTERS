import Task, { TipoTarea } from "@/components/task";
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskItem {
  id: string;
  titulo: string;
  tipo: TipoTarea;
  completada: boolean;
}

const CATEGORIAS = [
  { tipo: 'Productividad', icon: 'briefcase', libreria: 'FontAwesome', color: '#4a90e2' },
  { tipo: 'Alimentación', icon: 'cutlery', libreria: 'FontAwesome', color: '#f5a623' },
  { tipo: 'Ejercicio', icon: 'heartbeat', libreria: 'FontAwesome', color: '#d0021b' },
  { tipo: 'SaludMental', icon: 'yoga', libreria: 'MaterialCommunityIcons', color: '#9013fe' },
] as const;

const Agenda: React.FC = () => {
  const [tareas, setTareas] = useState<TaskItem[]>([]);
  const [input, setInput] = useState<string>('');
  const [tipo, setTipo] = useState<TipoTarea>('Productividad');

  const agregarTarea = () => {
    if (input.trim() === '') return;
    const nuevaTarea: TaskItem = { id: Date.now().toString(), titulo: input, tipo, completada: false };
    setTareas([nuevaTarea, ...tareas]);
    setInput('');
  };

  const eliminarTarea = (id: string) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  const toggleCompletada = (id: string) => {
    setTareas(tareas.map(t => (t.id === id ? { ...t, completada: !t.completada } : t)));
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
                tipo === cat.tipo && { backgroundColor: cat.color, borderColor: '#FFF' }
              ]}
              onPress={() => setTipo(cat.tipo)}
            >
              {cat.libreria === 'FontAwesome' && (
                <FontAwesome name={cat.icon as any} size={20} color="#FFF" />
              )}
              {cat.libreria === 'MaterialCommunityIcons' && (
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
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task
            titulo={item.titulo}
            tipo={item.tipo}
            completada={item.completada}
            onToggle={() => toggleCompletada(item.id)}
            onEliminar={() => eliminarTarea(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, backgroundColor: '#121212' },
  inputContainer: { paddingHorizontal: 20, marginBottom: 20 },
  input: { backgroundColor: '#2C2C2E', borderWidth: 1, borderColor: '#3A3A3C', borderRadius: 10, paddingHorizontal: 15, height: 50, color: '#FFF', fontSize: 16, marginBottom: 15 },
  selectorCategoria: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  iconoCategoria: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C2C2E', borderWidth: 2, borderColor: 'transparent' },
  botonAgregar: { height: 50, borderRadius: 10, backgroundColor: '#00FFAA', justifyContent: 'center', alignItems: 'center' },
  textoBoton: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

export default Agenda;