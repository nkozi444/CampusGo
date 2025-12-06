// screens/AdminHome/HeaderSection.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function HeaderSection({ onSignOut }) {
  return (
    <View style={S.header}>
      <View>
        <Text style={S.title}>CampusGo – Admin Dashboard</Text>
        <Text style={S.subtitle}>The Official NORSU Transportation Service</Text>
      </View>

      <TouchableOpacity style={S.signOut} onPress={onSignOut}>
        <Text style={S.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const S = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#6B7280" },

  signOut: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  signOutText: { color: "#111827", fontWeight: "500", fontSize: 12 },
});
