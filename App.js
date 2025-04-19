import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StackNavigator from "./src/navigation/StackNavigator";


export default function App() {
  return (
    <View style={styles.container}>
      <Text>App.js</Text>
      <StatusBar style="auto" />
    </View>
  );
}



