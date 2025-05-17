import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function InfoCard({ icon, title, count, color, navigateTo }) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.infoCard,
        { borderLeftColor: color, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => navigation.navigate(navigateTo)}
    >
      <Ionicons name={icon} size={30} color={color} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardCount}>{count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
    maxWidth: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  cardCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginTop: 2,
  },
});
