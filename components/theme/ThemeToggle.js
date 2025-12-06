import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { mode, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        S.btn,
        { borderColor: colors.text, backgroundColor: colors.bg },
      ]}
    >
      <Text style={[S.text, { color: colors.text }]}>
        {mode === "light" ? "Dark Mode" : "Light Mode"}
      </Text>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
