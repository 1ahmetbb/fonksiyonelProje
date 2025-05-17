import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { useAddTaskMutation } from "../redux/slice/api/taskApiSlice";
import { useGetTeamListQuery } from "../redux/slice/api/authApiSlice";
import TaskForm from "../components/TaskForm";
import Loading from "../components/Loading";
import { handleApiError, handleValidationError } from "../util/errorHandlers";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

export default function AddTaskScreen({ navigation }) {
  // Redux'tan kullanıcı rolünü al
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "admin";

  const [addTask] = useAddTaskMutation();
  // Admin değilse team query'i atla
  const { data: teamMembers = [], isLoading: isLoadingTeam } =
    useGetTeamListQuery(undefined, {
      skip: !isAdmin,
    });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("todo");
  const [priority, setPriority] = useState("normal");
  const [date, setDate] = useState(new Date());
  const [team, setTeam] = useState([]);

  const handleAdd = async () => {
    if (!title.trim()) {
      handleValidationError({ title: true }, "AddTaskScreen.handleAdd");
      return;
    }

    try {
      // Oluşturulacak görev verisi
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        stage,
        priority,
        date: date.toISOString(),
      };

      // Sadece admin ise team bilgisini ekle
      if (isAdmin) {
        taskData.team = team;
      }

      await addTask(taskData).unwrap();

      Alert.alert("Başarılı", "Görev başarıyla eklendi!", [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      handleApiError(error, "AddTaskScreen.handleAdd");
    }
  };

  // Sadece yükleme admin ise ve takım üyeleri yükleniyorsa bekleme göster
  if (isAdmin && isLoadingTeam) {
    return <Loading message="Ekip üyeleri yükleniyor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Görev Ekle" useBackButton={true} />
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
          teamMembers={teamMembers}
          onSubmit={handleAdd}
          submitButtonText="Add Task"
          onBack={() => navigation.goBack()}
          isAdmin={isAdmin} // Admin rolünü TaskForm'a ilet
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerWrapper: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectorButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#F2F2F7",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
