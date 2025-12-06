// screens/SuperAdminHome/BookingsSection.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";

import { db } from "../../config/firebase";
import { collection, doc, onSnapshot, query, updateDoc, serverTimestamp } from "firebase/firestore";

const FILTERS = ["All", "Pending", "Approved", "Completed", "Cancelled"];

function normalizeStatus(s) {
  const v = String(s || "pending").toLowerCase();
  // keep only supported values
  if (v === "pending" || v === "approved" || v === "completed" || v === "cancelled") return v;
  return "pending";
}

function prettyStatus(s) {
  const v = normalizeStatus(s);
  return v === "pending"
    ? "Pending"
    : v === "approved"
    ? "Approved"
    : v === "completed"
    ? "Completed"
    : "Cancelled";
}

function safeMs(v) {
  if (!v) return 0;
  if (typeof v?.toMillis === "function") return v.toMillis(); // Firestore Timestamp
  if (typeof v?.toDate === "function") return v.toDate().getTime();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function safeDateTime(v) {
  const ms = safeMs(v);
  return ms ? new Date(ms).toLocaleString() : "—";
}

function buildTimeRange(item) {
  const tr = (item.timeRange || "").trim();
  if (tr) return tr;

  const start = (item.startTimeLabel || "").trim();
  const end = (item.endTimeLabel || "").trim();
  const combined = `${start}${start && end ? " - " : ""}${end}`.trim();

  return combined || "—";
}

function confirmUI(title, message, onYes) {
  if (Platform.OS === "web") {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) onYes?.();
    return;
  }
  Alert.alert(title, message, [{ text: "No" }, { text: "Yes", onPress: onYes }]);
}

