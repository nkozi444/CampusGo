// screens/UserHome/HistorySection.js
import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";

export default function HistorySection({ requests }) {
  const history = useMemo(
    () => requests.filter((r) => r.status === "completed" || r.status === "cancelled"),
    [requests]
  );

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View>
          <Text style={S.kicker}>UserHome</Text>
          <Text style={S.cardTitle}>Booking History</Text>
        </View>
        <View style={S.pill}>
          <View style={S.pillDot} />
          <Text style={S.pillText}>Live</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={history}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const isCancelled = item.status === "cancelled";
          const created =
            item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "";

          return (
            <View style={[S.item, isCancelled && S.itemCancelled]}>
              <View style={S.itemTop}>
                <Text style={S.title} numberOfLines={1}>
                  {item.purpose}
                </Text>
                <View style={[S.statusPill, isCancelled ? S.cancelled : S.completed]}>
                  <Text style={[S.statusText, isCancelled ? S.cancelledText : S.completedText]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={S.meta}>
                {item.vehicle} • {item.date} • {item.time}
              </Text>

              {!!created && <Text style={S.submeta}>Created {created}</Text>}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={S.empty}>No history yet.</Text>}
      />
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 3 },
    }),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  kicker: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  pillDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: "#22C55E", marginRight: 6 },
  pillText: { fontSize: 12, fontWeight: "700", color: "#0F172A" },

  item: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  itemCancelled: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  itemTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontWeight: "900", color: "#0F172A", fontSize: 13, flex: 1 },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  completed: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  cancelled: { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
  statusText: { fontSize: 11, fontWeight: "900", textTransform: "capitalize" },
  completedText: { color: "#166534" },
  cancelledText: { color: "#991B1B" },

  meta: { color: "#475569", marginTop: 8, fontSize: 12, fontWeight: "600" },
  submeta: { color: "#94A3B8", marginTop: 6, fontSize: 12 },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12 },
});
