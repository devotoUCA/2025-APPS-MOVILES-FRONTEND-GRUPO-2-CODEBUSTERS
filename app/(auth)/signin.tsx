// app/(auth)/signin.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {
    // Simula login, redirige al jardín principal
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>

      <TextInput placeholder="Email" placeholderTextColor="#777" style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#777" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Log In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    color: "#00FFAA",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 15,
    color: "#FFF",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#00FFAA40",
  },
  button: {
    backgroundColor: "#00FFAA",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleText: {
    color: "#FFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