export default function BookingsSection({ router }) {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [busyId, setBusyId] = useState(null);

  // UX
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ realtime: ALL bookings
  useEffect(() => {
    const q = query(collection(db, "bookings")); // no orderBy => avoids index/timestamp issues in dev
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(rows);
      },
      (err) => {
        console.log("SuperAdmin bookings snapshot error:", err);
        Alert.alert("Realtime error", err?.message || "Failed to load bookings");
      }
    );

    return () => unsub();
  }, []);

  // KPI counts
  const counts = useMemo(() => {
    const c = { all: bookings.length, pending: 0, approved: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const s = normalizeStatus(b.status);
      c[s] += 1;
    });
    return c;
  }, [bookings]);

  const setStatus = useCallback(async (bookingId, newStatus) => {
    try {
      setBusyId(bookingId);
      await updateDoc(doc(db, "bookings", bookingId), {
        status: normalizeStatus(newStatus), // always lowercase valid status
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log("SuperAdmin setStatus error:", e);
      Alert.alert("Error", e?.message || "Failed to update booking");
    } finally {
      setBusyId(null);
    }
  }, []);

  const confirmCancel = useCallback(
    (bookingId) => {
      confirmUI("Cancel booking?", "This will mark the booking as Cancelled.", () =>
        setStatus(bookingId, "cancelled")
      );
    },
    [setStatus]
  );

  const confirmComplete = useCallback(
    (bookingId) => {
      confirmUI("Mark completed?", "This will mark the booking as Completed.", () =>
        setStatus(bookingId, "completed")
      );
    },
    [setStatus]
  );

  const confirmApprove = useCallback(
    (bookingId) => {
      confirmUI("Approve booking?", "This will approve the booking request.", () =>
        setStatus(bookingId, "approved")
      );
    },
    [setStatus]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    let rows = bookings.map((b) => ({
      ...b,
      status: normalizeStatus(b.status),
    }));

    // filter by status
    if (activeFilter !== "All") {
      const target = activeFilter.toLowerCase();
      rows = rows.filter((b) => b.status === target);
    }

    // search
    if (term) {
      rows = rows.filter((b) => {
        const hay = [
          b.email,
          b.userEmail,
          b.userName,
          b.destination,
          b.purpose,
          b.vehicle,
          b.date,
          b.timeRange,
          b.startTimeLabel,
          b.endTimeLabel,
          b.userId,
        ]
          .filter(Boolean)
          .join(" · ")
          .toLowerCase();
        return hay.includes(term);
      });
    }

    // sort by createdAt (fallback to updatedAt, then 0)
    rows.sort((a, b) => {
      const ta = safeMs(a.createdAt) || safeMs(a.updatedAt) || 0;
      const tb = safeMs(b.createdAt) || safeMs(b.updatedAt) || 0;
      return sortNewest ? tb - ta : ta - tb;
    });

    return rows;
  }, [bookings, activeFilter, search, sortNewest]);

  const onRefresh = useCallback(() => {
    // We’re realtime already. This is just UX.
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 350);
  }, []);

  const renderChip = (label) => {
    const isOn = activeFilter === label;
    const count =
      label === "All"
        ? counts.all
        : label === "Pending"
        ? counts.pending
        : label === "Approved"
        ? counts.approved
        : label === "Completed"
        ? counts.completed
        : counts.cancelled;

    return (
      <TouchableOpacity
        key={label}
        style={[S.chip, isOn && S.chipOn]}
        onPress={() => setActiveFilter(label)}
        activeOpacity={0.85}
      >
        <Text style={[S.chipText, isOn && S.chipTextOn]}>{label}</Text>
        <View style={[S.chipBadge, isOn && S.chipBadgeOn]}>
          <Text style={[S.chipBadgeText, isOn && S.chipBadgeTextOn]}>{count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={S.kicker}>SuperAdmin</Text>
          <Text style={S.title}>All Transportation Bookings</Text>
          <Text style={S.sub}>Real-time view across the whole system</Text>
        </View>

        <View style={{ gap: 10, alignItems: "flex-end" }}>
          <TouchableOpacity
            style={S.openBtn}
            onPress={() => router?.push?.("/bookings")}
            activeOpacity={0.85}
          >
            <Text style={S.openBtnText}>Open Full Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.sortBtn}
            onPress={() => setSortNewest((v) => !v)}
            activeOpacity={0.85}
          >
            <Text style={S.sortBtnText}>{sortNewest ? "Newest first" : "Oldest first"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={S.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search email, destination, purpose, vehicle..."
          placeholderTextColor="#94A3B8"
          style={S.search}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")} style={S.clearBtn} activeOpacity={0.85}>
            <Text style={S.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={S.chipsRow}>{FILTERS.map(renderChip)}</View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={S.empty}>No bookings found.</Text>}
        renderItem={({ item }) => {
          const status = normalizeStatus(item.status);
          const statusLabel = prettyStatus(status);

          const created = safeDateTime(item.createdAt);
          const updated = item.updatedAt ? safeDateTime(item.updatedAt) : null;
          const timeRange = buildTimeRange(item);
          const disabled = busyId === item.id;

          return (
            <View
              style={[
                S.item,
                status === "approved" && S.itemApproved,
                status === "completed" && S.itemCompleted,
                status === "cancelled" && S.itemCancelled,
                status === "pending" && S.itemPending,
              ]}
            >
              <View style={S.itemTop}>
                <Text style={S.itemTitle} numberOfLines={1}>
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
                  <Text style={S.statusText}>{statusLabel}</Text>
                </View>
              </View>

              <Text style={S.meta}>
                🚍 {item.vehicle || "—"} • 📅 {item.date || "—"} • ⏰ {timeRange}
              </Text>
              <Text style={S.meta}>📍 {item.destination || "—"} • 👤 {item.passengers ?? 1}</Text>

              <Text style={S.metaSmall}>
                👤 {item.email || item.userEmail || "—"} • Created {created}
                {updated ? ` • Updated ${updated}` : ""}
              </Text>

              <View style={S.actionsRow}>
                {status === "pending" && (
                  <>
                    <TouchableOpacity
                      style={[S.actionBtn, S.approveBtn, disabled && S.btnDisabled]}
                      onPress={() => confirmApprove(item.id)}
                      disabled={disabled}
                      activeOpacity={0.85}
                    >
                      <Text style={S.approveText}>{disabled ? "Working..." : "Approve"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[S.actionBtn, S.cancelBtn, disabled && S.btnDisabled]}
                      onPress={() => confirmCancel(item.id)}
                      disabled={disabled}
                      activeOpacity={0.85}
                    >
                      <Text style={S.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}

                {status === "approved" && (
                  <>
                    <TouchableOpacity
                      style={[S.actionBtn, S.completeBtn, disabled && S.btnDisabled]}
                      onPress={() => confirmComplete(item.id)}
                      disabled={disabled}
                      activeOpacity={0.85}
                    >
                      <Text style={S.completeText}>Mark Complete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[S.actionBtn, S.cancelBtn, disabled && S.btnDisabled]}
                      onPress={() => confirmCancel(item.id)}
                      disabled={disabled}
                      activeOpacity={0.85}
                    >
                      <Text style={S.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}

                {(status === "completed" || status === "cancelled") && (
                  <Text style={S.readOnly}>No actions available for {statusLabel} bookings.</Text>
                )}
              </View>
            </View>
          );
        }}
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

  headerRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  kicker: { fontSize: 11, color: "#64748B", letterSpacing: 0.6, textTransform: "uppercase" },
  title: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  sub: { fontSize: 12, color: "#64748B", marginTop: 6, fontWeight: "700" },

  openBtn: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  openBtnText: { color: "#1D4ED8", fontWeight: "900", fontSize: 12 },

  sortBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sortBtnText: { color: "#0F172A", fontWeight: "900", fontSize: 12 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  search: { flex: 1, fontWeight: "800", color: "#0F172A", fontSize: 12 },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  clearText: { fontWeight: "900", color: "#334155", fontSize: 12 },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  chipOn: { backgroundColor: "#0B5ED7", borderColor: "#0B5ED7" },
  chipText: { color: "#0F172A", fontWeight: "900", fontSize: 12 },
  chipTextOn: { color: "#FFFFFF" },
  chipBadge: {
    minWidth: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  chipBadgeOn: { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.25)" },
  chipBadgeText: { fontWeight: "900", color: "#0F172A", fontSize: 12 },
  chipBadgeTextOn: { color: "#FFFFFF" },

  item: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  // subtle tinted backgrounds
  itemPending: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  itemApproved: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  itemCompleted: { backgroundColor: "#DCFCE7", borderColor: "#86EFAD" },
  itemCancelled: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },

  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  itemTitle: { fontSize: 13, fontWeight: "900", color: "#0F172A", flex: 1 },
  urgent: { color: "#B91C1C", fontWeight: "900" },

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

  meta: { marginTop: 8, color: "#475569", fontWeight: "800", fontSize: 12 },
  metaSmall: { marginTop: 8, color: "#94A3B8", fontWeight: "800", fontSize: 11 },

  actionsRow: { flexDirection: "row", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },

  approveBtn: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  approveText: { color: "#166534", fontWeight: "900" },

  cancelBtn: { backgroundColor: "#FFF1F2", borderColor: "#FECACA" },
  cancelText: { color: "#991B1B", fontWeight: "900" },

  completeBtn: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  completeText: { color: "#1D4ED8", fontWeight: "900" },

  btnDisabled: { opacity: 0.6 },

  readOnly: { color: "#94A3B8", fontSize: 12, fontWeight: "900" },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, fontWeight: "800" },
});
