// hooks/useTasks.ts (CÓDIGO COMPLETO Y CORREGIDO)

import { TipoTarea } from '@/components/task';
import API_CONFIG from '@/config/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // 1. Importa useSelector

export interface Task {
  task_id: number;
  player_id: number;
  titulo: string;
  tipo: TipoTarea;
  completed_flag: boolean;
  eliminated_flag: boolean;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // 2. Lee el 'player' (como en settings.tsx)
  const playerId = useSelector((state: any) => state.auth.player?.player_id);

  useEffect(() => {
    console.log("Hooks useTasks: El playerId actual es:", playerId);
  }, [playerId]);

  const fetchTasks = async () => {
    if (!playerId) {
      setTasks([]);
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks?playerId=${playerId}`);
      if (!response.ok) throw new Error('Error al cargar tareas');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error en fetchTasks:', error);
    }
  };

  const addTask = async (titulo: string, tipo: TipoTarea) => {
    if (!playerId) {
        console.error("Error: No se puede agregar tarea, playerId es undefined.");
        return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 3. ✅ ¡AQUÍ ESTÁ LA CORRECCIÓN!
        //    Envía el playerId al backend
        body: JSON.stringify({ titulo, tipo, playerId }),
      });
      if (!response.ok) {
         throw new Error('Error al crear tarea');
      }
      
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;

    } catch (error) {
       console.error("Error en addTask:", error); // Esto es lo que ves en tu log
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error en el servidor al eliminar la tarea');
      }
      setTasks((prevTasks) => prevTasks.filter(task => task.task_id !== taskId));
    } catch (error) {
      console.error("Error en deleteTask:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [playerId]); 

  return { tasks, addTask, fetchTasks, deleteTask };
};