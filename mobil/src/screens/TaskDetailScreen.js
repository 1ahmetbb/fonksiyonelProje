import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  useFetchTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteRestoreTaskMutation,
} from "../redux/slice/api/taskApiSlice";
import { useGetTeamListQuery } from "../redux/slice/api/authApiSlice";
import Loading from "../components/Loading";
import TaskForm from "../components/TaskForm";
import { handleApiError } from "../util/errorHandlers";
import { validateTokenAndUser } from "../util/authHelpers";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
export default function TaskDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "admin";
  const [skipTeamQuery, setSkipTeamQuery] = useState(!isAdmin);

  const { data: taskData, isLoading, error } = useFetchTaskByIdQuery(id);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteRestoreTaskMutation();

  const {
    data: teamMembers = [],
    isLoading: isLoadingTeam,
    error: teamError,
    isError: isTeamError,
  } = useGetTeamListQuery(undefined, { skip: skipTeamQuery });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(new Date());
  const [team, setTeam] = useState([]);
  const [hasLoadedTask, setHasLoadedTask] = useState(false);

  // Eğer team query'si hata verirse, erişim devam etsin ama takım boş görünsün
  useEffect(() => {
    if (isTeamError && teamError) {
      console.log("Takım üyeleri yüklenirken hata:", teamError);
      setSkipTeamQuery(true);
    }
  }, [isTeamError, teamError]);

  useEffect(() => {
    if (taskData?.task && !hasLoadedTask) {
      try {
        const task = taskData.task;
        setTitle(task.title || "");
        setDescription(task.description || "");
        setStage(task.stage || "todo");
        setPriority(task.priority || "normal");
        setDate(new Date(task.date || Date.now()));

        if (Array.isArray(task.team)) {
          // Ekip üyelerinin ID'lerini koruyarak geçersiz referansları temizle
          const validTeamMembers = task.team.filter(
            (member) => member && (member._id || typeof member === "string")
          );
          setTeam(validTeamMembers);
        } else {
          setTeam([]);
        }
        setHasLoadedTask(true);
      } catch (e) {
        console.error("Task verisi işlenirken hata:", e);
      }
    }
  }, [taskData, teamMembers, hasLoadedTask]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isValid } = await validateTokenAndUser();
        if (!isValid) {
          navigation.navigate("Login");
        }
      } catch (error) {
        handleApiError(error, "TaskDetailScreen.checkAuth");
      }
    };
    checkAuth();
  }, [navigation]);

  if (isLoading) {
    return <Loading message="Görev yükleniyor..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Görev yüklenirken hata oluştu!</Text>
      </View>
    );
  }

  const handleUpdate = async () => {
    try {
      const updateData = {
        title,
        description,
        stage,
        priority,
        date: date.toISOString(),
      };

      if (isAdmin) {
        updateData.team = team;
      }

      await updateTask({
        id,
        task: updateData,
      }).unwrap();

      Alert.alert("Başarılı", "Görev güncellendi!", [
        {
          text: "Tamam",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      handleApiError(error, "TaskDetailScreen.handleUpdate");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask({ id, actionType: "trash" }).unwrap();
      Alert.alert("Başarılı", "Görev çöp kutusuna taşındı!", [
        {
          text: "Tamam",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      handleApiError(error, "TaskDetailScreen.handleDelete");
    }
  };

  const getMemberById = (memberId) => {
    if (!teamMembers || teamMembers.length === 0) return null;
    if (!memberId) return null;

    const id =
      typeof memberId === "object" && memberId._id ? memberId._id : memberId;

    // Takım üyesini bul
    const foundMember = teamMembers.find((m) => m._id === id);
    // Bulunamadıysa null dön
    return foundMember || null;
  };

  // Ekip üyelerinin isimlerini statik olarak depolayabilecek bir mekanizma
  const getMemberNameById = (memberId) => {
    if (!memberId) return "Bilinmeyen Üye";

    // Önce normal yoldan bulmayı dene
    const foundMember = getMemberById(memberId);
    if (foundMember) {
      return `${foundMember.name} - ${
        foundMember.title || foundMember.role || "Üye"
      }`;
    }

    // Team içinde doğrudan name bilgisi varsa, onu kullan
    if (typeof memberId === "object" && memberId.name) {
      return `${memberId.name} - ${memberId.title || memberId.role || "Üye"}`;
    }

    // Hiçbiri bulunamazsa, ID'nin bir kısmını göster
    return `Bulunamayan Üye (ID: ${
      typeof memberId === "string" ? memberId.substring(0, 8) : "Bilinmiyor"
    }...)`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Görev Detayı" useBackButton={true} />
      <ScrollView style={styles.content}>
        <TaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          stage={stage}
          setStage={setStage}
          priority={priority}
          setPriority={setPriority}
          date={date}
          setDate={setDate}
          team={team}
          setTeam={setTeam}
          teamMembers={teamMembers || []}
          onSubmit={handleUpdate}
          submitButtonText="Güncelle"
          isEditing={true}
          onBack={() => navigation.goBack()}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />

        {team && team.length > 0 && (
          <View style={styles.teamMembersContainer}>
            <Text style={styles.teamMembersTitle}>Ekip Üyeleri:</Text>
            {team.map((member, index) => {
              const memberId = typeof member === "object" ? member._id : member;
              return (
                <View
                  key={`member-${index}-${memberId}`}
                  style={styles.teamMemberItem}
                >
                  <Text
                    style={
                      getMemberById(memberId)
                        ? styles.teamMemberName
                        : styles.teamMemberNotFound
                    }
                  >
                    {getMemberNameById(member)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {!isAdmin && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardText}>
              Ekip üye ataması yapma yetkisine sahip değilsiniz. Sadece admin
              kullanıcılar ekip üyelerini değiştirebilir.
            </Text>
          </View>
        )}

        {isTeamError && isAdmin && (
          <View style={styles.errorCard}>
            <Text style={styles.errorCardText}>
              Ekip üyeleri listesi yüklenemedi. Ancak görev detayları
              görüntülenebilir.
            </Text>
          </View>
        )}

        {isLoadingTeam && !skipTeamQuery && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardText}>Ekip üyeleri yükleniyor...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  teamMembersContainer: {
    marginTop: 16,
    marginBottom: 30,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  teamMembersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  teamMemberItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  teamMemberName: {
    fontSize: 14,
    color: "#333",
  },
  teamMemberNotFound: {
    fontSize: 14,
    color: "#FF3B30",
    fontStyle: "italic",
  },
  errorCard: {
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  errorCardText: {
    color: "#D32F2F",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  infoCardText: {
    color: "#1976D2",
    textAlign: "center",
  },
});
