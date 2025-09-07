import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type CardProps = {
  text: string;
};

const Tarjeta = ({ text }: CardProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: isActive ? "#1e3d4e" : "#7a7a7a" },
      ]}
      onPress={() => setIsActive(!isActive)}
    >
      <Text
        style={[
          styles.cardText,
          { color: isActive ? "#fff" : "#ddd" },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};
export default Tarjeta;

const styles = StyleSheet.create({
  card: {
    width: "80%",
    height: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
