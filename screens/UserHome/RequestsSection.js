// screens/UserHome/RequestsSection.js
import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function RequestsSection({ requests, onSetStatus, userRole }) {
  const canManage = userRole === "admin" || userRole === "superadmin";

  return (
    <View style={S.card}>
      <Text style={S.cardTitle}>My Transportation Requests</Text>

      <FlatList
        scrollEnabled={false}
        data={requests}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={[
              S.reqCard,
              item.urgent && S.reqUrgent,
              item.status === "cancelled" && S.reqCancelled,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={S.reqTitle}>
                {item.purpose} {item.urgent && <Text style={S.urgBadge}>URGENT</Text>}
              </Text>

              <Text style={S.muted}>
                {item.vehicle} • {item.date} • {item.time}
              </Text>

              <Text style={S.muted}>Destination: {item.destination}</Text>

              {!canManage && (
                <Text style={S.readOnlyNote}>
                  Awaiting admin review. You can’t approve/cancel bookings.
                </Text>
              )}
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  S.statusPill,
                  item.status === "pending" && S.pending,
                  item.status === "approved" && S.approved,
                  item.status === "completed" && S.completed,
                  item.status === "cancelled" && S.cancelled,
                ]}
              >
                {item.status}
              </Text>

              {canManage && (
                <>
                  <TouchableOpacity style={S.actionBtn} onPress={() => onSetStatus(item.id, "cancelled")}>
                    <Text style={{ color: "#B91C1C" }}>Cancel</Text>
                  </TouchableOpacity>

                  {item.status === "approved" && (
                    <TouchableOpacity style={S.actionBtn} onPress={() => onSetStatus(item.id, "completed")}>
                      <Text>Mark Complete</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={S.empty}>No requests yet.</Text>}
      />
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },

  reqCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECFDF5",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#F0FFF7",
  },
  reqUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    backgroundColor: "#FFFBEB",
  },
  reqCancelled: { backgroundColor: "#FEF2F2" },

  reqTitle: { fontWeight: "800", color: "#0F172A", fontSize: 13 },
  urgBadge: { color: "#B91C1C", fontWeight: "700" },
  muted: { color: "#475569", marginTop: 6, fontSize: 12 },

  readOnlyNote: { color: "#94A3B8", marginTop: 8, fontSize: 11 },

  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },
  pending: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  approved: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  completed: { backgroundColor: "#DCFCE7", borderColor: "#86EFAD" },
  cancelled: { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },

  actionBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginTop: 8,
  },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12 },
});
