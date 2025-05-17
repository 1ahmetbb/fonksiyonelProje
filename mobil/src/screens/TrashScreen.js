import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Button } from 'react-native';
import { useGetTrashedTasksQuery, useDeleteRestoreTaskMutation } from '../redux/slice/api/taskApiSlice';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';
import { handleApiError } from '../util/errorHandlers';

export default function TrashScreen() {
  const { data: trashedTasks, isLoading, error } = useGetTrashedTasksQuery();
  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const handleRestoreAll = async () => {
    try {
      await deleteRestoreTask({ actionType: 'restoreAll' }).unwrap();
      Alert.alert("Success", "All tasks restored!");
    } catch (error) {
      handleApiError(error, "TrashScreen.handleRestoreAll");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteRestoreTask({ actionType: 'deleteAll' }).unwrap();
      Alert.alert("Success", "All tasks deleted permanently!");
    } catch (error) {
      handleApiError(error, "TrashScreen.handleDeleteAll");
    }
  };

  const handleTaskAction = (id) => {
    Alert.alert(
      "Task Action",
      "Do you want to restore or delete this task?",
      [
        {
          text: "Restore",
          onPress: async () => {
            try {
              await deleteRestoreTask({ id, actionType: 'restore' }).unwrap();
              Alert.alert("Success", "Task restored!");
            } catch (error) {
              handleApiError(error, "TrashScreen.handleRestore");
            }
          },
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteRestoreTask({ id, actionType: 'delete' }).unwrap();
              Alert.alert("Success", "Task deleted permanently!");
            } catch (error) {
              handleApiError(error, "TrashScreen.handleDelete");
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading message="Loading trashed tasks..." />;  
  }

  if (error) {
    return <Loading message="Error loading tasks!" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Trash" />
      <View style={styles.buttonContainer}>
        <Button title="Restore All" onPress={handleRestoreAll} />
        <Button title="Delete All" onPress={handleDeleteAll} color="red" />
      </View>
      <FlatList
        data={trashedTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleTaskAction(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Trash is empty.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});