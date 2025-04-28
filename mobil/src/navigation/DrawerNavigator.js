import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import TeamScreen from "../screens/TeamScreen";
import TrashScreen from "../screens/TrashScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationScreen from "../screens/NotificationScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const role = useSelector((state) => state.auth.role);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#007AFF",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          drawerLabel: "Bildirimler",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          drawerLabel: "Tasks",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      {role == "admin" && (
        <Drawer.Screen
          name="Team"
          component={TeamScreen}
          options={{
            drawerLabel: "Team",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      )}
      <Drawer.Screen
        name="Trash"
        component={TrashScreen}
        options={{
          drawerLabel: "Trash",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trash-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
