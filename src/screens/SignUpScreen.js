import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator, Card, HelperText } from "react-native-paper";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/authSlice";

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Error states for validation
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form inputs
  const validateInputs = () => {
    let isValid = true;
    
    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    
    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    console.log("Dispatching signupUser...");
    
    try {
      const resultAction = await dispatch(signupUser({ name, email, password }));
      console.log("Signup API Response:", resultAction);
      
      if (signupUser.fulfilled.match(resultAction)) {
        const responseMessage = resultAction.payload;
        console.log(" Success Response:", responseMessage);
        
        if (responseMessage === "User registered successfully") {
          Alert.alert(
            "Success!",
            "Your account has been created successfully",
            [
              { 
                text: "OK", 
                onPress: () => navigation.replace("Login") 
              }
            ]
          );
        }
      } else if (signupUser.rejected.match(resultAction)) {
        console.error(" Signup Rejected:", resultAction.payload);
        
        if (resultAction.payload === "User already exists") {
          Alert.alert(" ", "This email is already registered. Please login.");
        } else {
          Alert.alert(" ", "Signup failed. Try again.");
        }
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar backgroundColor="#1E1E1E" barStyle="light-content" />
      <Card style={styles.card}>
        <Card.Title title="Create Account" titleStyle={styles.title} />
        <Card.Content>
          <TextInput 
            label="Full Name" 
            value={name} 
            onChangeText={setName} 
            style={styles.input} 
            mode="outlined"
            error={!!nameError}
          />
          {nameError ? <HelperText type="error">{nameError}</HelperText> : null}
          
          <TextInput 
            label="Email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input} 
            mode="outlined"
            error={!!emailError}
          />
          {emailError ? <HelperText type="error">{emailError}</HelperText> : null}
          
          <TextInput 
            label="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            style={styles.input} 
            mode="outlined"
            error={!!passwordError}
          />
          {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}
          
          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <Button 
              mode="contained" 
              onPress={handleSignup} 
              style={styles.button}
              disabled={loading}
            >
              Sign Up
            </Button>
          )}
          
          <Button 
            mode="text" 
            onPress={() => navigation.navigate("Login")} 
            style={styles.link}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#1E1E1E" 
  },
  card: { 
    width: "100%", 
    padding: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  input: { 
    marginBottom: 4 
  },
  button: { 
    marginTop: 16 
  },
  loader: { 
    marginVertical: 15 
  },
  link: { 
    marginTop: 10, 
    textAlign: "center" 
  }
});

export default SignupScreen;