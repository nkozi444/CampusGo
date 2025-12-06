import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  Pressable,
} from "react-native";

import { db } from "../../config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// -------- Calendar helpers (self-contained) --------
const TODAY = new Date();
const pad2 = (n) => String(n).padStart(2, "0");

// IMPORTANT: date keys must match your stored booking.date = "YYYY-MM-DD"
const fmt = (d) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

function buildMonthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts?.toMillis === "function") return ts.toMillis();
  if (typeof ts === "number") return ts;
  const d = new Date(ts);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function prettyStatus(s) {
  const v = String(s || "pending").toLowerCase();
  return v === "pending"
    ? "Pending"
    : v === "approved"
    ? "Approved"
    : v === "completed"
    ? "Completed"
    : v === "cancelled"
    ? "Cancelled"
    : v;
}

export default function CalendarSection({ scopeLabel = "Admin" }) {
  const [month, setMonth] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth(),
  });
  const matrix = useMemo(() => buildMonthMatrix(month.year, month.month), [month]);

  const [selectedDate, setSelectedDate] = useState(fmt(TODAY));
  const [bookings, setBookings] = useState([]);
  const [busyId, setBusyId] = useState(null);

  // ✅ realtime: ALL bookings
  useEffect(() => {
    const q = query(collection(db, "bookings")); // no orderBy (safe)
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        setBookings(rows);
      },
      (err) => {
        console.log(`${scopeLabel} calendar bookings snapshot error:`, err);
        Alert.alert("Realtime error", err?.message || "Failed to load bookings");
      }
    );
    return () => unsub();
  }, [scopeLabel]);

  // Summary dots per day
  const dateSummary = useMemo(() => {
    const map = {};
    for (const b of bookings) {
      const dateKey = b.date; // stored as "YYYY-MM-DD"
      if (!dateKey) continue;

      const status = String(b.status || "pending").toLowerCase();
      if (!map[dateKey]) map[dateKey] = { pending: 0, booked: 0, cancelled: 0 };

      if (status === "pending") map[dateKey].pending += 1;
      if (status === "approved" || status === "completed") map[dateKey].booked += 1;
      if (status === "cancelled") map[dateKey].cancelled += 1;
    }
    return map;
  }, [bookings]);

  // Bookings list for selected day (includes cancelled ✅)
  const selectedBookings = useMemo(() => {
    const rows = bookings.filter((b) => b.date === selectedDate);
    const rank = (s) => {
      const v = String(s || "pending").toLowerCase();
      return v === "pending" ? 0 : v === "approved" ? 1 : v === "completed" ? 2 : 3; // cancelled last
    };
    return [...rows].sort((a, b) => rank(a.status) - rank(b.status));
  }, [bookings, selectedDate]);

  // Month title
  const title = useMemo(() => {
    return new Date(month.year, month.month).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [month.year, month.month]);

  // ✅ Month navigation (clickable fix: Pressable + hitSlop)
  const changeMonth = useCallback((delta) => {
    setMonth((m) => {
      const next = new Date(m.year, m.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }, []);

  // ✅ Status update actions
  const setStatus = useCallback(async (bookingId, newStatus) => {
    try {
      setBusyId(bookingId);
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(`${scopeLabel} calendar setStatus error:`, e);
      Alert.alert("Error", e?.message || "Failed to update booking");
    } finally {
      setBusyId(null);
    }
  }, [scopeLabel]);

  const confirmCancel = useCallback(
    (bookingId) => {
      Alert.alert("Cancel booking?", "This will mark the booking as Cancelled.", [
        { text: "No" },
        { text: "Yes, Cancel", style: "destructive", onPress: () => setStatus(bookingId, "cancelled") },
      ]);
    },
    [setStatus]
  );

  const confirmComplete = useCallback(
    (bookingId) => {
      Alert.alert("Mark completed?", "This will mark the booking as Completed.", [
        { text: "No" },
        { text: "Yes, Complete", onPress: () => setStatus(bookingId, "completed") },
      ]);
    },
    [setStatus]
  );

  return (
    <View style={S.card} pointerEvents="box-none">
      <View style={S.headerRow} pointerEvents="box-none">
        <View>
          <Text style={S.kicker}>{scopeLabel}</Text>
          <Text style={S.cardTitle}>Calendar (All Bookings)</Text>
          <Text style={S.subtitle}>Tap a date to review & manage requests</Text>
        </View>

        <View style={S.pill} pointerEvents="none">
          <View style={S.pillDot} />
          <Text style={S.pillText}>Live</Text>
        </View>
      </View>

      {/* Month nav */}
      <View style={S.calHead} pointerEvents="box-none">
        <Pressable
          style={S.navBtn}
          onPress={() => changeMonth(-1)}
          hitSlop={12}
        >
          <Text style={S.calNav}>‹</Text>
        </Pressable>

        <View style={S.calTitleWrap} pointerEvents="none">
          <Text style={S.calTitle}>{title}</Text>
          <Text style={S.calSub}>Selected: {selectedDate}</Text>
        </View>

        <Pressable
          style={S.navBtn}
          onPress={() => changeMonth(1)}
          hitSlop={12}
        >
          <Text style={S.calNav}>›</Text>
        </Pressable>
      </View>

      {/* Week labels */}
      <View style={S.weekRow} pointerEvents="none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Text key={d} style={S.weekText}>
            {d}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={S.grid} pointerEvents="box-none">
        {matrix.map((week, i) => (
          <View key={i} style={S.weekRow} pointerEvents="box-none">
            {week.map((d, j) => {
              if (!d) return <View key={j} style={S.cellEmpty} />;

              const key = fmt(d);
              const isToday = key === fmt(TODAY);
              const isSelected = key === selectedDate;

              const summary = dateSummary[key] || { pending: 0, booked: 0, cancelled: 0 };
              const hasPending = summary.pending > 0;
              const hasBooked = summary.booked > 0;

              return (
                <Pressable
                  key={j}
                  onPress={() => setSelectedDate(key)}
                  style={({ pressed }) => [
                    S.cell,
                    isToday && S.cellToday,
                    isSelected && S.cellSelected,
                    hasBooked && S.cellBooked,
                    hasPending && S.cellPending,
                    pressed && { opacity: 0.9 },
                  ]}
                  hitSlop={6}
                >
                  <View style={S.cellInner} pointerEvents="none">
                    <Text style={S.cellNum}>{d.getDate()}</Text>

                    <View style={S.badgesRow}>
                      {hasBooked && <View style={[S.dot, S.dotBooked]} />}
                      {hasPending && <View style={[S.dot, S.dotPending]} />}
                      {summary.cancelled > 0 && <View style={[S.dot, S.dotCancelled]} />}
                    </View>

                    {(hasBooked || hasPending) && (
                      <Text style={S.smallCount}>
                        {summary.booked ? `${summary.booked} booked` : ""}
                        {summary.booked && summary.pending ? " • " : ""}
                        {summary.pending ? `${summary.pending} pending` : ""}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={S.legendRow} pointerEvents="none">
        <View style={S.legendItem}>
          <View style={[S.legendDot, S.dotBooked]} />
          <Text style={S.legendText}>Booked (approved/completed)</Text>
        </View>
        <View style={S.legendItem}>
          <View style={[S.legendDot, S.dotPending]} />
          <Text style={S.legendText}>Pending</Text>
        </View>
        <View style={S.legendItem}>
          <View style={[S.legendDot, S.dotCancelled]} />
          <Text style={S.legendText}>Cancelled</Text>
        </View>
      </View>

      {/* Selected day details */}
      <View style={S.dayBox} pointerEvents="box-none">
        <Text style={S.dayTitle}>Bookings on {selectedDate}</Text>

        <FlatList
          data={selectedBookings}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={S.empty}>No bookings on this date.</Text>}
          renderItem={({ item }) => {
            const status = String(item.status || "pending").toLowerCase();
            const timeRange =
              item.timeRange || `${item.startTimeLabel || ""} - ${item.endTimeLabel || ""}`.trim();

            const disabled = busyId === item.id;

            return (
              <View style={S.bookingCard}>
                <View style={S.bookingTop}>
                  <Text style={S.bookingTitle} numberOfLines={1}>
                    {item.purpose || "Booking"}{" "}
                    {item.urgent ? <Text style={S.urgent}>URGENT</Text> : null}
                  </Text>

                  <View
                    style={[
                      S.statusPill,
                      status === "pending" && S.pendingPill,
                      status === "approved" && S.approvedPill,
                      status === "completed" && S.completedPill,
                      status === "cancelled" && S.cancelledPill,
                    ]}
                  >
                    <Text style={S.statusText}>{prettyStatus(status)}</Text>
                  </View>
                </View>

                <Text style={S.meta}>🚍 {item.vehicle || "—"} • ⏰ {timeRange || "—"}</Text>
                <Text style={S.meta}>📍 {item.destination || "—"} • 👤 {item.passengers || 1}</Text>
                <Text style={S.metaSmall}>👤 {item.email || "—"}</Text>

                <View style={S.actionsRow} pointerEvents="box-none">
                  {status === "pending" && (
                    <>
                      <Pressable
                        style={[S.actionBtn, S.approveBtn, disabled && S.btnDisabled]}
                        onPress={() => setStatus(item.id, "approved")}
                        disabled={disabled}
                        hitSlop={10}
                      >
                        <Text style={S.approveText}>{disabled ? "Working..." : "Approve"}</Text>
                      </Pressable>

                      <Pressable
                        style={[S.actionBtn, S.cancelBtn, disabled && S.btnDisabled]}
                        onPress={() => confirmCancel(item.id)}
                        disabled={disabled}
                        hitSlop={10}
                      >
                        <Text style={S.cancelText}>Cancel</Text>
                      </Pressable>
                    </>
                  )}

                  {status === "approved" && (
                    <>
                      <Pressable
                        style={[S.actionBtn, S.completeBtn, disabled && S.btnDisabled]}
                        onPress={() => confirmComplete(item.id)}
                        disabled={disabled}
                        hitSlop={10}
                      >
                        <Text style={S.completeText}>Mark Complete</Text>
                      </Pressable>

                      <Pressable
                        style={[S.actionBtn, S.cancelBtn, disabled && S.btnDisabled]}
                        onPress={() => confirmCancel(item.id)}
                        disabled={disabled}
                        hitSlop={10}
                      >
                        <Text style={S.cancelText}>Cancel</Text>
                      </Pressable>
                    </>
                  )}

                  {(status === "completed" || status === "cancelled") && (
                    <Text style={S.readOnly}>No actions for {prettyStatus(status)} bookings.</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  kicker: { fontSize: 11, color: "#64748B", letterSpacing: 0.6, textTransform: "uppercase" },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  subtitle: { fontSize: 12, color: "#64748B", marginTop: 6, fontWeight: "700" },

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
  pillText: { fontSize: 12, fontWeight: "900", color: "#0F172A" },

  calHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  navBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calNav: { fontSize: 22, color: "#334155", fontWeight: "900" },
  calTitleWrap: { flex: 1, alignItems: "center" },
  calTitle: { fontWeight: "900", fontSize: 14, color: "#0F172A" },
  calSub: { fontSize: 11, color: "#64748B", marginTop: 2, fontWeight: "700" },

  weekRow: { flexDirection: "row" },
  weekText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#94A3B8",
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: "800",
  },

  grid: { marginTop: 2 },
  cellEmpty: { flex: 1, padding: 6 },

  cell: {
    flex: 1,
    minHeight: 64,
    margin: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  cellInner: { flex: 1, paddingTop: 10, paddingBottom: 8, paddingHorizontal: 8, alignItems: "center" },
  cellNum: { fontWeight: "900", color: "#0F172A", fontSize: 13 },

  cellToday: { borderColor: "#2563EB", borderWidth: 1.5, backgroundColor: "#EFF6FF" },
  cellSelected: { borderColor: "#0B5ED7", borderWidth: 2 },
  cellBooked: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  cellPending: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },

  badgesRow: { flexDirection: "row", gap: 6, marginTop: 8, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 50 },
  dotBooked: { backgroundColor: "#F97316" },
  dotPending: { backgroundColor: "#F59E0B" },
  dotCancelled: { backgroundColor: "#EF4444" },

  smallCount: { marginTop: 6, fontSize: 10, color: "#64748B", fontWeight: "800" },

  legendRow: { flexDirection: "row", marginTop: 12, flexWrap: "wrap", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 10, marginRight: 8 },
  legendText: { color: "#475569", fontSize: 12, fontWeight: "700" },

  dayBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
  },
  dayTitle: { fontSize: 14, fontWeight: "900", color: "#0F172A", marginBottom: 10 },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, fontWeight: "700" },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEF6",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  bookingTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  bookingTitle: { fontSize: 13, fontWeight: "900", color: "#0F172A", flex: 1 },
  urgent: { color: "#B91C1C", fontWeight: "900" },

  meta: { marginTop: 8, color: "#475569", fontWeight: "700", fontSize: 12 },
  metaSmall: { marginTop: 8, color: "#94A3B8", fontWeight: "700", fontSize: 11 },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  statusText: { fontSize: 11, fontWeight: "900", color: "#0F172A" },
  pendingPill: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  approvedPill: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  completedPill: { backgroundColor: "#DCFCE7", borderColor: "#86EFAD" },
  cancelledPill: { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },

  actionsRow: { flexDirection: "row", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },

  approveBtn: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  approveText: { color: "#166534", fontWeight: "900" },

  cancelBtn: { backgroundColor: "#FFF1F2", borderColor: "#FECACA" },
  cancelText: { color: "#991B1B", fontWeight: "900" },

  completeBtn: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  completeText: { color: "#1D4ED8", fontWeight: "900" },

  btnDisabled: { opacity: 0.6 },
  readOnly: { color: "#94A3B8", fontSize: 12, fontWeight: "800" },
});
