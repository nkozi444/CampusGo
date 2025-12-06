// screens/AdminHome/ApprovedSection.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ApprovedSection({ requests = [], onMarkComplete, onCancel }) {
  const approved = useMemo(() => {
    return requests.filter((r) => String(r.status || "").toLowerCase() === "approved");
  }, [requests]);

  return (
    <View style={S.box}>
      <Text style={S.title}>Approved Bookings</Text>

      <FlatList
        scrollEnabled={false}
        data={approved}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const time = item.timeRange || item.time || "—";
          const passengers = Number(item.passengers || 0);
          const paxLabel = passengers === 1 ? "passenger" : "passengers";

          return (
            <View style={S.card}>
              <View style={S.rowHeader}>
                <View style={S.userInfo}>
                  <Text style={S.name} numberOfLines={1}>
                    👤 {item.userName || item.email || "User"}
                  </Text>
                  <View style={S.badge}>
                    <Text style={S.badgeText}>Approved</Text>
                  </View>
                </View>

                <View style={{ gap: 8, alignItems: "flex-end" }}>
                  <TouchableOpacity
                    style={S.doneBtn}
                    onPress={() => onMarkComplete?.(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={S.doneText}>Mark Complete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={S.cancelBtn}
                    onPress={() => onCancel?.(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={S.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={S.detailsRow}>
                <Text style={S.detail}>
                  📅 {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                </Text>
                <Text style={S.detail}>⏰ {time}</Text>
                <Text style={S.detail}>
                  👤 {passengers || "—"} {paxLabel}
                </Text>
                <Text style={S.detail}>📍 {item.destination || "—"}</Text>
                <Text style={S.detail}>🚍 {item.vehicle || "—"}</Text>
              </View>

              {(item.assignedVehicle || item.assignedDriver) && (
                <Text style={S.assign}>
                  Assigned: <Text style={S.vehicle}>{item.assignedVehicle || "—"}</Text>
                  {"  "}• Driver: {item.assignedDriver || "—"}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={S.empty}>No approved bookings.</Text>}
      />
    </View>
  );
}

const S = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8EEF6",
  },
  title: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginBottom: 12 },

  card: {
    borderLeftWidth: 4,
    borderLeftColor: "#34D399",
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 12,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },

  userInfo: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  name: { fontWeight: "900", fontSize: 14, color: "#065F46", flex: 1 },

  badge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  badgeText: { color: "#065F46", fontWeight: "900", fontSize: 11 },

  doneBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  doneText: { fontSize: 12, color: "#065F46", fontWeight: "900" },

  cancelBtn: {
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelText: { fontSize: 12, color: "#991B1B", fontWeight: "900" },

  detailsRow: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#A7F3D0" },
  detail: { color: "#065F46", marginBottom: 6, fontSize: 13, fontWeight: "700" },

  assign: { marginTop: 10, color: "#065F46", fontWeight: "700" },
  vehicle: { fontWeight: "900", textDecorationLine: "underline" },

  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, fontWeight: "700" },
});
