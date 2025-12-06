import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { db } from "../../config/firebase";
import { collection, doc, onSnapshot, query, updateDoc, serverTimestamp } from "firebase/firestore";

const VEHICLE_STATUSES = ["available", "assigned", "maintenance", "unavailable"];

function cap(s) {
  const v = String(s || "");
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
}

function statusLabel(s) {
  const v = String(s || "available").toLowerCase();
  if (v === "unavailable") return "Unavailable";
  return cap(v);
}

export default function VehiclesSection({ router }) {
  const [vehicles, setVehicles] = useState([]);
  const [qText, setQText] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Realtime subscribe
  useEffect(() => {
    const q = query(collection(db, "vehicles"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Optional: stable sort by name / plate
        rows.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
        setVehicles(rows);
      },
      (err) => {
        console.log("vehicles snapshot error:", err);
        Alert.alert("Realtime error", err?.message || "Failed to load vehicles");
      }
    );
    return unsub;
  }, []);

  const counts = useMemo(() => {
    const c = { total: vehicles.length, available: 0, assigned: 0, maintenance: 0, unavailable: 0 };
    for (const v of vehicles) {
      const s = String(v.status || "available").toLowerCase();
      if (c[s] != null) c[s] += 1;
    }
    return c;
  }, [vehicles]);

  const filtered = useMemo(() => {
    const t = qText.trim().toLowerCase();
    if (!t) return vehicles;
    return vehicles.filter((v) => {
      const hay = [
        v.name,
        v.plateNo,
        v.type,
        v.model,
        v.color,
        v.notes,
        v.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(t);
    });
  }, [vehicles, qText]);

  const setStatus = useCallback(async (vehicleId, newStatus) => {
    try {
      setBusyId(vehicleId);
      await updateDoc(doc(db, "vehicles", vehicleId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log("vehicle setStatus error:", e);
      Alert.alert("Error", e?.message || "Failed to update vehicle");
    } finally {
      setBusyId(null);
    }
  }, []);

  const renderStatusPill = (status) => {
    const s = String(status || "available").toLowerCase();
    return (
      <View
        style={[
          S.statusPill,
          s === "available" && S.pillAvail,
          s === "assigned" && S.pillAssigned,
          s === "maintenance" && S.pillMaint,
          s === "unavailable" && S.pillUnavail,
        ]}
      >
        <Text style={S.statusText}>{statusLabel(s)}</Text>
      </View>
    );
  };

  return (
    <View style={S.card}>
      <View style={S.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={S.kicker}>Fleet</Text>
          <Text style={S.title}>Vehicles</Text>
          <Text style={S.sub}>Realtime fleet status & availability</Text>
        </View>

        <TouchableOpacity
          style={S.openBtn}
          onPress={() => router?.push?.("/vehicles")}
          activeOpacity={0.85}
        >
          <Text style={S.openBtnText}>Open Full Page</Text>
        </TouchableOpacity>
      </View>

      {/* KPI row */}
      <View style={S.kpiRow}>
        <View style={[S.kpiCard, S.kpiAvail]}>
          <Text style={S.kpiLabel}>Available</Text>
          <Text style={S.kpiValue}>{counts.available}</Text>
        </View>
        <View style={[S.kpiCard, S.kpiAssigned]}>
          <Text style={S.kpiLabel}>Assigned</Text>
          <Text style={S.kpiValue}>{counts.assigned}</Text>
        </View>
        <View style={[S.kpiCard, S.kpiMaint]}>
          <Text style={S.kpiLabel}>Maintenance</Text>
          <Text style={S.kpiValue}>{counts.maintenance}</Text>
        </View>
        <View style={[S.kpiCard, S.kpiTotal]}>
          <Text style={S.kpiLabel}>Total</Text>
          <Text style={S.kpiValue}>{counts.total}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={S.searchWrap}>
        <TextInput
          value={qText}
          onChangeText={setQText}
          placeholder="Search by name, plate, type..."
          placeholderTextColor="#94A3B8"
          style={S.search}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={S.empty}>No vehicles found. Create a “vehicles” collection and add docs.</Text>}
        renderItem={({ item }) => {
          const s = String(item.status || "available").toLowerCase();
          const disabled = busyId === item.id;

          return (
            <View style={S.item}>
              <View style={S.itemTop}>
                <Text style={S.itemTitle} numberOfLines={1}>
                  🚘 {item.name || item.model || "Vehicle"}{" "}
                  {!!item.plateNo && <Text style={S.muted}>({item.plateNo})</Text>}
                </Text>
                {renderStatusPill(s)}
              </View>

              <Text style={S.meta}>
                {item.type ? `Type: ${item.type}` : "Type: —"} •{" "}
                {item.capacity ? `Capacity: ${item.capacity}` : "Capacity: —"}
              </Text>

              {!!item.notes && <Text style={S.metaSmall}>Notes: {item.notes}</Text>}

              <View style={S.actionsRow}>
                {VEHICLE_STATUSES.map((st) => {
                  const on = st === s;
                  return (
                    <TouchableOpacity
                      key={st}
                      disabled={disabled || on}
                      onPress={() => setStatus(item.id, st)}
                      activeOpacity={0.85}
                      style={[
                        S.chip,
                        on && S.chipOn,
                        (disabled || on) && S.chipDisabled,
                      ]}
                    >
                      <Text style={[S.chipText, on && S.chipTextOn]}>
                        {disabled && !on ? "..." : statusLabel(st)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
    borderWidth: 1,
    borderColor: "#E8EEF6",
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#0B1220", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 3 },
    }),
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  kicker: { fontSize: 11, color: "#64748B", letterSpacing: 0.6, textTransform: "uppercase" },
  title: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  sub: { fontSize: 12, color: "#64748B", marginTop: 6, fontWeight: "700" },

  openBtn: { backgroundColor: "#DCFCE7", borderWidth: 1, borderColor: "#86EFAD", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  openBtnText: { color: "#15803D", fontWeight: "900", fontSize: 12 },

  kpiRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  kpiCard: { flex: 1, borderRadius: 14, padding: 12, borderWidth: 1 },
  kpiLabel: { fontSize: 12, color: "#334155", fontWeight: "800" },
  kpiValue: { fontSize: 22, fontWeight: "900", marginTop: 6, color: "#0F172A" },
  kpiAvail: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  kpiAssigned: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  kpiMaint: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  kpiTotal: { backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" },

  searchWrap: { marginBottom: 10 },
  search: { borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "#0F172A", fontWeight: "700" },

  item: { borderWidth: 1, borderColor: "#E8EEF6", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 12 },
  itemTop: { flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "center" },
  itemTitle: { flex: 1, fontWeight: "900", color: "#0F172A" },
  muted: { color: "#64748B", fontWeight: "800" },

  statusPill: { borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#F8FAFC" },
  statusText: { fontSize: 11, fontWeight: "900", color: "#0F172A" },
  pillAvail: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  pillAssigned: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  pillMaint: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  pillUnavail: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },

  meta: { marginTop: 8, color: "#475569", fontWeight: "700", fontSize: 12 },
  metaSmall: { marginTop: 6, color: "#94A3B8", fontWeight: "700", fontSize: 11 },

  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: { borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
  chipOn: { backgroundColor: "#0B5ED7", borderColor: "#0B5ED7" },
  chipText: { color: "#0F172A", fontWeight: "900", fontSize: 12 },
  chipTextOn: { color: "#FFFFFF" },
  chipDisabled: { opacity: 0.6 },

  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12, fontWeight: "700" },
});
