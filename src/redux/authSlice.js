import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://taskmanagement-production-2e97.up.railway.app/auth";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;

      // Store token & user data in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      // Return both token & user details
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed!");
    }
  }
);


export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    console.log("🔥 signupUser called with data:", userData); 

    try {
      const response = await axios.post(`${API_URL}/signup`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ API Response Success:", response.data); 

      return response.data.message;

    } catch (error) {
      console.error("❌ API Error Response:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Signup failed!"
      );
    }
  }
);

// Load token from AsyncStorage
export const loadAuthToken = createAsyncThunk("auth/loadAuthToken", async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
});

// Logout API Call (Async)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    loading: true, 
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAuthToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAuthToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loadAuthToken.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
