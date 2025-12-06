// screens/UserHome/UpdatesSection.js
import React from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";

export default function UpdatesSection({ updates }) {
  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View>
          <Text style={S.kicker}>UserHome</Text>
          <Text style={S.cardTitle}>Updates & Notifications</Text>
        </View>
        <View style={S.pill}>
          <View style={S.pillDot} />
          <Text style={S.pillText}>Live</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={updates}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const isUrgent = item.type === "urgent";
          const isSuccess = item.type === "success";
          return (
            <View
              style={[
                S.item,
                isUrgent && S.itemUrgent,
                isSuccess && S.itemSuccess,
              ]}
            >
              <View style={S.itemTop}>
                <Text style={S.title}>{item.title}</Text>
                <View style={[S.typeDot, isUrgent && S.dotUrgent, isSuccess && S.dotSuccess]} />
              </View>
              <Text style={S.body}>{item.text}</Text>
              <Text style={S.time}>{item.time}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={S.empty}>No updates</Text>}
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
  itemUrgent: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  itemSuccess: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },

  itemTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontWeight: "900", color: "#0F172A", fontSize: 13, flex: 1 },
  typeDot: { width: 10, height: 10, borderRadius: 10, backgroundColor: "#CBD5E1" },
  dotUrgent: { backgroundColor: "#F97316" },
  dotSuccess: { backgroundColor: "#22C55E" },

  body: { color: "#475569", marginTop: 8, fontSize: 12, lineHeight: 18 },
  time: { color: "#94A3B8", marginTop: 8, fontSize: 12, fontWeight: "600" },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12 },
});
