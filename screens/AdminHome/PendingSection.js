// screens/AdminHome/PendingSection.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function PendingSection({ requests = [], onApprove, onDecline }) {
  const pending = useMemo(
    () => requests.filter((r) => String(r.status || "").toLowerCase() === "pending"),
    [requests]
  );

  return (
    <View style={S.box}>
      <Text style={S.heading}>Pending Booking Requests</Text>

      <FlatList
        scrollEnabled={false}
        data={pending}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const created =
            item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleDateString()
              : item.createdAtClient?.toDate
              ? item.createdAtClient.toDate().toLocaleDateString()
              : "—";

          const schedDate = item.date
            ? new Date(item.date + "T00:00:00").toLocaleDateString()
            : "—";

          const time = item.timeRange || item.time || "—";
          const email = item.email || item.userEmail || "";

          return (
            <View style={S.card}>
              <View style={S.rowHeader}>
                <Text style={S.name} numberOfLines={1}>
                  👤 {item.userName || "User"}{" "}
                  {!!email && <Text style={S.email}>({email})</Text>}
                </Text>
                <Text style={S.date}>Requested: {created}</Text>
              </View>

              <View style={S.vehicleRow}>
                <Text style={S.detail}>🚍 {item.vehicle || "—"}</Text>
                <View style={S.badge}>
                  <Text style={S.badgeText}>Pending</Text>
                </View>
              </View>

              <View style={S.details}>
                <View style={S.col}>
                  <Text style={S.detail}>📅 {schedDate}</Text>
                  <Text style={S.detail}>⏰ {time}</Text>
                  <Text style={S.detail}>👤 {item.passengers || "—"} passenger</Text>
                </View>
                <View style={S.col}>
                  <Text style={S.detail}>📍 {item.destination || "—"}</Text>
                  <Text style={S.purpose}>Purpose: {item.purpose || "—"}</Text>
                </View>
              </View>

              <View style={S.buttons}>
                <TouchableOpacity
                  style={[S.action, S.decline]}
                  onPress={() => onDecline?.(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={S.declineText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[S.action, S.approve]}
                  onPress={() => onApprove?.(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={S.approveText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={S.empty}>No pending requests.</Text>}
      />
    </View>
  );
}

const S = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8EEF6",
  },
  heading: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginBottom: 12 },

  card: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 12,
  },

  rowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 10 },
  name: { fontWeight: "900", fontSize: 14, color: "#0F172A", flex: 1 },
  email: { fontWeight: "700", color: "#64748B" },
  date: { color: "#64748B", fontSize: 12, fontWeight: "700" },

  vehicleRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  detail: { fontSize: 13, color: "#0F172A", fontWeight: "700" },

  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  badgeText: { color: "#92400E", fontSize: 11, fontWeight: "900" },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
    marginBottom: 12,
  },
  col: { width: "48%" },
  purpose: { marginTop: 6, fontWeight: "800", color: "#0F172A" },

  buttons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 96,
    alignItems: "center",
    borderWidth: 1,
  },
  decline: { backgroundColor: "#FFF1F2", borderColor: "#FECACA" },
  approve: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },

  declineText: { color: "#991B1B", fontWeight: "900" },
  approveText: { color: "#166534", fontWeight: "900" },

  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, fontWeight: "700" },
});
