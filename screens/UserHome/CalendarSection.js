// screens/UserHome/CalendarSection.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { TODAY, fmt } from "./utils";

export default function CalendarSection({
  month,
  matrix,
  booked,
  onChangeMonth,
  onSelectDate,
  onAddUpdate, // untouched (kept for compatibility)
}) {
  const title = useMemo(() => {
    return new Date(month.year, month.month).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [month.year, month.month]);

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View>
          <Text style={S.kicker}>UserHome</Text>
          <Text style={S.cardTitle}>Transportation Calendar</Text>
        </View>

        <View style={S.pill}>
          <View style={S.pillDot} />
          <Text style={S.pillText}>Live</Text>
        </View>
      </View>

      <View style={S.calHead}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => onChangeMonth(-1)}
          style={S.navBtn}
          activeOpacity={0.75}
        >
          <Text style={S.calNav}>‹</Text>
        </TouchableOpacity>

        <View style={S.calTitleWrap}>
          <Text style={S.calTitle}>{title}</Text>
          <Text style={S.calSub}>Tap a date to view/book</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => onChangeMonth(1)}
          style={S.navBtn}
          activeOpacity={0.75}
        >
          <Text style={S.calNav}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={S.weekRow}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Text key={d} style={S.weekText}>
            {d}
          </Text>
        ))}
      </View>

      <View style={S.grid}>
        {matrix.map((week, i) => (
          <View key={i} style={S.weekRow}>
            {week.map((d, j) => {
              if (!d) return <View key={j} style={S.cellEmpty} />;

              const key = fmt(d);
              const isBooked = !!booked[key];
              const isToday = key === fmt(TODAY);

              return (
                <TouchableOpacity
                  key={j}
                  activeOpacity={0.85}
                  onPress={() => onSelectDate(key)}
                  style={[
                    S.cell,
                    isBooked && S.cellBooked,
                    isToday && S.cellToday,
                  ]}
                >
                  <View style={S.cellInner}>
                    <Text style={[S.cellNum, isBooked && S.cellNumBooked]}>
                      {d.getDate()}
                    </Text>

                    {/* status indicator */}
                    <View
                      style={[
                        S.badge,
                        isBooked ? S.badgeBooked : S.badgeAvail,
                      ]}
                    >
                      <Text style={[S.badgeText, isBooked && S.badgeTextBooked]}>
                        {isBooked ? "Booked" : "Open"}
                      </Text>
                    </View>

                    {isBooked && <View style={S.cellDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={S.legendRow}>
        <View style={S.legendItem}>
          <View style={[S.legendColor, S.legendBooked]} />
          <Text style={S.legendText}>Booked</Text>
        </View>
        <View style={S.legendItem}>
          <View style={[S.legendColor, S.legendAvail]} />
          <Text style={S.legendText}>Available</Text>
        </View>
        <View style={S.legendItem}>
          <View style={[S.legendColor, S.legendToday]} />
          <Text style={S.legendText}>Today</Text>
        </View>
      </View>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
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
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  pillText: { fontSize: 12, color: "#0F172A", fontWeight: "700" },

  calHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },

  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calNav: { fontSize: 20, color: "#334155", fontWeight: "800" },

  calTitleWrap: { flex: 1, alignItems: "center" },
  calTitle: { fontWeight: "800", fontSize: 14, color: "#0F172A" },
  calSub: { fontSize: 11, color: "#64748B", marginTop: 2 },

  weekRow: { flexDirection: "row" },
  weekText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#94A3B8",
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: "700",
  },

  grid: { marginTop: 2 },

  cellEmpty: { flex: 1, padding: 6 },

  cell: {
    flex: 1,
    minHeight: 56,
    margin: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  cellInner: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },

  cellNum: { fontWeight: "900", color: "#0F172A", fontSize: 13 },
  cellNumBooked: { color: "#9A3412" },

  cellBooked: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },

  cellToday: {
    borderColor: "#2563EB",
    borderWidth: 1.5,
    backgroundColor: "#EFF6FF",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeAvail: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  badgeBooked: {
    backgroundColor: "#FFEDD5",
    borderColor: "#FED7AA",
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#166534" },
  badgeTextBooked: { color: "#9A3412" },

  cellDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#F97316",
  },

  legendRow: { flexDirection: "row", marginTop: 12, flexWrap: "wrap", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: {
    width: 18,
    height: 10,
    borderRadius: 4,
    marginRight: 8,
  },
  legendBooked: { backgroundColor: "#FFEDD5" },
  legendAvail: { backgroundColor: "#ECFDF5" },
  legendToday: { backgroundColor: "#EFF6FF" },
  legendText: { color: "#475569", fontSize: 12, fontWeight: "600" },
});
