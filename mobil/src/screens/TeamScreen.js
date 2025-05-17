import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetTeamListQuery,
  useActivateUserMutation,
  useResetUserPasswordByAdminMutation,
} from "../redux/slice/api/authApiSlice";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { handleApiError } from "../util/errorHandlers";

export default function TeamScreen({ navigation }) {
  const { data: users, isLoading, refetch, error } = useGetTeamListQuery();
  const [activateUser] = useActivateUserMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [resetUserPassword] = useResetUserPasswordByAdminMutation();

  if (isLoading) {
    return <Loading message="Loading users..." />;
  }
  if (error) {
    console.error("Error fetching users:", error);
    return <Text>Error loading users</Text>;
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user) => {
    navigation.navigate("EditUser", { user });
  };

  const handleToggleActive = async (user) => {
    try {
      //console.log("Aktivasyon değişikliği:", user._id, !user.isActive);
      await activateUser({
        id: user._id,
        isActive: !user.isActive,
      }).unwrap();
      refetch();
      Alert.alert(
        "Success",
        `${user.name} ${!user.isActive ? "activated" : "deactivated"}`
      );
    } catch (error) {
      handleApiError(error, "TeamScreen.handleToggleActive");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#FF6B6B";
      case "developer":
        return "#4CAF50";
      case "teamLead":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const handleResetPassword = async (user) => {
    Alert.alert(
      "Şifreyi Sıfırla",
      `${user.name} kullanıcısının şifresi "123123" olarak sıfırlansın mı?`,
      [
        { text: "İptal" },
        {
          text: "Evet",
          onPress: async () => {
            try {
              await resetUserPassword({
                id: user._id,
                password: "123123",
              }).unwrap();
              Alert.alert(
                "Başarılı",
                "Şifre başarıyla 123123 olarak sıfırlandı."
              );
            } catch (error) {
              handleApiError(error, "TeamScreen.handleResetPassword");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item: user }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{user.name}</Text>
        <Text style={styles.memberTitle}>{user.title}</Text>
        <Text style={[styles.memberRole, { color: getRoleColor(user.role) }]}>
          {user.role}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.statusButton, user.isActive && styles.activeButton]}
          onPress={() => handleToggleActive(user)}
        >
          <Ionicons
            name={user.isActive ? "checkmark-circle" : "close-circle"}
            size={24}
            color={user.isActive ? "#4CAF50" : "#FF6B6B"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleResetPassword(user)}
        >
          <Ionicons name="key-outline" size={20} color="#FF9500" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditUser(user)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Team Members" />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role or title..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredUsers?.map((user) => (
          <View key={user._id}>{renderItem({ item: user })}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  memberTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editButton: {
    backgroundColor: "#F2F2F7",
    padding: 8,
    borderRadius: 8,
  },
  statusButton: {
    padding: 4,
  },
  activeButton: {
    backgroundColor: "transparent",
  },
});
