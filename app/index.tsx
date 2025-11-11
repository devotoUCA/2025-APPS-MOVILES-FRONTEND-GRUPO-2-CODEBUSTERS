import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AppEntry() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00FFAA" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});