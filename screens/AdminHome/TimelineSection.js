// screens/AdminHome/TimelineSection.js
import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";

function toMs(v) {
  if (!v) return 0;
  if (v?.toMillis) return v.toMillis();           // Firestore Timestamp
  if (v?.toDate) return v.toDate().getTime();     // Timestamp-like
  if (v instanceof Date) return v.getTime();      // Date
  const t = new Date(v).getTime();                // string/number
  return Number.isFinite(t) ? t : 0;
}

function toText(v) {
  const ms = toMs(v);
  if (!ms) return "";
  return new Date(ms).toLocaleString();
}

export default function TimelineSection({ events = [] }) {
  const data = useMemo(() => {
    const copy = [...events];

    copy.sort((a, b) => {
      const ta = toMs(a.sortAt ?? a.createdAt ?? a.time);
      const tb = toMs(b.sortAt ?? b.createdAt ?? b.time);
      return tb - ta;
    });

    return copy;
  }, [events]);

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View>
          <Text style={S.kicker}>Admin</Text>
          <Text style={S.cardTitle}>System Timeline</Text>
          <Text style={S.subtitle}>Real-time updates from bookings & actions</Text>
        </View>
        <View style={S.pill}>
          <View style={S.pillDot} />
          <Text style={S.pillText}>Live</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => {
          // ✅ support: info | success | urgent | danger
          const tone = item.type || "info";
          const isSuccess = tone === "success";
          const isUrgent = tone === "urgent";
          const isDanger = tone === "danger";

          return (
            <View style={S.row}>
              <View style={S.rail}>
                <View
                  style={[
                    S.dot,
                    isSuccess && S.dotSuccess,
                    isUrgent && S.dotUrgent,
                    isDanger && S.dotDanger,
                  ]}
                />
                {index !== data.length - 1 && <View style={S.line} />}
              </View>

              <View
                style={[
                  S.eventCard,
                  isSuccess && S.eventSuccess,
                  isUrgent && S.eventUrgent,
                  isDanger && S.eventDanger,
                ]}
              >
                <View style={S.eventTop}>
                  <Text style={S.eventTitle} numberOfLines={1}>
                    {item.title || "Update"}
                  </Text>
                  <Text style={S.time}>{toText(item.createdAt) || toText(item.time) || ""}</Text>
                </View>

                {!!item.text && <Text style={S.eventText}>{item.text}</Text>}

                {!!item.meta && (
                  <View style={S.metaWrap}>
                    {Object.entries(item.meta)
                      .slice(0, 3)
                      .map(([k, v]) => (
                        <View key={k} style={S.metaPill}>
                          <Text style={S.metaText}>
                            {k}: <Text style={S.metaStrong}>{String(v)}</Text>
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={S.empty}>No activity yet.</Text>}
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

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  kicker: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  subtitle: { fontSize: 12, color: "#64748B", marginTop: 4, fontWeight: "700" },

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
  pillText: { fontSize: 12, fontWeight: "800", color: "#0F172A" },

  row: { flexDirection: "row", marginTop: 12 },
  rail: { width: 18, alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 10, backgroundColor: "#94A3B8", marginTop: 4 },
  dotSuccess: { backgroundColor: "#22C55E" },
  dotUrgent: { backgroundColor: "#F97316" },
  dotDanger: { backgroundColor: "#EF4444" },

  line: { width: 2, flex: 1, backgroundColor: "#E2E8F0", marginTop: 6, borderRadius: 2 },

  eventCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#FFFFFF",
  },
  eventSuccess: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  eventUrgent: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  eventDanger: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },

  eventTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  eventTitle: { fontSize: 13, fontWeight: "900", color: "#0F172A", flex: 1 },
  time: { fontSize: 11, color: "#64748B", fontWeight: "800" },
  eventText: { marginTop: 8, color: "#475569", fontSize: 12, lineHeight: 18, fontWeight: "600" },

  metaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaText: { fontSize: 11, color: "#475569", fontWeight: "800" },
  metaStrong: { color: "#0F172A", fontWeight: "900" },

  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, marginTop: 8, fontWeight: "700" },
});
