// screens/LoginScreen.js
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth as sharedAuth, db as sharedDb } from "../config/firebase"; // optional if you exported these
// If you didn't export auth/db from config, use the two lines below instead:
// import { app } from "../config/firebase";
// const sharedAuth = getAuth(app);
// const sharedDb = getFirestore(app);

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        sharedAuth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(sharedDb, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Alert.alert("Error", "User data not found in database!");
        return;
      }

      const rawRole = docSnap.data().role || "user";
      const role = rawRole.trim().toLowerCase();

      console.log("LoginScreen -> role from Firestore:", { rawRole, role });

      await AsyncStorage.setItem("userRole", role);
      await AsyncStorage.setItem("isLoggedIn", "true");

      Alert.alert("Login Successful", `Welcome back, ${role}!`);

      // Go to AppNavigator so it can route based on role
      router.replace("/appnavigator");
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CampusGo Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* PASSWORD + SHOW/HIDE TOGGLE */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword} // 👈 hides/shows based on state
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.showButton}
        >
          <Text style={styles.showButtonText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    maxWidth: 400, 
    alignSelf: "center", 
    width: "100%",
  },
  title: { 
    fontSize: 28, 
    textAlign: "center", 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: "#005FB8",
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#D1D5DB", 
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  // NEW styles for password + toggle
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  showButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  showButtonText: {
    color: "#005FB8",
    fontWeight: "500",
    fontSize: 13,
  },
  button: { 
    backgroundColor: "#005FB8", 
    padding: 14, 
    borderRadius: 8, 
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold", 
    fontSize: 16,
  },
  link: { 
    textAlign: "center", 
    marginTop: 15, 
    color: "#005FB8", 
    fontSize: 14,
  },
});
