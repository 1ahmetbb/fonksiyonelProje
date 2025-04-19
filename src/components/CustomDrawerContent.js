import React from "react";
import { View, Image, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: "#F8F9FA" },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/BeraLogo-1.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.menuContainer}>
          <DrawerItemList
            {...props}
            state={{
              ...props.state,
            }}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoWrapper: {
    alignItems: "center",
    paddingVertical: 5,
  },
  logo: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  menuContainer: {
    flex: 1,
    paddingTop: 0,
  },
  settingsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
