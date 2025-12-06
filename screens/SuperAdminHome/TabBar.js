// screens/SuperAdminHome/TabBar.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";

import { Calendar, Clock, CheckCircle, Car, Users } from "lucide-react-native";

const WIDE = Dimensions.get("window").width >= 920;

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "Overview", icon: CheckCircle },
    { name: "Users", icon: Users },
    { name: "Activities", icon: Clock },
    { name: "Bookings", icon: CheckCircle },
    { name: "Calendar", icon: Calendar },
    { name: "Vehicles", icon: Car },
    { name: "Drivers", icon: Users },
  ];

  const renderTabs = () =>
    tabs.map((t) => {
      const Icon = t.icon;
      const isActive = activeTab === t.name;

      return (
        <TouchableOpacity
          key={t.name}
          style={[S.btn, WIDE && S.btnWide, isActive && S.activeBtn]}
          onPress={() => setActiveTab(t.name)}
          activeOpacity={0.85}
        >
          <View style={S.inner}>
            <Icon size={16} color={isActive ? "#2563EB" : "#64748B"} />
            <Text style={[S.text, isActive && S.textActive]}>{t.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });

  return (
    <View style={S.wrapper}>
      {WIDE ? (
        <View style={S.tabs}>{renderTabs()}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.tabs}
        >
          {renderTabs()}
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  wrapper: { marginBottom: 16 },

  // ✅ closer to Admin/User look
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },

  btn: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  btnWide: { flex: 1 },

  activeBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
      default: { shadowOpacity: 0.08 }, // RN web
    }),
  },

  inner: { flexDirection: "row", alignItems: "center", gap: 8 },

  // ✅ bolder typography
  text: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "800",
  },
  textActive: { color: "#2563EB", fontWeight: "900" },
});
