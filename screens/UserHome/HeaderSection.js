// screens/UserHome/HeaderSection.js
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HeaderSection({ onSignOut }) {
  return (
    <View style={S.header}>
      <View>
        <Text style={S.title}>CampusGo - Welcome, User</Text>
        <Text style={S.subtitle}>
          The Official NORSU Transportation Service
        </Text>
      </View>
      <TouchableOpacity style={S.signOut} onPress={onSignOut}>
        <Text style={S.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const S = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontSize: 11, color: "#6B7280", marginTop: 4 },
  signOut: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  signOutText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 12,
  },
});
