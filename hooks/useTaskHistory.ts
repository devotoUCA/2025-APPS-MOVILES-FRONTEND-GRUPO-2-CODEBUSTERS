import API_CONFIG from '@/config/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export interface CompletedTask {
  task_id: number;
  titulo: string;
  tipo: string;
  completed_at: string;
}

export interface TaskHistory {
  tasks: CompletedTask[];
  summary: { [key: string]: number };
}

export const useTaskHistory = () => {
  const [history, setHistory] = useState<TaskHistory>({ tasks: [], summary: {} });
  const [loading, setLoading] = useState(true);
  
  const playerId = useSelector((state: any) => state.auth.player?.player_id);

  const fetchHistory = async () => {
    if (!playerId) {
      setHistory({ tasks: [], summary: {} });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/stats/history/${playerId}`);
      if (!response.ok) throw new Error('Error al cargar historial');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [playerId]);

  return { history, loading, refetch: fetchHistory };
};