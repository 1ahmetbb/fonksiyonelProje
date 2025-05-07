import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, useBackButton = false }) {
  const navigation = useNavigation();

  const handleLeftButtonPress = () => {
    if (useBackButton) {
      navigation.goBack(); // Geri git
    } else if (navigation.openDrawer) {
      navigation.openDrawer(); // Drawer aç
    }
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={handleLeftButtonPress}
        style={styles.menuButton}
      >
        <Ionicons
          name={useBackButton ? "arrow-back" : "menu"}
          size={30}
          color="black"
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity
        onPress={handleNotificationPress}
        style={styles.notificationButton}
      >
        <Ionicons name="notifications-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  menuButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  notificationButton: {
    padding: 10,
  },
});
