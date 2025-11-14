// navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

export default function AppNavigator() {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const storedRole = await AsyncStorage.getItem("userRole");
        const loggedIn = await AsyncStorage.getItem("isLoggedIn");

        if (cancelled) return;

        const normalizedRole = storedRole ? storedRole.trim().toLowerCase() : null;

        console.log("AppNavigator -> loaded from AsyncStorage:", {
          storedRole,
          normalizedRole,
          loggedIn,
        });

        setIsLoggedIn(loggedIn === "true");
        setRole(normalizedRole);
      } catch (e) {
        console.error("Failed to load user data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;

  if (isLoggedIn && role === "superadmin") return <Redirect href="/superadminhome" />;
  if (isLoggedIn && role === "admin")      return <Redirect href="/adminhome" />;
  if (isLoggedIn && role === "user")       return <Redirect href="/user" />;

  // If we get here, we’re either logged out or role is missing
  return <Redirect href="/loginpage" />;
}
