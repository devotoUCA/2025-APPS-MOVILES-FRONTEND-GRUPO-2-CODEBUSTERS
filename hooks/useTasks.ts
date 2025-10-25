import { TipoTarea } from '@/components/task';
import API_CONFIG from '@/config/api';
import { useEffect, useState } from 'react';

interface Task {
  task_id: number;
  player_id: number;
  titulo: string;
  tipo: TipoTarea;
  completed_flag: boolean;
  eliminated_flag: boolean;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (titulo: string, tipo: TipoTarea) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo, tipo })
    });
    const newTask = await response.json();
    setTasks([newTask, ...tasks]);
    return newTask;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, addTask, fetchTasks };
};