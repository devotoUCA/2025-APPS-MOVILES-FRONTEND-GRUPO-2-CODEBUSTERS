import API_CONFIG from '@/config/api';
import { logout, updatePlayerData } from "@/redux/actions/authActions";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Option = { label: string; value: string };

const GARDEN_OPTIONS: Option[] = [
  { label: "Jungle", value: "jungle" },
  { label: "Peach", value: "peach" },
  { label: "Valley", value: "valley" },
];

function OptionPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? "";

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputLike}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.inputLikeText}>{current || "Elegir..."}</Text>
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}></Pressable>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[ styles.optionRow, item.value === value && styles.optionRowActive ]}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={[ styles.optionText, item.value === value && styles.optionTextActive ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalClose} onPress={() => setOpen(false)}>
            <Text style={styles.modalCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { player } = useSelector((state: any) => state.auth);
  
  const [jardin, setJardin] = useState<string>(player?.current_garden?.garden_name || "jungle");

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que querés salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => {
            dispatch(logout() as any);
          },
        },
      ]
    );
  };

  const handleGardenChange = async (newGardenName: string) => {
    if (!player) return;

    if (newGardenName === jardin) return;

    Alert.alert(
      "⚠️ Cambiar de jardín",
      `Al cambiar a ${newGardenName.toUpperCase()}, el jardín volverá al nivel 1 con 0/3 de progreso.\n\n¿Continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cambiar",
          style: "default",
          onPress: async () => {
            try {
              const response = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/garden`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gardenName: newGardenName }),
              });

              if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error al guardar el jardín');
              }

              const data = await response.json();
              if (data.success) {
                dispatch(updatePlayerData(data.player) as any);
                setJardin(data.player.current_garden.garden_name);
                Alert.alert("✅ Jardín actualizado", `Has cambiado a ${newGardenName.toUpperCase()} nivel 1.`);
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo cambiar el jardín.");
            }
          }
        }
      ]
    );
  };


  const saveLevelToBackend = async (newLevel: number, activeGardenId: number, progressValue: number) => {
    try {
      const responseLvl = await fetch(`${API_CONFIG.BASE_URL}/garden/player/${player.player_id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel, gardenId: activeGardenId, progress: progressValue }),
      });
      if (!responseLvl.ok) throw new Error("Error al resetear");
      
      const data = await responseLvl.json();
      dispatch(updatePlayerData(data.player) as any);
      Alert.alert("✅ Progreso Reiniciado", "Tu jardín actual ha vuelto al Nivel 1.");
    } catch (error: any) {
      Alert.alert("Error", "No se pudo resetear el progreso.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      <View style={styles.infoSection}>
        {player?.player_name && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Nombre:</Text>
            <Text style={styles.userInfoText}>{player.player_name}</Text>
          </View>
        )}

        {player?.email && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoText}>{player.email}</Text>
          </View>
        )}
      </View>

      <OptionPicker
        label="Tipo de jardín"
        value={jardin}
        options={GARDEN_OPTIONS}
        onChange={handleGardenChange} 
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  userInfo: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#00FFAA40",
  },
  userInfoLabel: {
    color: "#00FFAA",
    fontSize: 12,
    marginBottom: 4,
  },
  userInfoText: {
    color: "#FFF",
    fontSize: 16,
  },
  label: {
    color: "#FFF",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#222",
    borderColor: "#00FFAA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#FFF",
    height: 48,
  },
  inputLike: {
    backgroundColor: "#222",
    borderColor: "#00FFAA",
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  inputLikeText: {
    color: "#FFF",
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "25%",
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00FFAA",
    padding: 14,
  },
  modalTitle: {
    color: "#00FFAA",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "center",
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionRowActive: {
    backgroundColor: "#0b2e25",
    borderWidth: 1,
    borderColor: "#00FFAA",
  },
  optionText: {
    color: "#FFF",
    fontSize: 16,
  },
  optionTextActive: {
    color: "#00FFAA",
    fontWeight: "600",
  },
  separator: {
    height: 8,
  },
  modalClose: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00FFAA",
  },
  modalCloseText: {
    color: "#00FFAA",
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#cd312eff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  resetBtn: {
    marginTop: 12,
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  infoSection: {
    marginTop: 30,
    marginBottom: 10,
  },
});