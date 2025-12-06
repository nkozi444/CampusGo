// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import React from "react";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="loginpage" />
        <Stack.Screen name="register" />
        <Stack.Screen name="user" />
        <Stack.Screen name="adminhome" />
        <Stack.Screen name="superadminhome" />
        <Stack.Screen name="appnavigator" />
      </Stack>
    </ThemeProvider>
  );
}
