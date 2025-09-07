import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador</Text>
      <Text style={styles.counter}>{count}</Text>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.increment]} onPress={() => setCount(count + 1)}>
          <Text style={styles.buttonText}>Incrementar</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.decrement]} onPress={() => setCount(count - 1)}>
          <Text style={styles.buttonText}>Decrementar</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.reset]} onPress={() => setCount(0)}>
          <Text style={styles.buttonText}>Resetear</Text>
        </Pressable>
      </View>
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
    marginBottom: 20,
  },
  counter: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1e3d4e",
  },
  buttonRow: {
    width: "80%",
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  increment: {
    backgroundColor: "#4caf50",
  },
  decrement: {
    backgroundColor: "#f44336",
  },
  reset: {
    backgroundColor: "#2196f3",
  },
});
