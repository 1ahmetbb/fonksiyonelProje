import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TaskCard = ({
  task,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddCommit,
  onViewCommits,
}) => {
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.taskCard} onPress={onToggleExpand}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={[styles.taskStatus, getStatusStyle(task.stage)]}>
            {getStatusText(task.stage)}
          </Text>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description || "No description"}
        </Text>

        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>
            {new Date(task.date).toLocaleDateString("en-US")}
          </Text>
          <Text style={[styles.taskPriority, getPriorityStyle(task.priority)]}>
            {getPriorityText(task.priority)}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Text style={styles.actionText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onAddCommit}>
            <Text style={styles.actionText}>Commit Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onViewCommits}>
            <Text style={styles.actionText}>Commitler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case "todo":
      return "To Do";
    case "in progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

const getPriorityText = (priority) => {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    case "normal":
      return "Normal";
    default:
      return priority;
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case "todo":
      return { color: "#F1C40F" };
    case "in progress":
      return { color: "#3498DB" };
    case "completed":
      return { color: "#2ECC71" };
    default:
      return {};
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "high":
      return { color: "#E74C3C" };
    case "medium":
      return { color: "#F1C40F" };
    case "low":
      return { color: "#2ECC71" };
    case "normal":
      return { color: "#95A5A6" };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDate: {
    fontSize: 12,
    color: "#999",
  },
  taskPriority: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#F2F2F7",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default TaskCard;
