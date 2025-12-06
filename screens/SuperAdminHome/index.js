// screens/SuperAdminHome/index.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Alert, Text } from "react-native";
import { useRouter } from "expo-router";

import HeaderSection from "./HeaderSection";
import TabBar from "./TabBar";
import KPICardsSection from "./KPICardsSection";

// Tab content sections
import OverviewSection from "./OverviewSection";
import UsersSection from "./UsersSection";
import ActivitiesSection from "./ActivitiesSection";
import BookingsSection from "./BookingsSection";
import CalendarSection from "./CalendarSection";
import VehiclesSection from "./VehiclesSection";
import DriversSection from "./DriversSection";

import { auth, db } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";

const WIDE = Dimensions.get("window").width >= 920;

export default function SuperAdminHome() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  // ✅ auth-safe
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ realtime data
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeline, setTimeline] = useState([]); // optional if you have it

  // --- AUTH: wait for session before attaching listeners
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("SUPERADMIN AUTH:", u?.uid, u?.email);
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // --- REALTIME: bookings (system-wide)
  useEffect(() => {
    if (!authReady) return;

    const q = query(collection(db, "bookings"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // ✅ client-side sort (safe even if createdAt missing for some docs)
        rows.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return tb - ta;
        });

        setBookings(rows);
      },
      (err) => {
        console.log("SuperAdmin bookings snapshot error:", err);
        Alert.alert("Realtime error", err?.message || "Failed to listen to bookings");
      }
    );

    return unsub;
  }, [authReady]);

  // --- REALTIME: users (system-wide)
  useEffect(() => {
    if (!authReady) return;

    const q = query(collection(db, "users"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(rows);
      },
      (err) => {
        console.log("SuperAdmin users snapshot error:", err);
      }
    );

    return unsub;
  }, [authReady]);

  // --- OPTIONAL: timeline collection (only if it exists)
  useEffect(() => {
    if (!authReady) return;

    const q = query(collection(db, "timeline"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        rows.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? new Date(a.time || 0).getTime() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? new Date(b.time || 0).getTime() ?? 0;
          return tb - ta;
        });

        setTimeline(rows);
      },
      (err) => {
        // If you don't have this collection, you'll see logs—it's safe to keep or remove.
        console.log("SuperAdmin timeline snapshot error (ok if none):", err?.message || err);
      }
    );

    return unsub;
  }, [authReady]);

  // --- KPIs computed from bookings/users
  const kpis = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    const activeUsers = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const superadmins = users.filter((u) => u.role === "superadmin").length;

    return { pending, approved, completed, cancelled, activeUsers, admins, superadmins };
  }, [bookings, users]);

  // --- derive activities if you don’t have timeline collection
  const derivedActivities = useMemo(() => {
    return bookings.slice(0, 8).map((b) => {
      const when = b.createdAt?.toDate?.() ? b.createdAt.toDate().toLocaleString() : "just now";
      return {
        id: `act-${b.id}`,
        title: `Booking ${String(b.status || "updated").toUpperCase()}`,
        sub: `${b.email || b.userId || "Unknown"} • ${b.vehicle || ""} • ${b.destination || ""}`.trim(),
        ago: when,
      };
    });
  }, [bookings]);

  // choose timeline source
  const activitiesForUI = timeline.length ? timeline : derivedActivities;

  // Optional: quick guard if not signed in
  const goLogin = useCallback(() => router.replace("/loginpage"), [router]);

  return (
    <View style={S.outer}>
      <View style={S.container}>
        <HeaderSection onSignOut={goLogin} />

        <ScrollView contentContainerStyle={S.scroll}>
          <View style={S.content}>
            {/* Optional debug line (remove later) */}
            {/* <Text style={{ marginBottom: 10 }}>Bookings: {bookings.length} • Users: {users.length}</Text> */}

            {/* ✅ Enhanced KPIs: pass computed real-time values */}
            <KPICardsSection
              WIDE={WIDE}
              pending={kpis.pending}
              approved={kpis.approved}
              completed={kpis.completed}
              cancelled={kpis.cancelled}
              activeUsers={kpis.activeUsers}
              admins={kpis.admins}
              superadmins={kpis.superadmins}
            />

            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "Overview" && (
              <OverviewSection
                // If your OverviewSection still uses old static props, you can ignore these
                stats={kpis}
                activities={activitiesForUI}
              />
            )}

            {activeTab === "Users" && (
              <UsersSection
                router={router}
                // Give it real users so you can render a list later
                users={users}
              />
            )}

            {activeTab === "Activities" && (
              <ActivitiesSection
                router={router}
                activities={activitiesForUI}
              />
            )}

            {activeTab === "Bookings" && (
  <BookingsSection router={router} bookings={bookings} />
)}

            {activeTab === "Calendar" && <CalendarSection scopeLabel="SuperAdmin" />}
            
            {activeTab === "Vehicles" && <VehiclesSection router={router} />}

            {activeTab === "Drivers" && <DriversSection router={router} />}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  content: {
    width: "100%",
    maxWidth: 1400,
    alignSelf: "center",
  },
});
