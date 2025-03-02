import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB, Card, IconButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [dispatch])
  );

  const loadTasks = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch(fetchTasks(token));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const renderTaskItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginTop: 10 }}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("TaskDetails", { taskId: item._id })}
      >
        <Card
          style={[
            styles.card,
            item.completed ? styles.completedCard : styles.pendingCard,
          ]}
        >
          <Card.Content>
            <View style={styles.taskHeader}>
              <View style={{ width: "80%" }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
              </View>
              {item.completed && (
                <IconButton icon="check-circle" color="#4CAF50" size={22} />
              )}
            </View>
            <Text style={styles.taskDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar Matches Theme Color */}
      <StatusBar backgroundColor="#1E1E1E" barStyle="light-content" />

      {/* Title Bar */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Task List</Text>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          renderItem={renderTaskItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          ListEmptyComponent={() => (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Available</Text>
            </View>
          )}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Task"
        onPress={() => navigation.navigate("TaskCreate")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", 
  titleContainer: {
    // paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    paddingTop: 25,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 10,
    width: "90%",
    alignSelf: "center",
  },
  pendingCard: {
    backgroundColor: "#FFFFFF", 
    borderLeftWidth: 5,
    borderLeftColor: "#6200EE",
  },
  completedCard: {
    backgroundColor: "#E8F5E9", 
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333", 
  },
  taskDescription: {
    fontSize: 14,
    color: "#666666", 
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#FF6F61", 
    borderRadius: 30,
    padding: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },
});

export default HomeScreen;
