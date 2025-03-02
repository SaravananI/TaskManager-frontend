import React, { useState } from "react";
import { View, Text, Alert, StatusBar } from "react-native";
import { Button, TextInput as PaperInput, Card, HelperText } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      console.log(response);
      
      // Store token & user data
      await AsyncStorage.setItem("userToken", response.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.user));
  
      Alert.alert("Success", "Logged in successfully!");
    } catch (err) {
      Alert.alert("Error", error || "Invalid credentials or server issue");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E", padding: 20 }}>
      <StatusBar backgroundColor="#1E1E1E" barStyle="light-content" />
      <Card style={{ width: "90%", padding: 20, borderRadius: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" }}>
          Login
        </Text>

        <PaperInput 
          mode="outlined" 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 5 }}
          error={!!emailError}
        />
        {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

        <PaperInput 
          mode="outlined" 
          label="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
          style={{ marginBottom: 5 }}
          error={!!passwordError}
        />
        {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading} 
          style={{ borderRadius: 8, paddingVertical: 5, backgroundColor: "#007bff", marginTop: 10 }}
          labelStyle={{ fontSize: 16 }}
        >
          Login
        </Button>

        <Button 
          onPress={() => navigation.navigate("Signup")} 
          style={{ marginTop: 10 }}
          labelStyle={{ fontSize: 14, color: "#007bff" }}
        >
          Don't have an account? Sign Up
        </Button>
      </Card>
    </View>
  );
};

export default LoginScreen;
