// screens/UserHome/NewRequestSection.js
import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MIN_DATE, fmt } from "./utils";
import CalendarModal from "./modals/CalendarModal";
import TimePickerModal from "./modals/TimePickerModal";

// ✅ Firestore
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase"; // <-- adjust path if needed

export default function NewRequestSection({ onSubmitRequest }) {
  const [form, setForm] = useState({
    vehicle: "",
    date: fmt(MIN_DATE),
    destination: "",
    passengers: "1",
    purpose: "",
    notes: "",
    urgent: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null); // { label, minutes }
  const [endTime, setEndTime] = useState(null); // { label, minutes }

  const [submitting, setSubmitting] = useState(false);

  const vehicleOptions = ["Bus", "Van", "L300", "Vios"];
  const [vehicleDropdownVisible, setVehicleDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const canPickEnd = !!startTime;
  const timeLabel = useMemo(() => {
    if (!startTime || !endTime) return "Select time range";
    return `${startTime.label} - ${endTime.label}`;
  }, [startTime, endTime]);

  function toggleVehicleDropdown() {
    const opening = !vehicleDropdownVisible;
    if (opening) setVehicleDropdownVisible(true);

    Animated.timing(dropdownAnim, {
      toValue: opening ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (!opening) setVehicleDropdownVisible(false);
    });
  }

  const dropdownStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        translateY: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-6, 0],
        }),
      },
      {
        scale: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  };

  // ✅ Convert ("YYYY-MM-DD" + minutes) -> JS Date objects
  function buildScheduleDates(dateStr, start, end) {
    const [y, m, d] = dateStr.split("-").map(Number);

    const startDate = new Date(y, m - 1, d, 0, 0, 0, 0);
    startDate.setMinutes(start.minutes);

    const endDate = new Date(y, m - 1, d, 0, 0, 0, 0);
    endDate.setMinutes(end.minutes);

    return { startDate, endDate };
  }

  async function handleSubmit() {
    if (submitting) return;

    console.log("SUBMIT PRESSED");

    if (!form.vehicle || !form.date || !form.destination || !form.purpose || !startTime || !endTime) {
      Alert.alert("Missing fields", "Please complete all required fields.");
      return;
    }

    if (endTime.minutes <= startTime.minutes) {
      Alert.alert("Invalid time range", "End time must be after the start time.");
      return;
    }

    try {
      setSubmitting(true);

      const user = auth.currentUser;

      // ✅ the exact debugging you asked about
      console.log("CURRENT USER:", user?.uid, user?.email);

      if (!user) {
        Alert.alert("Not logged in", "Please log in again.");
        return;
      }

      const { startDate, endDate } = buildScheduleDates(form.date, startTime, endTime);

      const bookingDoc = {
        userId: user.uid,
        userEmail: user.email || "",

        vehicle: form.vehicle,
        date: form.date,
        destination: form.destination,
        passengers: Number(form.passengers || 1),
        purpose: form.purpose,
        notes: form.notes || "",
        urgent: !!form.urgent,

        startTimeLabel: startTime.label,
        endTimeLabel: endTime.label,
        timeRange: `${startTime.label} - ${endTime.label}`,

        scheduleStartAt: Timestamp.fromDate(startDate),
        scheduleEndAt: Timestamp.fromDate(endDate),

        status: "pending",
         createdAt: serverTimestamp(),
         createdAtClient: Timestamp.now(),
      };
      console.log("WRITING bookingDoc:", bookingDoc);

      const ref = await addDoc(collection(db, "bookings"), bookingDoc);

      console.log("WRITE OK. DOC ID:", ref.id);

      // Keep local UI update if your parent expects it
      const payload = { ...form, time: bookingDoc.timeRange, id: ref.id };
      onSubmitRequest?.(payload);

      Alert.alert("Submitted", "Your booking request was sent.");

      // reset
      setForm({
        vehicle: "",
        date: fmt(MIN_DATE),
        destination: "",
        passengers: "1",
        purpose: "",
        notes: "",
        urgent: false,
      });
      setStartTime(null);
      setEndTime(null);
    } catch (e) {
      console.error("Create booking error:", e);

      // ✅ show the real error, not a generic one
      const msg =
        e?.message ||
        (typeof e === "string" ? e : null) ||
        JSON.stringify(e, Object.getOwnPropertyNames(e));

      Alert.alert("Error submitting booking", msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <View style={S.card}>
        <View style={S.headerRow}>
          <View>
            <Text style={S.kicker}>UserHome</Text>
            <Text style={S.cardTitle}>Request CampusGo Transportation</Text>
          </View>
          <View style={S.pill}>
            <View style={S.pillDot} />
            <Text style={S.pillText}>Live</Text>
          </View>
        </View>

        <View style={S.urgentWrap}>
          <TouchableOpacity
            style={[S.urgentBtn, form.urgent && S.urgentOn]}
            onPress={() => setForm((f) => ({ ...f, urgent: !f.urgent }))}
            activeOpacity={0.85}
          >
            <Text style={[S.urgentText, form.urgent && S.urgentTextOn]}>
              {form.urgent ? "Urgent • Priority" : "Mark as Urgent"}
            </Text>
          </TouchableOpacity>
          <Text style={S.urgentNote}>For higher management or time-sensitive bookings</Text>
        </View>

        {/* Vehicle dropdown */}
        <View style={{ zIndex: 10 }}>
          <Text style={S.label}>Vehicle Type</Text>
          <TouchableOpacity style={S.input} onPress={toggleVehicleDropdown} activeOpacity={0.85}>
            <Text style={!form.vehicle ? S.placeholderText : S.valueText}>
              {form.vehicle || "Select vehicle"}
            </Text>
            <Text style={S.chev}>{vehicleDropdownVisible ? "▴" : "▾"}</Text>
          </TouchableOpacity>

          {vehicleDropdownVisible && (
            <Animated.View style={[S.dropdown, dropdownStyle]}>
              {vehicleOptions.map((v, idx) => (
                <TouchableOpacity
                  key={v}
                  style={[S.dropdownItem, idx !== vehicleOptions.length - 1 && S.dropdownDivider]}
                  onPress={() => {
                    setForm((f) => ({ ...f, vehicle: v }));
                    toggleVehicleDropdown();
                  }}
                >
                  <Text style={S.dropdownText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </View>

        {/* Date + Time */}
        <View style={S.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={S.label}>Date</Text>
            <TouchableOpacity style={S.input} onPress={() => setShowDatePicker(true)} activeOpacity={0.85}>
              <Text style={S.valueText}>{form.date}</Text>
              <Text style={S.chev}>📅</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.label}>Time Range</Text>
            <View style={S.timeRow}>
              <TouchableOpacity
                style={[S.input, { flex: 1, marginRight: 6 }]}
                onPress={() => setShowStartTimePicker(true)}
                activeOpacity={0.85}
              >
                <Text style={!startTime ? S.placeholderText : S.valueText}>
                  {startTime?.label || "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[S.input, { flex: 1, marginLeft: 6 }, !canPickEnd && S.inputDisabled]}
                onPress={() => canPickEnd && setShowEndTimePicker(true)}
                disabled={!canPickEnd}
                activeOpacity={0.85}
              >
                <Text style={!endTime ? S.placeholderText : S.valueText}>
                  {endTime?.label || "End"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={S.timeSummary}>{timeLabel}</Text>
          </View>
        </View>

        <Text style={S.label}>Destination</Text>
        <TextInput
          style={S.textInput}
          value={form.destination}
          onChangeText={(v) => setForm((f) => ({ ...f, destination: v }))}
          placeholder="Where are you going?"
          placeholderTextColor="#94A3B8"
        />

        <Text style={S.label}>Purpose</Text>
        <TextInput
          style={S.textInput}
          value={form.purpose}
          onChangeText={(p) => setForm((f) => ({ ...f, purpose: p }))}
          placeholder="Reason for request"
          placeholderTextColor="#94A3B8"
        />

        <Text style={S.label}>Additional Notes</Text>
        <TextInput
          style={[S.textInput, S.notes]}
          value={form.notes}
          onChangeText={(n) => setForm((f) => ({ ...f, notes: n }))}
          placeholder="Any extra details (optional)"
          placeholderTextColor="#94A3B8"
          multiline
        />

        <TouchableOpacity
          style={[S.primaryBtn, submitting && S.primaryBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.9}
          disabled={submitting}
        >
          {submitting ? (
            <View style={S.btnLoadingRow}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={S.primaryBtnText}>Submitting...</Text>
            </View>
          ) : (
            <>
              <Text style={S.primaryBtnText}>Submit Booking Request</Text>
              <Text style={S.primaryBtnSub}>We'll notify you when it's reviewed</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modals (unchanged) */}
      <CalendarModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        minDate={MIN_DATE}
        onSelect={(dateStr) => setForm((f) => ({ ...f, date: dateStr }))}
      />

      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        title="Select Start Time"
        initialTime={
          startTime
            ? {
                hour: parseInt(startTime.label.slice(0, 2), 10),
                minute: parseInt(startTime.label.slice(3, 5), 10),
                period: startTime.label.slice(6).trim(),
              }
            : null
        }
        onConfirm={(t) => {
          setStartTime(t);
          setEndTime(null);
          setShowStartTimePicker(false);
        }}
      />

      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        title="Select End Time"
        initialTime={
          endTime
            ? {
                hour: parseInt(endTime.label.slice(0, 2), 10),
                minute: parseInt(endTime.label.slice(3, 5), 10),
                period: endTime.label.slice(6).trim(),
              }
            : null
        }
        onConfirm={(t) => {
          if (!startTime) {
            Alert.alert("Select start time first", "Please select a start time before choosing the end time.");
            setShowEndTimePicker(false);
            return;
          }
          if (t.minutes <= startTime.minutes) {
            Alert.alert("Invalid time range", "End time must be after the start time.");
            setShowEndTimePicker(false);
            return;
          }
          setEndTime(t);
          setShowEndTimePicker(false);
        }}
      />
    </>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  kicker: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },

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
  pillText: { fontSize: 12, fontWeight: "700", color: "#0F172A" },

  urgentWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  urgentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  urgentOn: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  urgentText: { fontWeight: "900", color: "#0F172A", fontSize: 12 },
  urgentTextOn: { color: "#991B1B" },
  urgentNote: { color: "#94A3B8", fontSize: 12, flex: 1, textAlign: "right" },

  label: { color: "#475569", marginTop: 10, marginBottom: 6, fontSize: 12, fontWeight: "700" },

  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputDisabled: { opacity: 0.55 },

  valueText: { color: "#0F172A", fontWeight: "800" },
  placeholderText: { color: "#94A3B8", fontWeight: "700" },
  chev: { color: "#64748B", fontWeight: "900" },

  textInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0F172A",
    fontWeight: "700",
  },
  notes: { minHeight: 92, textAlignVertical: "top" },

  row: { flexDirection: "row", alignItems: "flex-start", marginTop: 4 },
  timeRow: { flexDirection: "row", marginTop: 6 },

  timeSummary: { fontSize: 11, color: "#64748B", marginTop: 6, fontWeight: "700" },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginTop: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#0B1220", shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 4 },
    }),
  },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 12 },
  dropdownDivider: { borderBottomWidth: 1, borderBottomColor: "#EEF2F6" },
  dropdownText: { fontWeight: "800", color: "#0F172A" },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: "#0B5ED7",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    zIndex: 999,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  btnLoadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  primaryBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  primaryBtnSub: { color: "#DCEBFF", marginTop: 4, fontWeight: "700", fontSize: 11 },
});
