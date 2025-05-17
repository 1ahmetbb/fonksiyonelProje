import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const StatusSelector = ({ value, options, onChange, title }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectorButtonText}>
          {options.find((opt) => opt.value === value)?.label}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  value === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const TeamSelector = ({ selectedTeam, teamMembers, onTeamChange }) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeTeamIds = () => {
    if (!Array.isArray(selectedTeam)) return [];
    return selectedTeam
      .map((member) =>
        typeof member === "object" && member?._id ? member._id : member
      )
      .filter((id) => id);
  };

  const selectedTeamIds = normalizeTeamIds();

  const isMemberSelected = (memberId) => selectedTeamIds.includes(memberId);

  const toggleMemberSelection = (memberId) => {
    const updatedTeam = isMemberSelected(memberId)
      ? selectedTeamIds.filter((id) => id !== memberId)
      : [...selectedTeamIds, memberId];
    onTeamChange(updatedTeam);
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectorButtonText}>
          {selectedTeamIds.length > 0
            ? `${selectedTeamIds.length} members selected`
            : "Select team members"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team Members</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TouchableOpacity
                  key={member._id}
                  style={[
                    styles.optionItem,
                    isMemberSelected(member._id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleMemberSelection(member._id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isMemberSelected(member._id) && styles.selectedOptionText,
                    ]}
                  >
                    {member.name} - {member.title || member.role || "Üye"}
                  </Text>
                  {isMemberSelected(member._id) && (
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>Sonuç bulunamadı</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const TaskForm = ({
  title,
  setTitle,
  description,
  setDescription,
  stage,
  setStage,
  priority,
  setPriority,
  date,
  setDate,
  onSubmit,
  submitButtonText,
  isEditing = false,
  onBack,
  onDelete,
  team,
  setTeam,
  teamMembers,
  isAdmin = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const stageOptions = [
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in progress" },
    { label: "Completed", value: "completed" },
  ];

  const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Normal", value: "normal" },
    { label: "Low", value: "low" },
  ];

  const handleSubmit = () => onSubmit();

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleDelete = () => {
    Alert.alert("Görevi Sil", "Bu görevi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", onPress: onDelete, style: "destructive" },
    ]);
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Task description"
          multiline
          numberOfLines={4}
        />

        <View style={styles.rowContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Status</Text>
            <StatusSelector
              value={stage}
              options={stageOptions}
              onChange={setStage}
              title="Select Status"
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Priority</Text>
            <StatusSelector
              value={priority}
              options={priorityOptions}
              onChange={setPriority}
              title="Select Priority"
            />
          </View>
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString("en-US")}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        {isAdmin && (
          <>
            <Text style={styles.label}>Team Members</Text>
            <TeamSelector
              selectedTeam={team}
              teamMembers={teamMembers}
              onTeamChange={setTeam}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{submitButtonText}</Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  selectedOption: {
    backgroundColor: "#E0F7FA",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  searchInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});

export default TaskForm;
