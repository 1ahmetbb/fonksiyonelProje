import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-chart-kit";
import InfoCard from "../components/InfoCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useFetchTasksQuery } from "../redux/slice/api/taskApiSlice";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const { data: tasks = [], isLoading, error, refetch: refetchTasks } = useFetchTasksQuery();
  const authState = useSelector((state) => state.auth);
  const [hasData, setHasData] = useState(true);

  // Görev verilerine göre hasData durumunu güncelle
  useEffect(() => {
    setHasData(tasks.length > 0);
  }, [tasks]);

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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.stage === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.stage === "in progress"
  ).length;
  const toDoTasks = tasks.filter(
    (task) => task.stage === "todo"
  ).length;

  const chartData = [
    {
      name: "To-Do",
      population: toDoTasks,
      color: "#dc3545",
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "In Progress",
      population: inProgressTasks,
      color: "#ffc107",
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Completed",
      population: completedTasks,
      color: "#28a745",
      legendFontColor: "#000",
      legendFontSize: 12,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />

      <View style={styles.cardContainer}>
        <InfoCard
          icon="clipboard-outline"
          title="Total Tasks"
          count={totalTasks}
          color="#007bff"
          navigateTo="Tasks"
        />
        <InfoCard
          icon="checkmark-circle-outline"
          title="Completed"
          count={completedTasks}
          color="#28a745"
          navigateTo="Tasks"
        />
        <InfoCard
          icon="time-outline"
          title="In Progress"
          count={inProgressTasks}
          color="#ffc107"
          navigateTo="Tasks"
        />
        <InfoCard
          icon="list-outline"
          title="To-Do"
          count={toDoTasks}
          color="#dc3545"
          navigateTo="Tasks"
        />
      </View>

      {hasData ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Task Distribution</Text>
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width - 30}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Henüz görev bulunmamaktadır</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  }
});
