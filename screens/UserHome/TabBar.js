// screens/UserHome/TabBar.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Bell,
  Calendar,
  Clock,
  History as HistoryIcon,
  PlusCircle,
} from "lucide-react-native";
import { WIDE } from "./utils";

export default function TabBar({ active, setActive }) {
  const Tabs = [
    {
      key: "Calendar",
      icon: (
        <Calendar size={14} color={active === "Calendar" ? "#2563EB" : "#6B7280"} />
      ),
    },
    {
      key: "New Request",
      icon: (
        <PlusCircle
          size={14}
          color={active === "New Request" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "My Requests",
      icon: (
        <Clock
          size={14}
          color={active === "My Requests" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "Updates",
      icon: <Bell size={14} color={active === "Updates" ? "#2563EB" : "#6B7280"} />,
    },
    {
      key: "History",
      icon: (
        <HistoryIcon size={14} color={active === "History" ? "#2563EB" : "#6B7280"} />
      ),
    },
  ];

  const Content = (
    <View style={S.tabStrip}>
      {Tabs.map((t, idx) => {
        const isActive = active === t.key;

        return (
          <TouchableOpacity
            key={t.key}
            style={[
              S.tabPill,
              WIDE && S.tabPillWide,
              isActive && S.tabPillActive,
              idx === Tabs.length - 1 && S.lastPill,
            ]}
            onPress={() => setActive(t.key)}
            activeOpacity={0.85}
          >
            <View style={S.tabInner}>
              {t.icon}
              <Text style={[S.tabText, isActive && S.tabTextActive]}>
                {t.key}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={S.tabStripContainer}>
      {WIDE ? (
        Content
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.tabStrip}
        >
          {Content.props.children}
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  tabStripContainer: { marginBottom: 14 },

  // ✅ Match AdminHome container look
  tabStrip: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
    borderRadius: 16,
    gap: 6,
  },

  tabPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },

  tabPillWide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  lastPill: { marginRight: 0 },

  // ✅ Match AdminHome active pill styling
  tabPillActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EEF6",
    shadowColor: "#0B1220",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 2,
  },

  tabInner: { flexDirection: "row", alignItems: "center", gap: 8 },

  // ✅ Match AdminHome text exactly
  tabText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "800",
    marginLeft: 6,
  },
  tabTextActive: { color: "#2563EB" },
});
