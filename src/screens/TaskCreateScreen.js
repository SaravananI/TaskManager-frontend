import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { createTask, fetchTasks } from "../redux/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";

const TaskCreateScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(" ", "Please enter both title and description.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert(" ", "Authentication token is missing!");
      return;
    }

    const taskData = { title, description };
    dispatch(createTask(taskData))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Task created successfully!");
        dispatch(fetchTasks(token)).then(() => {
          navigation.goBack();
        });
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <Text style={styles.header}>Create New Task</Text>
      <TextInput
        placeholder="Enter Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Enter Task Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]} 
        placeholderTextColor="#888"
        multiline
      />
      <Button 
        mode="contained" 
        onPress={handleCreateTask} 
        style={styles.button}
        labelStyle={{ fontSize: 16 }}
      >
        Create Task
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", 
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF", 
  },
  input: {
    backgroundColor: "#333333", 
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#FFFFFF", // White text
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default TaskCreateScreen;
