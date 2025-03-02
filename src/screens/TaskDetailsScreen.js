import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, Switch, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskById, updateTask, deleteTask } from "../redux/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";

const TaskDetailsScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const { taskDetails, loading } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    if (taskDetails) {
      setTitle(taskDetails.title);
      setDescription(taskDetails.description);
      setCompleted(taskDetails.completed);
    }
  }, [taskDetails]);

  const handleUpdateTask = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Authentication token is missing!");
      return;
    }

    const updatedTask = { title, description, completed };
    dispatch(updateTask({ taskId, updatedTask }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Task updated successfully!");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  const handleDeleteTask = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Authentication token is missing!");
      return;
    }

    dispatch(deleteTask(taskId))
      .unwrap()
      .then(() => {
        Alert.alert("Deleted", "Task deleted successfully!");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Details</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        placeholderTextColor="#aaa"
        multiline
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Completed</Text>
        <Switch
          value={completed}
          onValueChange={(value) => setCompleted(value)}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={completed ? "#fff" : "#f4f3f4"}
        />
      </View>

      <Button mode="contained" style={styles.updateButton} onPress={handleUpdateTask}>
        Update Task
      </Button>

      <Button mode="contained" style={styles.deleteButton} onPress={handleDeleteTask}>
        Delete Task
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
  },
});

export default TaskDetailsScreen;
