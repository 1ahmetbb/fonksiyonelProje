import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

export default function Input({
  label,
  keyboardType,
  onUpdateValue,
  value,
  secure,
  isInvalid,
  editable = true,
  placeholder = "",
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          isInvalid && styles.inputInvalid,
          !editable && styles.disabledInput,
        ]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        onChangeText={onUpdateValue}
        value={value}
        secureTextEntry={secure}
        editable={editable}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "#424242",
    marginBottom: 3,
  },
  labelInvalid: {
    color: "red",
  },
  input: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  inputInvalid: {
    borderColor: "red",
    borderWidth: 1,
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#777",
  },
});
