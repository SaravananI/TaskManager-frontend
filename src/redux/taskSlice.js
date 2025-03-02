import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch Tasks API
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token"); 
    if (!token) {
      return rejectWithValue("User not authenticated");
    }

    const response = await axios.get("https://taskmanagement-production-2e97.up.railway.app/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks!");
  }
});

// Fetch Task by ID API
export const fetchTaskById = createAsyncThunk("tasks/fetchTaskById", async (taskId, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token"); 
    if (!token) {
      return rejectWithValue("User not authenticated");
    }

    const response = await axios.get(`https://taskmanagement-production-2e97.up.railway.app/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch task details!");
  }
});

// Update Task API
export const updateTask = createAsyncThunk("tasks/updateTask", async ({ taskId, updatedTask }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("User not authenticated");
    }

    const response = await axios.put(
      `https://taskmanagement-production-2e97.up.railway.app/tasks/${taskId}`,
      updatedTask,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update task!");
  }
});

// Create Task API
export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token"); 
    if (!token) {
      return rejectWithValue("User not authenticated");
    }

    const response = await axios.post(
      "https://taskmanagement-production-2e97.up.railway.app/tasks",
      taskData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create task!");
  }
});


// Delete Task API
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("User not authenticated");
    }

    await axios.delete(`https://taskmanagement-production-2e97.up.railway.app/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return taskId; // Return deleted task ID
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete task!");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], taskDetails: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetails = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        state.taskDetails = action.payload; // Update task details in state
      })

      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload); // Remove task from state
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // Append new task to state
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
