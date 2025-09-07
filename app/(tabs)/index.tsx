import { StyleSheet, View } from "react-native";
import Tarjeta from "../../components/Tarjeta";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Tarjeta text="Primera tarjeta" />
      <Tarjeta text="Segunda tarjeta" />
      <Tarjeta text="Tercera tarjeta" />
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
});
