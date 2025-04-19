import React, { useEffect, useState } from "react";
import DrawerNavigator from "./DrawerNavigator";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import EditUserScreen from "../screens/EditUserScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AfterAuthenticationStack() {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{ headerShown: false }}
        />
      </>
    </Stack.Navigator>
  );
}

return authState.isAuthenticated ? (
  <AfterAuthenticationStack role={authState.role} />
) : (
  <RootStack />
);

export default function StackNavigator() {
  return <Navigation />;
}
