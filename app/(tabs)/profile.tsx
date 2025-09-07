import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ProfileScreen() {
  const [name, setName] = useState("Mateo Devoto");
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    setName(tempName);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.name}>{name}</Text>

      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Cambiar nombre</Text>
      </Pressable>

      {/* Modal para cambiar nombre */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar nombre</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Ingrese nuevo nombre"
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    marginBottom: 20,
    color: "#1e3d4e",
  },
  button: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
});
