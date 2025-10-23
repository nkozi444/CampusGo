// app/superadmin.js
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, Car, Users } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

export default function SuperAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>CampusGo - Super Admin</Text>
            <Text style={styles.headerSubtitle}>
              The Official NORSU Transportation Service
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => router.replace("/loginpage")}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* KPI cards (same size as AdminHome) */}
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: "#FFFBEA" }]}>
              <Text style={styles.cardTitle}>Pending Requests</Text>
              <Text style={[styles.cardValue, { color: "#C58900" }]}>1</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#ECFDF5" }]}>
              <Text style={styles.cardTitle}>Approved</Text>
              <Text style={[styles.cardValue, { color: "#16A34A" }]}>8</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#EEF2FF" }]}>
              <Text style={styles.cardTitle}>Available Vehicles</Text>
              <Text style={[styles.cardValue, { color: "#2563EB" }]}>3</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#F3E8FF" }]}>
              <Text style={styles.cardTitle}>Completed</Text>
              <Text style={[styles.cardValue, { color: "#9333EA" }]}>5</Text>
            </View>
          </View>

          {/* Primary nav (same control as AdminHome tabs) */}
          <View style={styles.tabs}>
            {[
              { name: "Overview", icon: <CheckCircle size={16} color={activeTab === "Overview" ? "#2563EB" : "#6B7280"} /> },
              { name: "Users", icon: <Users size={16} color={activeTab === "Users" ? "#2563EB" : "#6B7280"} /> },
              { name: "Activities", icon: <Clock size={16} color={activeTab === "Activities" ? "#2563EB" : "#6B7280"} /> },
              { name: "Bookings", icon: <CheckCircle size={16} color={activeTab === "Bookings" ? "#2563EB" : "#6B7280"} /> },
              { name: "Calendar", icon: <Calendar size={16} color={activeTab === "Calendar" ? "#2563EB" : "#6B7280"} /> },
              { name: "Vehicles", icon: <Car size={16} color={activeTab === "Vehicles" ? "#2563EB" : "#6B7280"} /> },
              { name: "Drivers", icon: <Users size={16} color={activeTab === "Drivers" ? "#2563EB" : "#6B7280"} /> },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tabButton, activeTab === tab.name && styles.activeTabButton]}
                onPress={() => setActiveTab(tab.name)}
              >
                <View style={styles.tabContent}>
                  {tab.icon}
                  <Text style={[styles.tabText, activeTab === tab.name && styles.activeTabText]}>
                    {tab.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Recent System Activities</Text>
              {/* Table-like list sized like AdminHome cards */}
              {[
                { id: 1, title: "New booking request submitted", sub: "Biology Department", ago: "2 minutes ago" },
                { id: 2, title: "Vehicle maintenance completed", sub: "Bus 001", ago: "1 hour ago" },
              ].map((row, i) => (
                <View key={row.id} style={[styles.tableRow, i === 0 && { borderTopWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{row.title}</Text>
                    <Text style={styles.rowSub}>{row.sub}</Text>
                  </View>
                  <Text style={styles.rowRight}>{row.ago}</Text>
                </View>
              ))}

              <View style={{ height: 8 }} />
              <Text style={styles.sectionTitle}>System Performance</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>System Status</Text>
                <View style={styles.pillOk}><Text style={styles.pillOkText}>Operational</Text></View>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Pending Requests</Text>
                <Text style={styles.metricValue}>1</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Completed This Month</Text>
                <Text style={styles.metricValue}>5</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Active Users</Text>
                <Text style={styles.metricValue}>8</Text>
              </View>
            </View>
          )}

          {/* USERS */}
          {activeTab === "Users" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>User Management</Text>

              {/* Row 1 */}
              <View style={styles.userRow}>
                <View>
                  <Text style={styles.userName}>Niki <Text style={styles.userRole}>(User)</Text></Text>
                  <Text style={styles.userMeta}>user@norsu.edu • Last active: Today</Text>
                </View>
                <View style={styles.badgeSuccess}><Text style={styles.badgeSuccessText}>Active</Text></View>
              </View>

              {/* Row 2 */}
              <View style={styles.userRow}>
                <View>
                  <Text style={styles.userName}>Admin User <Text style={styles.userRole}>(Admin)</Text></Text>
                  <Text style={styles.userMeta}>admin@norsu.edu • Last active: Yesterday</Text>
                </View>
                <View style={styles.badgeInfo}><Text style={styles.badgeInfoText}>Admin</Text></View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/users")}>
                  <Text style={styles.approveText}>Open Users</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ACTIVITIES */}
          {activeTab === "Activities" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>System Activities Log</Text>
              <View style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>User login: Niki</Text>
                  <Text style={styles.rowSub}>Today at 2:30 PM</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>New booking request submitted</Text>
                  <Text style={styles.rowSub}>Today at 1:45 PM</Text>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/activities")}>
                  <Text style={styles.approveText}>Open Activities</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* BOOKINGS */}
          {activeTab === "Bookings" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>All Transportation Bookings</Text>
              <Text style={{ color: "#6B7280", fontSize: 13 }}>
                Comprehensive view of all transportation bookings across the system.
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/bookings")}>
                  <Text style={styles.approveText}>Open Bookings</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* CALENDAR */}
          {activeTab === "Calendar" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Transportation Calendar</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/calendar")}>
                  <Text style={styles.approveText}>Open Calendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* VEHICLES */}
          {activeTab === "Vehicles" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Fleet</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/vehicles")}>
                  <Text style={styles.approveText}>Open Vehicles</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* DRIVERS */}
          {activeTab === "Drivers" && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Driver Status</Text>
              <Text style={styles.driverSubtitle}>Current availability status of all drivers</Text>
              <View style={styles.driverStatusRow}>
                <View style={[styles.driverCard, { backgroundColor: "#ECFDF5" }]}>
                  <Text style={styles.driverCardTitle}>Available</Text>
                  <Text style={[styles.driverCardValue, { color: "#16A34A" }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: "#EEF2FF" }]}>
                  <Text style={styles.driverCardTitle}>Assigned</Text>
                  <Text style={[styles.driverCardValue, { color: "#2563EB" }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: "#FEF2F2" }]}>
                  <Text style={styles.driverCardTitle}>Off Duty</Text>
                  <Text style={[styles.driverCardValue, { color: "#DC2626" }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: "#F3E8FF" }]}>
                  <Text style={styles.driverCardTitle}>Total</Text>
                  <Text style={[styles.driverCardValue, { color: "#9333EA" }]}>0</Text>
                </View>
              </View>
              <View style={styles.noDriverBox}>
                <Text style={styles.noDriverIcon}>👤</Text>
                <Text style={styles.noDriverText}>No drivers found</Text>
                <Text style={styles.noDriverSub}>Contact your system administrator to add drivers to the system.</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => router.push("/drivers")}>
                  <Text style={styles.approveText}>Open Drivers</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

