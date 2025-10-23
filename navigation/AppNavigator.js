import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function AppNavigator() {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("userRole");
        const loggedIn = await AsyncStorage.getItem("isLoggedIn");

        if (loggedIn === "true") setIsLoggedIn(true);
        if (storedRole) setRole(storedRole);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return null;

// Handles auto-redirect based on role
if (isLoggedIn && role === "superadmin") return <Redirect href="/superadminhome" />;
if (isLoggedIn && role === "admin") return <Redirect href="/adminhome" />;
if (isLoggedIn && role === "user") return <Redirect href="/user" />;
return <Redirect href="/" />;


  // 💤 Not logged in → go to landing page
  return <Redirect href="/" />;
}
