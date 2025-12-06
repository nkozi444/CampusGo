import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function OverviewSection({ activities = [], stats }) {
  const safeStats = stats || {
    pending: 0,
    completedThisMonth: 0,
    activeUsers: 0,
  };

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View>
          <Text style={S.title}>Overview</Text>
          <Text style={S.subtitle}>Recent system activity & performance</Text>
        </View>

        <View style={S.statusPill}>
          <View style={S.statusDot} />
          <Text style={S.statusText}>Operational</Text>
        </View>
      </View>

      {/* Recent activities */}
      <Text style={S.sectionLabel}>Recent System Activities</Text>

      {activities.length === 0 ? (
        <View style={S.emptyBox}>
          <Text style={S.emptyTitle}>No activity yet</Text>
          <Text style={S.emptySub}>New events will appear here as they happen.</Text>
        </View>
      ) : (
        <View style={S.list}>
          {activities.slice(0, 6).map((row, index) => (
            <View
              key={row.id ?? `${row.title}-${index}`}
              style={[S.row, index === 0 && { borderTopWidth: 0 }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={S.rowTitle} numberOfLines={1}>
                  {row.title}
                </Text>
                <Text style={S.rowSub} numberOfLines={1}>
                  {row.sub}
                </Text>
              </View>
              <Text style={S.rowRight}>{row.ago}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Metrics */}
      <Text style={[S.sectionLabel, { marginTop: 16 }]}>System Performance</Text>

      <View style={S.metricsGrid}>
        <Metric label="Pending Requests" value={safeStats.pending} tone="warn" />
        <Metric label="Completed This Month" value={safeStats.completedThisMonth} tone="ok" />
        <Metric label="Active Users" value={safeStats.activeUsers} tone="info" />
      </View>
    </View>
  );
}

function Metric({ label, value, tone = "info" }) {
  const toneStyle =
    tone === "ok"
      ? S.metricToneOk
      : tone === "warn"
      ? S.metricToneWarn
      : S.metricToneInfo;

  return (
    <View style={S.metricCard}>
      <View style={[S.metricIcon, toneStyle]} />
      <Text style={S.metricLabel}>{label}</Text>
      <Text style={S.metricValue}>{value}</Text>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  title: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  statusDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#16A34A" },
  statusText: { color: "#065F46", fontSize: 12, fontWeight: "800" },

  sectionLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  list: {
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
  rowTitle: { fontSize: 14, fontWeight: "800", color: "#0F172A" },
  rowSub: { fontSize: 12, color: "#64748B", marginTop: 2 },
  rowRight: { fontSize: 12, color: "#94A3B8" },

  emptyBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
  },
  emptyTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  emptySub: { marginTop: 4, fontSize: 12, color: "#64748B" },

  metricsGrid: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  metricCard: {
    flexGrow: 1,
    minWidth: 160,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  metricIcon: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginBottom: 8,
  },
  metricToneOk: { backgroundColor: "#22C55E" },
  metricToneWarn: { backgroundColor: "#F59E0B" },
  metricToneInfo: { backgroundColor: "#3B82F6" },

  metricLabel: { fontSize: 12, color: "#64748B", fontWeight: "700" },
  metricValue: { marginTop: 4, fontSize: 18, fontWeight: "900", color: "#0F172A" },
});