/* ==== styles copied from AdminHome, plus small additions for rows ==== */
const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#F9FAFB", alignItems: "center" },
  container: { flex: 1, width: "100%", maxWidth: 1050, backgroundColor: "#F9FAFB" },
  scrollContainer: { padding: 16, paddingBottom: 50 },

  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  headerSubtitle: { fontSize: 12, color: "#6B7280" },
  signOutButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  signOutText: { color: "#111827", fontWeight: "500", fontSize: 12 },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  card: {
    width: "23%",
    minWidth: 150,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: "#374151", marginBottom: 5 },
  cardValue: { fontSize: 28, fontWeight: "bold" },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1050,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  activeTabText: { color: "#2563EB", fontWeight: "600" },

  requestBox: { backgroundColor: "#fff", borderRadius: 10, padding: 16 },

  /* table-like rows */
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rowSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  rowRight: { fontSize: 12, color: "#6B7280" },

  /* metrics */
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  metricLabel: { fontSize: 13, color: "#374151" },
  metricValue: { fontSize: 14, fontWeight: "700", color: "#111827" },
  pillOk: { backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  pillOkText: { color: "#065F46", fontWeight: "700", fontSize: 12 },

  /* users list */
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  userName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  userRole: { fontSize: 14, fontWeight: "400", color: "#6B7280" },
  userMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  badgeSuccess: { backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeSuccessText: { color: "#065F46", fontWeight: "700", fontSize: 11 },
  badgeInfo: { backgroundColor: "#EEF2FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeInfoText: { color: "#1D4ED8", fontWeight: "700", fontSize: 11 },

  /* buttons reused */
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: { backgroundColor: "#DCFCE7", borderWidth: 1, borderColor: "#86EFAD" },
  approveText: { color: "#15803D", fontWeight: "600" },

  /* drivers, copied from AdminHome */
  driverSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 12 },
  driverStatusRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  driverCard: { flex: 1, marginHorizontal: 4, borderRadius: 8, padding: 12, alignItems: "center", justifyContent: "center" },
  driverCardTitle: { fontSize: 13, color: "#374151", marginBottom: 4 },
  driverCardValue: { fontSize: 22, fontWeight: "bold" },
  noDriverBox: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F9FAFB" },
  noDriverIcon: { fontSize: 32, marginBottom: 8, color: "#9CA3AF" },
  noDriverText: { fontSize: 15, fontWeight: "600", marginBottom: 4, color: "#111827" },
  noDriverSub: { fontSize: 12, color: "#6B7280", textAlign: "center" },
});
