// screens/AdminHome/KPICardsSection.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function KPICardsSection({
  WIDE,
  pending,
  approved,
  availableVehicles,
  completed,
}) {
  const cardStyle = WIDE ? S.cardWide : S.cardNarrow;

  // Fallbacks (your previous hardcoded values)
  const safe = useMemo(
    () => ({
      pending: pending ?? 1,
      approved: approved ?? 2,
      availableVehicles: availableVehicles ?? 3,
      completed: completed ?? 1,
    }),
    [pending, approved, availableVehicles, completed]
  );

  const cards = useMemo(
    () => [
      {
        title: "Pending Requests",
        value: String(safe.pending),
        bg: "#FFFBEB",
        color: "#B45309",
        border: "#FDE68A",
      },
      {
        title: "Approved",
        value: String(safe.approved),
        bg: "#ECFDF5",
        color: "#166534",
        border: "#BBF7D0",
      },
      {
        title: "Available Vehicles",
        value: String(safe.availableVehicles),
        bg: "#EEF2FF",
        color: "#1D4ED8",
        border: "#C7D2FE",
      },
      {
        title: "Completed",
        value: String(safe.completed),
        bg: "#F3E8FF",
        color: "#6D28D9",
        border: "#E9D5FF",
      },
    ],
    [safe]
  );

  return (
    <View style={S.container}>
      {cards.map((c) => (
        <View
          key={c.title}
          style={[
            S.card,
            cardStyle,
            { backgroundColor: c.bg, borderColor: c.border },
          ]}
        >
          <Text style={S.title}>{c.title}</Text>
          <Text style={[S.value, { color: c.color }]}>{c.value}</Text>
        </View>
      ))}
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 10,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 2 },
    }),
  },
  cardWide: { width: "23%", minWidth: 150 },
  cardNarrow: { width: "48%" },

  title: {
    fontSize: 12,
    marginBottom: 6,
    color: "#334155",
    fontWeight: "800",
  },
  value: { fontSize: 28, fontWeight: "900" },
  caption: {
    marginTop: 6,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
  },
});
