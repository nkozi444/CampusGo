import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function ActivitiesSection({ router, activities = [] }) {
  return (
    <View style={S.card}>
      <View style={S.header}>
        <View>
          <Text style={S.title}>System Activities</Text>
          <Text style={S.subtitle}>Latest events across your platform</Text>
        </View>

        <TouchableOpacity
          style={S.primaryBtn}
          onPress={() => router.push("/activities")}
          activeOpacity={0.85}
        >
          <Text style={S.primaryBtnText}>Open Activities</Text>
        </TouchableOpacity>
      </View>

      {activities.length === 0 ? (
        <View style={S.emptyBox}>
          <Text style={S.emptyTitle}>No recent activity</Text>
          <Text style={S.emptySub}>Logs will show here once events are recorded.</Text>
        </View>
      ) : (
        <View style={S.list}>
          {activities.slice(0, 7).map((a, idx) => (
            <View key={a.id ?? `${a.title}-${idx}`} style={[S.row, idx === 0 && { borderTopWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={S.rowTitle} numberOfLines={1}>
                  {a.title}
                </Text>
                <Text style={S.rowSub} numberOfLines={1}>
                  {a.sub}
                </Text>
              </View>
              <Text style={S.time}>{a.ago}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 2 },
      default: { shadowOpacity: 0.06 },
    }),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12, letterSpacing: 0.3 },

  list: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },

  rowTitle: { fontSize: 14, fontWeight: "900", color: "#0F172A" },
  rowSub: { fontSize: 12, color: "#64748B", marginTop: 2 },
  time: { fontSize: 12, color: "#94A3B8" },

  emptyBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
  },
  emptyTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  emptySub: { marginTop: 4, fontSize: 12, color: "#64748B" },
});
