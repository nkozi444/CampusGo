// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loginpage" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="user" options={{ headerShown: false }} />
      <Stack.Screen name="adminhome" options={{ headerShown: false }} />
      <Stack.Screen name="superadminhome" options={{ headerShown: false }} />
      {/* NEW: entry that runs AppNavigator */}
      <Stack.Screen name="appnavigator" options={{ headerShown: false }} />
    </Stack>
  );
}
