// screens/UserHome/index.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import { TODAY, monthMatrix } from "./utils";

import HeaderSection from "./HeaderSection";
import TabBar from "./TabBar";
import CalendarSection from "./CalendarSection";
import NewRequestSection from "./NewRequestSection";
import RequestsSection from "./RequestsSection";
import UpdatesSection from "./UpdatesSection";
import HistorySection from "./HistorySection";

import { auth, db } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function UserHome() {
  const router = useRouter();

  const [active, setActive] = useState("Calendar");
  const [month, setMonth] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth(),
  });

  // ✅ Auth-ready user state
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Real-time bookings from Firestore
  const [requests, setRequests] = useState([]);

  // ✅ MUST HAVE: Auth watcher (otherwise authReady/user never update)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("AUTH STATE:", u?.uid, u?.email);
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // ✅ Realtime listener (NO orderBy; sort client-side)
  useEffect(() => {
    if (!authReady) return;

    if (!user?.uid) {
      console.log("No user -> clearing requests");
      setRequests([]);
      return;
    }

    console.log("Listening bookings (NO orderBy) for userId:", user.uid);

    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        rows.sort((a, b) => {
          const ta =
            a.createdAt?.toMillis?.() ??
            a.createdAtClient?.toMillis?.() ??
            0;
          const tb =
            b.createdAt?.toMillis?.() ??
            b.createdAtClient?.toMillis?.() ??
            0;
          return tb - ta;
        });

        console.log("BOOKINGS SNAPSHOT SIZE:", rows.length);
        setRequests(rows);
      },
      (err) => {
        console.log("UserHome bookings snapshot error:", err);
        Alert.alert("Realtime error", err?.message || "Failed to listen to bookings");
      }
    );

    return unsub;
  }, [authReady, user?.uid]);

  // ✅ Updates derived from requests
  const updates = useMemo(() => {
    const recent = requests.slice(0, 8).map((r) => ({
      id: `u-${r.id}`,
      title: `Request ${String(r.status || "updated").toUpperCase()}`,
      text: `${r.purpose || "Booking"} • ${r.vehicle || ""} • ${r.destination || ""}`,
      type: r.urgent ? "urgent" : r.status === "approved" ? "success" : "info",
      time:
        r.createdAt?.toDate
          ? r.createdAt.toDate().toLocaleString()
          : "just now",
    }));

    if (recent.length === 0) {
      return [
        {
          id: "u-welcome",
          title: "Welcome",
          text: "Your requests will appear here once you submit a booking.",
          type: "info",
          time: "now",
        },
      ];
    }
    return recent;
  }, [requests]);

  const matrix = useMemo(() => monthMatrix(month.year, month.month), [month]);

  // Calendar dots: only mark booked if approved/completed (your choice)
  const booked = useMemo(() => {
    const m = {};
    requests.forEach((r) => {
      if ((r.status === "approved" || r.status === "completed") && r.date) {
        m[r.date] = (m[r.date] || 0) + 1;
      }
    });
    return m;
  }, [requests]);

  function changeMonth(delta) {
    let { year, month: m } = month;
    m += delta;
    if (m < 0) {
      m = 11;
      year -= 1;
    } else if (m > 11) {
      m = 0;
      year += 1;
    }
    setMonth({ year, month: m });
  }

  function handleDateSelected() {
    setActive("My Requests");
  }

  const handleSubmitRequest = useCallback(() => {
    setActive("My Requests");
  }, []);

  const userCannotSetStatus = useCallback(() => {
    Alert.alert("Not allowed", "Only Admin/Superadmin can change booking status.");
  }, []);

  return (
    <View style={S.shell}>
      <View style={S.container}>
        <HeaderSection onSignOut={() => router.replace("/loginpage")} />

        <ScrollView contentContainerStyle={S.scrollContainer}>
          <View style={S.contentWrapper}>
            {/* ✅ Debug counter */}
            <View style={{ paddingVertical: 8 }}>
              <Text>Realtime bookings loaded: {requests.length}</Text>
            </View>

            <TabBar active={active} setActive={setActive} />

            {active === "Calendar" && (
              <CalendarSection
                month={month}
                matrix={matrix}
                booked={booked}
                onChangeMonth={changeMonth}
                onSelectDate={handleDateSelected}
              />
            )}

            {active === "New Request" && (
              <NewRequestSection onSubmitRequest={handleSubmitRequest} />
            )}

            {active === "My Requests" && (
              <RequestsSection
                requests={requests.map((r) => ({
                  ...r,
                  status: r.status || "pending",
                  time: r.timeRange || r.time || "",
                }))}
                onSetStatus={userCannotSetStatus}
                userRole="user"
              />
            )}

            {active === "Updates" && <UpdatesSection updates={updates} />}

            {active === "History" && (
              <HistorySection
                requests={requests.map((r) => ({
                  ...r,
                  status: r.status || "pending",
                  time: r.timeRange || r.time || "",
                }))}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F3F4F6",
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 1400,
    alignSelf: "center",
  },
});
