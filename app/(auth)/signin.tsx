import { login, register } from "@/redux/actions/authActions";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function SignInScreen() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert("Error", "Por favor completá todos los campos");
      return;
    }

    if (isSignUp) {
      dispatch(register(email, password, name) as any);
    } else {
      dispatch(login(email, password) as any);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌱</Text>
          <Text style={styles.title}>MindGarden</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? "Creá tu cuenta" : "Bienvenido de nuevo"}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isSignUp && (
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#777"
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Cargando..." : (isSignUp ? "Registrarse" : "Iniciar Sesión")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {isSignUp 
                ? "¿Ya tenés cuenta? Iniciá sesión" 
                : "¿No tenés cuenta? Registrate"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    color: "#00FFAA",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: "100%",
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
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00FFAA",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  toggleText: {
    color: "#FFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
});