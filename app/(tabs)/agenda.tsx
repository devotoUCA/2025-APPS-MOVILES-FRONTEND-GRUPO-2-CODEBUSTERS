import Task, { TipoTarea } from "@/components/task";
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskItem {
  id: string;
  titulo: string;
  tipo: TipoTarea;
}

const Agenda: React.FC = () => {
  const [tareas, setTareas] = useState<TaskItem[]>([]);
  const [input, setInput] = useState<string>('');
  const [tipo, setTipo] = useState<TipoTarea>('Productividad');

  const agregarTarea = () => {
    if (input.trim() === '') return;
    const nuevaTarea: TaskItem = {
      id: Date.now().toString(),
      titulo: input,
      tipo,
    };
    setTareas([...tareas, nuevaTarea]);
    setInput('');
  };

  const eliminarTarea = (id: string) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Input y Picker */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea"
          placeholderTextColor="#AAA"
          value={input}
          onChangeText={setInput}
        />

        <View style={styles.input}>
          <Picker
            selectedValue={tipo}
            style={styles.picker}
            dropdownIconColor="#00FFAA"
            onValueChange={(itemValue) => setTipo(itemValue as TipoTarea)}
          >
            <Picker.Item label="Productividad" value="Productividad" />
            <Picker.Item label="Alimentación" value="Alimentación" />
            <Picker.Item label="Ejercicio" value="Ejercicio" />
            <Picker.Item label="Salud Mental" value="SaludMental" />
          </Picker>
        </View>

        {/* Botón “Agregar” estilizado */}
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarTarea}>
          <Text style={styles.textoBoton}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task
            titulo={item.titulo}
            tipo={item.tipo}
            completada={false}
            onToggle={() => eliminarTarea(item.id)}
            onEliminar={() => eliminarTarea(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00FFAA',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginRight: 5,
    color: '#FFF',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  picker: {
    color: '#FFF',
    height: 50,
    width: '100%',
  },
  botonAgregar: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#00FFAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Agenda;
