import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { useFetchTasksQuery } from "../redux/slice/api/taskApiSlice";
import Loading from "../components/Loading";
import TaskCard from "../components/TaskCard";

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "todo", label: "To Do" },
  { id: "in progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export default function TasksScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data: tasks = [], isLoading, error } = useFetchTasksQuery();

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === "all") return true;
    return task.stage === selectedFilter.toLowerCase();
  });

  if (isLoading) {
    return <Loading message="Görevler yükleniyor..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Görevler yüklenirken hata oluştu!</Text>
      </View>
    );
  }

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedTaskId((prevId) => (prevId === id ? null : id));
  };

  const renderItem = ({ item }) => (
    <TaskCard
      task={item}
      isExpanded={expandedTaskId === item._id}
      onToggleExpand={() => toggleExpanded(item._id)}
      onEdit={() => navigation.navigate("TaskDetail", { id: item._id })}
      onAddCommit={() => navigation.navigate("AddCommit", { id: item._id })}
      onViewCommits={() => navigation.navigate("CommitList", { id: item._id })}
    />
  );

  const FilterButton = ({ option }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === option.id && styles.activeFilter,
      ]}
      onPress={() => setSelectedFilter(option.id)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === option.id && styles.activeFilterText,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Tasks" />

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_OPTIONS.map((option) => (
            <FilterButton key={option.id} option={option} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  activeFilterText: {
    color: "#FFF",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
