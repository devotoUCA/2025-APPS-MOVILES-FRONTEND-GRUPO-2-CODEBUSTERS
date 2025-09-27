import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TipoTarea = 'Productividad' | 'Alimentación' | 'Ejercicio' | 'SaludMental';

interface TaskProps {
  titulo: string;
  tipo: TipoTarea; // se conserva para lógica, pero no afecta el color
  completada: boolean;
  onToggle: () => void;
  onEliminar: () => void;
}

const Task: React.FC<TaskProps> = ({ titulo, completada, onToggle, onEliminar }) => {
  return (
    <View style={[styles.container]}>
      {/* Texto de la tarea, clickable para marcar completada */}
      <TouchableOpacity style={styles.textContainer} onPress={onToggle}>
        <Text style={[styles.texto, completada && styles.textoCompletado]}>
          {titulo}
        </Text>
      </TouchableOpacity>

      {/* Botón de eliminar */}
      <TouchableOpacity style={styles.botonEliminar} onPress={onEliminar}>
        <Text style={styles.textoEliminar}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#00FFAA', // color fijo para todas las tareas
  },
  textContainer: { flex: 1 },
  texto: {
    fontSize: 16,
    color: '#000', // negro para contraste con fondo verde
  },
  textoCompletado: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  botonEliminar: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  textoEliminar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Task;
