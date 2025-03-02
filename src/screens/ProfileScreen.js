import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      await AsyncStorage.removeItem("userData"); // Clear stored user data
      await AsyncStorage.removeItem("token"); // Clear token
      navigation.reset({ index: 0, routes: [{ name: "Login" }] }); // Reset to login screen
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Profile</Text>
        {user ? (
          <>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
              Logout
            </Button>
          </>
        ) : (
          <Text style={styles.noUser}>No user data found!</Text>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E", padding: 20 },
  card: { width: "90%", padding: 20, borderRadius: 10 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  label: { fontSize: 16, fontWeight: "bold", color: "#555", marginTop: 10 },
  value: { fontSize: 16, color: "#000", marginBottom: 10 },
  logoutButton: { marginTop: 20, backgroundColor: "#D32F2F", borderRadius: 8 },
  noUser: { fontSize: 16, textAlign: "center", color: "#999" },
});

export default ProfileScreen;
