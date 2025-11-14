import { useRouter } from "expo-router";
import {
  Bell,
  Calendar,
  Clock,
  History as HistoryIcon,
  PlusCircle,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TODAY = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);

// Wide-screen breakpoint (same idea as Admin)
const WIDE = Dimensions.get("window").width >= 920;

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const weeks = [];
  let week = Array(first.getDay()).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) while (week.length < 7) week.push(null);
  if (week.length) weeks.push(week);
  return weeks;
}

export default function UserHome() {
  const router = useRouter();
  const [active, setActive] = useState("Calendar");
  const [month, setMonth] = useState({
    year: TODAY.getFullYear(),
    month: TODAY.getMonth(),
  });

  const [requests, setRequests] = useState([
    {
      id: "r1",
      purpose: "Executive Meeting Transport",
      vehicle: "Van",
      date: fmt(
        new Date(
          TODAY.getFullYear(),
          TODAY.getMonth(),
          TODAY.getDate() + 2
        )
      ),
      time: "08:00 - 10:00",
      destination: "Provincial Capitol",
      urgent: true,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "r2",
      purpose: "Field Trip to Siquijor",
      vehicle: "Bus",
      date: fmt(
        new Date(
          TODAY.getFullYear(),
          TODAY.getMonth(),
          TODAY.getDate() + 5
        )
      ),
      time: "07:00 - 18:00",
      destination: "Siquijor Marine Sanctuary",
      urgent: false,
      status: "Approved",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [updates, setUpdates] = useState([
    {
      id: "u1",
      title: "Request Approved",
      text: "Your Conference in Cebu request has been approved",
      type: "success",
      time: "2 hours ago",
    },
    {
      id: "u2",
      title: "Reminder",
      text: "Your trip to Cebu is scheduled for tomorrow at 6:00 AM",
      type: "info",
      time: "1 day ago",
    },
  ]);

  const [form, setForm] = useState({
    vehicle: "",
    date: fmt(TODAY),
    time: "",
    destination: "",
    passengers: "1",
    purpose: "",
    notes: "",
    urgent: false,
  });

  const matrix = useMemo(
    () => monthMatrix(month.year, month.month),
    [month]
  );

  const booked = useMemo(() => {
    const m = {};
    requests.forEach((r) => (m[r.date] = (m[r.date] || 0) + 1));
    return m;
  }, [requests]);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const completedCount = requests.filter(
    (r) => r.status === "Completed"
  ).length;
  const vehiclesCount = 3;

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

  function submitRequest() {
    if (
      !form.vehicle ||
      !form.date ||
      !form.time ||
      !form.destination ||
      !form.purpose
    )
      return;
    const r = {
      ...form,
      id: "r" + Math.random().toString(36).slice(2, 9),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setRequests((s) => [r, ...s]);
    setUpdates((u) => [
      {
        id: "u" + Math.random(),
        title: "New booking submitted",
        text: `${r.purpose} • ${r.date}`,
        type: r.urgent ? "urgent" : "info",
        time: "just now",
      },
      ...u,
    ]);
    setForm({
      vehicle: "",
      date: fmt(TODAY),
      time: "",
      destination: "",
      passengers: "1",
      purpose: "",
      notes: "",
      urgent: false,
    });
    setActive("My Requests");
  }

  function setStatus(id, status) {
    setRequests((s) =>
      s.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setUpdates((u) => [
      {
        id: "u" + Math.random(),
        title: `Request ${status}`,
        text: id,
        type: status === "Completed" ? "success" : "info",
        time: "now",
      },
      ...u,
    ]);
  }

  const Tabs = [
    {
      key: "Calendar",
      icon: (
        <Calendar
          size={14}
          color={active === "Calendar" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "New Request",
      icon: (
        <PlusCircle
          size={14}
          color={active === "New Request" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "My Requests",
      icon: (
        <Clock
          size={14}
          color={active === "My Requests" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "Updates",
      icon: (
        <Bell
          size={14}
          color={active === "Updates" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
    {
      key: "History",
      icon: (
        <HistoryIcon
          size={14}
          color={active === "History" ? "#2563EB" : "#6B7280"}
        />
      ),
    },
  ];

  return (
    <View style={S.shell}>
      <View style={S.container}>
        {/* FULL-WIDTH HEADER */}
        <View style={S.header}>
          <View>
            <Text style={S.title}>CampusGo - Welcome, User</Text>
            <Text style={S.subtitle}>
              The Official NORSU Transportation Service
            </Text>
          </View>
          <TouchableOpacity
            style={S.signOut}
            onPress={() => router.replace("/loginpage")}
          >
            <Text style={S.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* MAIN CONTENT */}
        <ScrollView contentContainerStyle={S.scrollContainer}>
          <View style={S.contentWrapper}>
            {/* Stats */}
            <View style={S.statsRow}>
              {[
                {
                  label: "Pending Requests",
                  value: pendingCount,
                  style: S.statPending,
                },
                {
                  label: "Approved",
                  value: approvedCount,
                  style: S.statApproved,
                },
                {
                  label: "Available Vehicles",
                  value: vehiclesCount,
                  style: S.statVehicles,
                },
                {
                  label: "Completed",
                  value: completedCount,
                  style: S.statCompleted,
                },
              ].map((s, i) => (
                <View
                  key={s.label}
                  style={[
                    S.statCard,
                    WIDE ? S.statWide : S.statNarrow,
                    s.style,
                    WIDE && i === 3 ? { marginRight: 0 } : null,
                  ]}
                >
                  <Text style={S.statLabel}>{s.label}</Text>
                  <Text style={S.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>

            {/* Tabs (responsive) */}
            <View style={S.tabStripContainer}>
              {WIDE ? (
                <View style={S.tabStrip}>
                  {Tabs.map((t) => (
                    <TouchableOpacity
                      key={t.key}
                      style={[
                        S.tabPill,
                        S.tabPillWide,
                        active === t.key && S.tabPillActive,
                      ]}
                      onPress={() => setActive(t.key)}
                    >
                      <View style={S.tabInner}>
                        {t.icon}
                        <Text
                          style={[
                            S.tabText,
                            active === t.key && S.tabTextActive,
                          ]}
                        >
                          {t.key}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={S.tabStrip}
                >
                  {Tabs.map((t) => (
                    <TouchableOpacity
                      key={t.key}
                      style={[
                        S.tabPill,
                        active === t.key && S.tabPillActive,
                      ]}
                      onPress={() => setActive(t.key)}
                    >
                      <View style={S.tabInner}>
                        {t.icon}
                        <Text
                          style={[
                            S.tabText,
                            active === t.key && S.tabTextActive,
                          ]}
                        >
                          {t.key}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Calendar */}
            {active === "Calendar" && (
              <View style={S.card}>
                <Text style={S.cardTitle}>Transportation Calendar</Text>
                <View style={S.calHead}>
                  <TouchableOpacity onPress={() => changeMonth(-1)}>
                    <Text style={S.calNav}>‹</Text>
                  </TouchableOpacity>
                  <Text style={S.calTitle}>
                    {new Date(
                      month.year,
                      month.month
                    ).toLocaleString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  <TouchableOpacity onPress={() => changeMonth(1)}>
                    <Text style={S.calNav}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={S.weekRow}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <Text key={d} style={S.weekText}>
                        {d}
                      </Text>
                    )
                  )}
                </View>

                {matrix.map((week, i) => (
                  <View key={i} style={S.weekRow}>
                    {week.map((d, j) =>
                      !d ? (
                        <View key={j} style={S.cellEmpty} />
                      ) : (
                        <TouchableOpacity
                          key={j}
                          style={[
                            S.cell,
                            booked[fmt(d)] ? S.cellBooked : null,
                            fmt(d) === fmt(TODAY) ? S.cellToday : null,
                          ]}
                          onPress={() => {
                            setActive("My Requests");
                            setUpdates((u) => [
                              {
                                id: "u" + Math.random(),
                                title: "Date selected",
                                text: fmt(d),
                                type: "info",
                                time: "now",
                              },
                              ...u,
                            ]);
                          }}
                        >
                          <Text style={S.cellNum}>{d.getDate()}</Text>
                          {booked[fmt(d)] ? (
                            <View style={S.cellDot} />
                          ) : null}
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                ))}

                <View style={S.legendRow}>
                  <View style={S.legendItem}>
                    <View
                      style={[
                        S.legendColor,
                        { backgroundColor: "#FEEBC8" },
                      ]}
                    />
                    <Text style={S.legendText}>Booked</Text>
                  </View>
                  <View style={S.legendItem}>
                    <View
                      style={[
                        S.legendColor,
                        { backgroundColor: "#D1FAE5" },
                      ]}
                    />
                    <Text style={S.legendText}>Available</Text>
                  </View>
                </View>
              </View>
            )}

            {/* New Request */}
            {active === "New Request" && (
              <View style={S.card}>
                <Text style={S.cardTitle}>
                  Request CampusGo Transportation
                </Text>

                <View style={S.urgentRow}>
                  <TouchableOpacity
                    style={[
                      S.urgentBtn,
                      form.urgent && S.urgentOn,
                    ]}
                    onPress={() =>
                      setForm((f) => ({
                        ...f,
                        urgent: !f.urgent,
                      }))
                    }
                  >
                    <Text
                      style={[
                        S.urgentText,
                        form.urgent && S.urgentTextOn,
                      ]}
                    >
                      {form.urgent
                        ? "Urgent • Priority"
                        : "Mark as Urgent"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={S.urgentNote}>
                    For higher management or time-sensitive bookings
                  </Text>
                </View>

                <Text style={S.label}>Vehicle Type</Text>
                <TextInput
                  style={S.input}
                  placeholder="Van, Bus, Car"
                  value={form.vehicle}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, vehicle: v }))
                  }
                />

                <View style={S.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={S.label}>Date</Text>
                    <TextInput
                      style={S.input}
                      value={form.date}
                      onChangeText={(d) =>
                        setForm((f) => ({ ...f, date: d }))
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={S.label}>Time Range</Text>
                    <TextInput
                      style={S.input}
                      value={form.time}
                      onChangeText={(t) =>
                        setForm((f) => ({ ...f, time: t }))
                      }
                    />
                  </View>
                </View>

                <Text style={S.label}>Destination</Text>
                <TextInput
                  style={S.input}
                  value={form.destination}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, destination: v }))
                  }
                />

                <Text style={S.label}>Purpose</Text>
                <TextInput
                  style={S.input}
                  value={form.purpose}
                  onChangeText={(p) =>
                    setForm((f) => ({ ...f, purpose: p }))
                  }
                />

                <Text style={S.label}>Additional Notes</Text>
                <TextInput
                  style={[S.input, { height: 88 }]}
                  value={form.notes}
                  onChangeText={(n) =>
                    setForm((f) => ({ ...f, notes: n }))
                  }
                  multiline
                />

                <TouchableOpacity
                  style={S.primaryBtn}
                  onPress={submitRequest}
                >
                  <Text style={S.primaryBtnText}>
                    Submit Booking Request
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* My Requests */}
            {active === "My Requests" && (
              <View style={S.card}>
                <Text style={S.cardTitle}>
                  My Transportation Requests
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={requests}
                  keyExtractor={(i) => i.id}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        S.reqCard,
                        item.urgent && S.reqUrgent,
                        item.status === "Cancelled" &&
                          S.reqCancelled,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={S.reqTitle}>
                          {item.purpose}{" "}
                          {item.urgent && (
                            <Text style={S.urgBadge}>
                              URGENT
                            </Text>
                          )}
                        </Text>
                        <Text style={S.muted}>
                          {item.vehicle} •{" "}
                          {new Date(
                            item.date
                          ).toLocaleDateString()}{" "}
                          • {item.time}
                        </Text>
                        <Text style={S.muted}>
                          Destination: {item.destination}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={[
                            S.statusPill,
                            item.status === "Pending" &&
                              S.pending,
                            item.status === "Approved" &&
                              S.approved,
                            item.status === "Completed" &&
                              S.completed,
                            item.status === "Cancelled" &&
                              S.cancelled,
                          ]}
                        >
                          {item.status}
                        </Text>
                        <TouchableOpacity
                          style={S.actionBtn}
                          onPress={() =>
                            setStatus(item.id, "Cancelled")
                          }
                        >
                          <Text style={{ color: "#B91C1C" }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        {item.status === "Pending" && (
                          <TouchableOpacity
                            style={S.actionBtn}
                            onPress={() =>
                              setStatus(item.id, "Approved")
                            }
                          >
                            <Text style={{ color: "#065F46" }}>
                              Simulate Approve
                            </Text>
                          </TouchableOpacity>
                        )}
                        {item.status === "Approved" && (
                          <TouchableOpacity
                            style={S.actionBtn}
                            onPress={() =>
                              setStatus(
                                item.id,
                                "Completed"
                              )
                            }
                          >
                            <Text>Mark Complete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={S.empty}>
                      No requests yet.
                    </Text>
                  }
                />
              </View>
            )}

            {/* Updates */}
            {active === "Updates" && (
              <View style={S.card}>
                <Text style={S.cardTitle}>
                  Updates & Notifications
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={updates}
                  keyExtractor={(i) => i.id}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        S.updateCard,
                        item.type === "urgent" &&
                          S.updateUrgent,
                        item.type === "success" &&
                          S.updateSuccess,
                      ]}
                    >
                      <Text style={S.updateTitle}>
                        {item.title}
                      </Text>
                      <Text style={S.muted}>{item.text}</Text>
                      <Text style={S.time}>{item.time}</Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={S.empty}>No updates</Text>
                  }
                />
              </View>
            )}

            {/* History */}
            {active === "History" && (
              <View style={S.card}>
                <Text style={S.cardTitle}>Booking History</Text>
                <FlatList
                  scrollEnabled={false}
                  data={requests.filter(
                    (r) =>
                      r.status === "Completed" ||
                      r.status === "Cancelled"
                  )}
                  keyExtractor={(i) => i.id}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        S.historyCard,
                        item.status === "Cancelled" &&
                          S.reqCancelled,
                      ]}
                    >
                      <Text style={S.reqTitle}>
                        {item.purpose}
                      </Text>
                      <Text style={S.muted}>
                        {item.vehicle} •{" "}
                        {new Date(
                          item.date
                        ).toLocaleDateString()}{" "}
                        • {item.time}
                      </Text>
                      <Text style={S.muted}>
                        {item.status} • created{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={S.empty}>No history yet.</Text>
                  }
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  // Layout (similar to Admin)
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

  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontSize: 11, color: "#6B7280", marginTop: 4 },
  signOut: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  signOutText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 12,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
  },
  statWide: { flexBasis: "24%", maxWidth: "24%" },
  statNarrow: { flexBasis: "48%", maxWidth: "48%" },
  statLabel: { color: "#475569", fontSize: 12, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#111827" },
  statPending: { backgroundColor: "#FFFBEB" },
  statApproved: { backgroundColor: "#ECFDF5" },
  statVehicles: { backgroundColor: "#EEF2FF" },
  statCompleted: { backgroundColor: "#F9F5FF" },

  // Tabs
  tabStripContainer: { marginBottom: 16 },
  tabStrip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  tabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
  },
  tabPillWide: {
    flex: 1,
    justifyContent: "center",
  },
  tabPillActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabInner: { flexDirection: "row", alignItems: "center" },
  tabText: {
    color: "#475569",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 13,
  },
  tabTextActive: { color: "#2563EB" },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },

  // Calendar
  calHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calTitle: { fontWeight: "700", fontSize: 14 },
  calNav: { fontSize: 18, color: "#6B7280" },

  weekRow: { flexDirection: "row" },
  weekText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#94A3B8",
    paddingVertical: 6,
    fontSize: 12,
  },

  cellEmpty: { flex: 1, padding: 6 },
  cell: {
    flex: 1,
    minHeight: 48,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cellBooked: { backgroundColor: "#FFF7ED", borderColor: "#FEEBC8" },
  cellToday: { borderColor: "#2563EB", borderWidth: 1.3 },
  cellNum: { fontWeight: "700", color: "#0F172A", fontSize: 12 },
  cellDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#F97316",
    marginTop: 6,
  },

  legendRow: { flexDirection: "row", marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  legendColor: { width: 18, height: 10, borderRadius: 4, marginRight: 8 },
  legendText: { color: "#475569", fontSize: 12 },

  // Form
  urgentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  urgentBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  urgentOn: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  urgentText: { fontWeight: "700" },
  urgentTextOn: { color: "#B91C1C" },
  urgentNote: { color: "#94A3B8", fontSize: 12 },

  label: {
    color: "#475569",
    marginTop: 6,
    marginBottom: 6,
    fontSize: 12,
  },
  input: {
    backgroundColor: "#F8FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    paddingHorizontal: 10,
    height: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#0B5ED7",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  // Requests & history
  reqCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECFDF5",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#F0FFF7",
  },
  reqUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    backgroundColor: "#FFFBEB",
  },
  reqCancelled: { backgroundColor: "#FEF2F2" },
  reqTitle: { fontWeight: "800", color: "#0F172A", fontSize: 13 },
  urgBadge: { color: "#B91C1C", fontWeight: "700" },
  muted: { color: "#475569", marginTop: 6, fontSize: 12 },

  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 12,
  },
  pending: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  approved: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
  completed: { backgroundColor: "#DCFCE7", borderColor: "#86EFAD" },
  cancelled: { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },

  actionBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginTop: 8,
  },
  empty: { color: "#94A3B8", paddingVertical: 10, fontSize: 12 },

  // Updates
  updateCard: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  updateUrgent: { backgroundColor: "#FFF7ED" },
  updateSuccess: { backgroundColor: "#ECFDF5" },
  updateTitle: { fontWeight: "700" },
  time: { color: "#94A3B8", marginTop: 6, fontSize: 12 },

  // History
  historyCard: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
});
