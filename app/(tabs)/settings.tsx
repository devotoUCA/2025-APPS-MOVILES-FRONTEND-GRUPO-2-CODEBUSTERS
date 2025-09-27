import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

type Option = { label: string; value: string };

const GARDEN_OPTIONS: Option[] = [
  { label: "Jungle", value: "jungle" },
  { label: "Peach", value: "peach" },
  { label: "Valley", value: "valley" },
];

const MODE_OPTIONS: Option[] = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
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

      {/* “Campo” visual */}
      <TouchableOpacity
        style={styles.inputLike}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.inputLikeText}>{current || "Elegir..."}</Text>
      </TouchableOpacity>

      {/* Modal con lista de opciones */}
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* empty to close when tapping outside */}
        </Pressable>

        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{label}</Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionRow,
                  item.value === value && styles.optionRowActive,
                ]}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.value === value && styles.optionTextActive,
                  ]}
                >
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
  const [nombre, setNombre] = useState("Tincho");
  const [jardin, setJardin] = useState<string>("jungle");
  const [modoImagen, setModoImagen] = useState<string>("cover");

  const handleReset = () => {
    Alert.alert(
      "¿Reiniciar progreso?",
      "Esta acción eliminará todos tus datos actuales.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          style: "destructive",
          onPress: () => {
            
            setNombre("Tincho");
            setJardin("jungle");
            setModoImagen("cover");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {}
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Escribí tu nombre"
        placeholderTextColor="#AAA"
      />

      {}
      <OptionPicker
        label="Tipo de jardín"
        value={jardin}
        options={GARDEN_OPTIONS}
        onChange={setJardin}
      />

      <OptionPicker
        label="Modo de imagen"
        value={modoImagen}
        options={MODE_OPTIONS}
        onChange={setModoImagen}
      />

      {/* Reset */}
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetText}>Resetear progreso</Text>
      </TouchableOpacity>

      {}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#00FFAA",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
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

  
  resetBtn: {
    marginTop: 28,
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
