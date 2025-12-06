// screens/AdminHome/index.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

import HeaderSection from "./HeaderSection";
import TabBar from "./TabBar";
import KPICardsSection from "./KPICardsSection";
import PendingSection from "./PendingSection";
import ApprovedSection from "./ApprovedSection";
import DriversSection from "./DriversSection";
import CalendarSection from "./CalendarSection";
import TimelineSection from "./TimelineSection";
import VehiclesSection from "./VehiclesSection";

import { db } from "../../config/firebase";
import { collection, onSnapshot, query, updateDoc, doc, serverTimestamp } from "firebase/firestore";

// calendar helpers
const TODAY = new Date();
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

export default function AdminHome() {
  const router = useRouter();
  const isWide = Dimensions.get("window").width >= 920;

  const [activeTab, setActiveTab] = useState("Pending");
  const [requestsRaw, setRequestsRaw] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [month, setMonth] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth(),
  });

  const matrix = useMemo(() => buildMonthMatrix(month.year, month.month), [month]);

  // ✅ Real-time: ALL bookings
  useEffect(() => {
    const q = query(collection(db, "bookings")); // no orderBy to avoid index + serverTimestamp issues

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // sort client-side newest first
        rows.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return tb - ta;
        });

        setRequestsRaw(rows);
      },
      (err) => {
        console.log("Admin bookings onSnapshot error:", err);
        Alert.alert("Realtime error", err?.message || "Failed to listen to bookings");
      }
    );

    return unsub;
  }, []);

  // ✅ Make sure the UI always has "time"
  const requests = useMemo(() => {
    return requestsRaw.map((r) => ({
      ...r,
      status: (r.status || "pending").toLowerCase(),
      time: r.timeRange || r.time || "",
    }));
  }, [requestsRaw]);

  // ✅ Calendar booked map
  const booked = useMemo(() => {
    const map = {};
    for (const r of requests) {
      if ((r.status === "approved" || r.status === "completed") && r.date) {
        map[r.date] = true; // your date is already "YYYY-MM-DD"
      }
    }
    return map;
  }, [requests]);

  // ✅ KPIs
  const kpis = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const availableVehicles = vehicles.filter((v) => (v.status || "").toLowerCase() === "available").length;
    return { pending, approved, completed, availableVehicles };
  }, [requests, vehicles]);

  // ✅ Timeline derived from bookings (no /timeline needed)
  const events = useMemo(() => {
    return requests.slice(0, 40).map((b) => ({
      id: `ev-${b.id}`,
      type: b.urgent ? "urgent" : b.status === "approved" ? "success" : "info",
      title: `Booking ${String(b.status || "pending").toUpperCase()}`,
      text: `${b.purpose || "Booking"} • ${b.vehicle || ""} • ${b.destination || ""}`,
      meta: {
        user: b.email || b.userEmail || b.userId,
        date: b.date,
        time: b.timeRange || "",
      },
      time: b.createdAt?.toDate ? b.createdAt.toDate().toLocaleString() : "just now",
      createdAt: b.createdAt?.toDate ? b.createdAt.toDate() : null,
    }));
  }, [requests]);

  const onChangeMonth = useCallback(
    (delta) => {
      const next = new Date(month.year, month.month + delta, 1);
      setMonth({ year: next.getFullYear(), month: next.getMonth() });
    },
    [month.year, month.month]
  );

  const onSelectDate = useCallback((_dateStr) => {}, []);

  // ✅ Update booking status in /bookings
  const setRequestStatus = useCallback(async (bookingId, newStatus) => {
    try {
      console.log("ADMIN setRequestStatus:", bookingId, newStatus);

      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus, // must stay lowercase
        updatedAt: serverTimestamp(),
      });

      console.log("✅ status updated");
    } catch (e) {
      console.log("❌ setRequestStatus error:", e);
      Alert.alert("Error", e?.message || "Unable to update booking. Please try again.");
    }
  }, []);

  const onApprove = useCallback((id) => setRequestStatus(id, "approved"), [setRequestStatus]);

  const onDecline = useCallback(
    (id) => {
      console.log("DECLINE clicked:", id);

      // Web sometimes blocks native Alert UX; fallback to confirm() on web
      if (Platform.OS === "web") {
        const ok = window.confirm("Decline booking? This will cancel the booking request.");
        if (ok) setRequestStatus(id, "cancelled");
        return;
      }

      Alert.alert("Decline booking?", "This will cancel the booking request.", [
        { text: "No" },
        { text: "Yes, Decline", style: "destructive", onPress: () => setRequestStatus(id, "cancelled") },
      ]);
    },
    [setRequestStatus]
  );

  const onMarkComplete = useCallback(
    (id) => {
      console.log("MARK COMPLETE clicked:", id);

      if (Platform.OS === "web") {
        const ok = window.confirm("Mark complete? This will move the booking to Completed.");
        if (ok) setRequestStatus(id, "completed");
        return;
      }

      Alert.alert("Mark complete?", "This will move the booking to Completed.", [
        { text: "No" },
        { text: "Yes, Complete", onPress: () => setRequestStatus(id, "completed") },
      ]);
    },
    [setRequestStatus]
  );

  return (
    <View style={S.outer}>
      <View style={S.container}>
        <HeaderSection onSignOut={() => router.replace("/loginpage")} />

        <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
          <View style={S.content}>
            <KPICardsSection
              WIDE={isWide}
              pending={kpis.pending}
              approved={kpis.approved}
              completed={kpis.completed}
              availableVehicles={kpis.availableVehicles}
            />

            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

            <View style={S.sectionWrap}>
              {activeTab === "Pending" && (
                <PendingSection requests={requests} onApprove={onApprove} onDecline={onDecline} />
              )}

              {activeTab === "Approved" && (
                <ApprovedSection requests={requests} onMarkComplete={onMarkComplete} onCancel={onDecline} />
              )}

              {activeTab === "Drivers" && <DriversSection />}

              {activeTab === "Calendar" && <CalendarSection scopeLabel="Admin" />}

              {activeTab === "Timeline" && <TimelineSection events={events} />}

              {activeTab === "Vehicles" && <VehiclesSection vehicles={vehicles} />}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#F8FAFC", alignItems: "center" },
  container: { flex: 1, width: "100%", backgroundColor: "#F8FAFC" },
  scroll: { paddingTop: 14, paddingHorizontal: 18, paddingBottom: 60 },
  content: { width: "100%", maxWidth: 1400, alignSelf: "center" },
  sectionWrap: { marginTop: 10 },
});
