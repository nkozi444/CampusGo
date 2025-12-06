// components/theme/ThemeProvider.js
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();         // "light" | "dark"
  const [mode, setMode] = useState(system || "light");

  const colors = mode === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      colors,
      toggleTheme: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
