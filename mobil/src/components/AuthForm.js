import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Modal,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import Input from "./Input";
  import Button from "./Button";
  import { Ionicons } from "@expo/vector-icons";
  
  // Backend'deki enum değerleri
  const ROLES = [
    { label: "User", value: "user" },
    { label: "Developer", value: "developer" },
    { label: "Team Lead", value: "teamLead" },
    { label: "Admin", value: "admin" },
  ];
  
  const TITLES = [
    "Frontend Developer",
    "Backend Developer",
    "Mobile Developer",
    "Team Lead",
    "Project Manager",
  ];
  
  export default function AuthForm({ isLogin, onSubmit, credentialIsInValid }) {
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
    const [enteredName, setEnteredName] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
  
    const {
      email: emailIsInvalid,
      confirmEmail: emailsDontMatch,
      password: passwordIsInvalid,
      confirmPassword: passwordsDontMatch,
    } = credentialIsInValid;
  
    function submitHandler() {
      onSubmit({
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
        confirmPassword: enteredConfirmPassword,
        name: enteredName,
        title: selectedTitle,
        role: selectedRole,
      });
    }
  
    function updateInput(inputType, enteredValue) {
      switch (inputType) {
        case "email":
          setEnteredEmail(enteredValue);
          break;
        case "password":
          setEnteredPassword(enteredValue);
          break;
        case "confirmEmail":
          setEnteredConfirmEmail(enteredValue);
          break;
        case "confirmPassword":
          setEnteredConfirmPassword(enteredValue);
          break;
        case "name":
          setEnteredName(enteredValue);
          break;
      }
    }
  
    return (
      <View>
        {!isLogin && (
          <>
            <Input
              label="Ad Soyad"
              onUpdateValue={updateInput.bind(this, "name")}
              value={enteredName}
            />
  
            <View style={styles.selectionRow}>
              <View style={styles.selectionHalf}>
                <TouchableOpacity
                  style={styles.selectionButton}
                  onPress={() => setShowTitleModal(true)}
                >
                  <Text style={styles.selectionButtonText}>
                    {selectedTitle || "Unvan Seçin"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
  
              <View style={styles.selectionHalf}>
                <TouchableOpacity
                  style={styles.selectionButton}
                  onPress={() => setShowRoleModal(true)}
                >
                  <Text style={styles.selectionButtonText}>
                    {ROLES.find((role) => role.value === selectedRole)?.label ||
                      "Rol Seçin"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
  
        <Input
          label="Email"
          keyboardType="email-address"
          onUpdateValue={updateInput.bind(this, "email")}
          value={enteredEmail}
          isInvalid={emailIsInvalid}
        />
  
        {!isLogin && (
          <Input
            label="Emaili Doğrula"
            keyboardType="email-address"
            onUpdateValue={updateInput.bind(this, "confirmEmail")}
            value={enteredConfirmEmail}
            isInvalid={emailsDontMatch}
          />
        )}
  
        <Input
          label="Şifre"
          secure
          onUpdateValue={updateInput.bind(this, "password")}
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
  
        {!isLogin && (
          <Input
            label="Şifreyi Doğrula"
            secure
            onUpdateValue={updateInput.bind(this, "confirmPassword")}
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
  
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? "Giriş Yap" : "Kaydol"}
          </Button>
        </View>
  
        <Modal visible={showTitleModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Unvan Seçin</Text>
                <TouchableOpacity onPress={() => setShowTitleModal(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {TITLES.map((title) => (
                  <TouchableOpacity
                    key={title}
                    style={[
                      styles.modalItem,
                      selectedTitle === title && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setSelectedTitle(title);
                      setShowTitleModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedTitle === title && styles.selectedItemText,
                      ]}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
  
        <Modal visible={showRoleModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Rol Seçin</Text>
                <TouchableOpacity onPress={() => setShowRoleModal(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.modalItem,
                      selectedRole === role.value && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setSelectedRole(role.value);
                      setShowRoleModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedRole === role.value && styles.selectedItemText,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    buttons: {
      marginTop: 10,
    },
    selectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginVertical: 8,
    },
    selectionHalf: {
      flex: 1,
    },
    selectionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      backgroundColor: "#E0E0E0",
      borderRadius: 10,
    },
    selectionButtonText: {
      fontSize: 16,
      color: "#424242",
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "50%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    selectedItem: {
      backgroundColor: "#F5F5F5",
    },
    modalItemText: {
      fontSize: 16,
      color: "#424242",
    },
    selectedItemText: {
      color: "#007AFF",
      fontWeight: "500",
    },
  });
  