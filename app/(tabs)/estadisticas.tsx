import SimpleLineChart from '@/components/SimpleLineChart';
import { useTaskHistory } from '@/hooks/useTaskHistory';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

const CATEGORIAS_ICONS = {
  "Productividad": { icon: "briefcase", libreria: "FontAwesome", color: "#4a90e2" },
  "Alimentación": { icon: "cutlery", libreria: "FontAwesome", color: "#f5a623" },
  "Ejercicio": { icon: "heartbeat", libreria: "FontAwesome", color: "#d0021b" },
  "SaludMental": { icon: "yoga", libreria: "MaterialCommunityIcons", color: "#9013fe" },
} as const;

const Estadisticas: React.FC = () => {
  const { history, loading, refetch } = useTaskHistory();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Refrescar datos cada vez que la pantalla gana foco
      refetch();
    }, [])
  );
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`
    };
  };

  const totalCompleted = history.tasks.length;
  const totalToday = Object.entries(history.summary)
    .filter(([date]) => {
      const today = new Date().toISOString().split('T')[0];
      return date === today;
    })
    .reduce((sum, [, count]) => sum + count, 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00FFAA" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FFAA"
            colors={["#00FFAA"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <FontAwesome name="line-chart" size={28} color="#00FFAA" />
        </View>

        {/* Cards de resumen */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { borderColor: '#00FFAA' }]}>
            <FontAwesome name="check-circle" size={32} color="#00FFAA" />
            <Text style={styles.summaryValue}>{totalCompleted}</Text>
            <Text style={styles.summaryLabel}>Total Completadas</Text>
          </View>

          <View style={[styles.summaryCard, { borderColor: '#4a90e2' }]}>
            <FontAwesome name="calendar-check-o" size={32} color="#4a90e2" />
            <Text style={styles.summaryValue}>{totalToday}</Text>
            <Text style={styles.summaryLabel}>Hoy</Text>
          </View>
        </View>

        {/* Gráfico */}
        <SimpleLineChart data={history.summary} />

        {/* Historial */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={styles.historyTitle}>Historial Completo</Text>
            <View style={styles.historyBadge}>
              <Text style={styles.historyBadgeText}>{history.tasks.length}</Text>
            </View>
          </View>

          {history.tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="inbox" size={64} color="#333" />
              <Text style={styles.emptyText}>No hay tareas completadas</Text>
              <Text style={styles.emptySubtext}>¡Completa tu primera tarea!</Text>
            </View>
          ) : (
            <FlatList
              data={history.tasks}
              scrollEnabled={false}
              keyExtractor={(item) => item.task_id.toString()}
              renderItem={({ item }) => {
                const categoryInfo = CATEGORIAS_ICONS[item.tipo as keyof typeof CATEGORIAS_ICONS] || CATEGORIAS_ICONS.Productividad;
                const { date, time } = formatDate(item.completed_at);

                return (
                  <View style={styles.historyItem}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryInfo.color }]}>
                      {categoryInfo.libreria === "FontAwesome" && (
                        <FontAwesome 
                          name={categoryInfo.icon as any} 
                          size={18} 
                          color="#FFF" 
                        />
                      )}
                      {categoryInfo.libreria === "MaterialCommunityIcons" && (
                        <MaterialCommunityIcons 
                          name={categoryInfo.icon as any} 
                          size={22} 
                          color="#FFF" 
                        />
                      )}
                    </View>
                    
                    <View style={styles.historyContent}>
                      <Text style={styles.historyTaskTitle} numberOfLines={1}>
                        {item.titulo}
                      </Text>
                      <View style={styles.historyMetadata}>
                        <FontAwesome name="calendar" size={11} color="#666" />
                        <Text style={styles.historyDate}>{date}</Text>
                        <FontAwesome name="clock-o" size={11} color="#666" style={{ marginLeft: 12 }} />
                        <Text style={styles.historyTime}>{time}</Text>
                      </View>
                    </View>

                    <View style={styles.checkmarkContainer}>
                      <FontAwesome name="check" size={16} color="#00FFAA" />
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={styles.historyList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  historyBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  historyBadgeText: {
    color: '#00FFAA',
    fontSize: 14,
    fontWeight: '700',
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyContent: {
    flex: 1,
  },
  historyTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 6,
  },
  historyMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
    marginTop: 8,
  },
});

export default Estadisticas;