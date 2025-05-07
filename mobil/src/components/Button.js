import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function Button({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#90CAF9",
    paddingVertical: 10,
    borderRadius: 15,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    textAlign: "center",
    color: "#424242",
    fontSize: 16,
    fontWeight: "bold",
  },
});
