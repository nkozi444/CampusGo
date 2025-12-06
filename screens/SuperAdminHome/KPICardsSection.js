// screens/SuperAdminHome/KPICardsSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function KPICardsSection({ WIDE }) {
  const cardStyle = WIDE ? S.cardWide : S.cardNarrow;

  const data = [
    { title: "Pending Requests", value: "1", bg: "#FFFBEA", color: "#C58900" },
    { title: "Approved", value: "8", bg: "#ECFDF5", color: "#16A34A" },
    { title: "Available Vehicles", value: "3", bg: "#EEF2FF", color: "#2563EB" },
    { title: "Completed", value: "5", bg: "#F3E8FF", color: "#9333EA" },
  ];

  return (
    <View style={S.container}>
      {data.map((d) => (
        <View key={d.title} style={[S.card, cardStyle, { backgroundColor: d.bg }]}>
          <Text style={S.title}>{d.title}</Text>
          <Text style={[S.value, { color: d.color }]}>{d.value}</Text>
        </View>
      ))}
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginVertical: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardWide: { width: "23%" },
  cardNarrow: { width: "48%" },
  title: { fontSize: 14, marginBottom: 5, color: "#374151" },
  value: { fontSize: 28, fontWeight: "bold" },
});
