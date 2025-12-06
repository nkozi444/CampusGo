// screens/AdminHome/TabBar.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Calendar,
  Clock,
  CheckCircle,
  Car,
  Users,
  Hourglass,
} from "lucide-react-native";

export default function TabBar({ activeTab, setActiveTab }) {
  const isWide = Dimensions.get("window").width >= 920;

  const tabs = useMemo(
    () => [
      { name: "Calendar", icon: Calendar },
      { name: "Timeline", icon: Clock },
      { name: "Pending", icon: Hourglass }, // ✅ distinct icon
      { name: "Approved", icon: CheckCircle },
      { name: "Vehicles", icon: Car },
      { name: "Drivers", icon: Users },
    ],
    []
  );

  const renderTabs = () =>
    tabs.map((t, idx) => {
      const Icon = t.icon;
      const active = activeTab === t.name;

      return (
        <TouchableOpacity
          key={t.name}
          style={[
            S.btn,
            isWide && S.btnWide,
            active && S.activeBtn,
            idx === tabs.length - 1 && S.lastBtn,
          ]}
          onPress={() => setActiveTab(t.name)}
          activeOpacity={0.85}
        >
          <View style={S.inner}>
            <Icon size={16} color={active ? "#2563EB" : "#64748B"} />
            <Text style={[S.text, active && S.textActive]}>{t.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });

  return (
    <View style={S.wrapper}>
      {isWide ? (
        <View style={S.tabs}>{renderTabs()}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.tabsScroll}
        >
          {renderTabs()}
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  wrapper: { marginBottom: 14 },

  // Wide: full-width segmented control
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
    borderRadius: 16,
    gap: 6,
  },

  // Small screens: pill row scroll
  tabsScroll: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
    borderRadius: 16,
    gap: 6,
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  btnWide: { flex: 1, alignItems: "center", justifyContent: "center" },
  lastBtn: { marginRight: 0 },

  activeBtn: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EEF6",
    shadowColor: "#0B1220",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 2,
  },

  inner: { flexDirection: "row", alignItems: "center", gap: 8 },
  text: { fontSize: 13, color: "#64748B", fontWeight: "800" },
  textActive: { color: "#2563EB" },
});
