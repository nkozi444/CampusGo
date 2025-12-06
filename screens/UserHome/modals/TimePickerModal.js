// screens/UserHome/modals/TimePickerModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  HOURS,
  MINUTES,
  PERIODS,
  pad2,
  buildTimeLabel,
  timeToMinutes,
} from "../utils";

export default function TimePickerModal({
  visible,
  onClose,
  onConfirm,
  title,
  initialTime, // { hour, minute, period }
}) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (visible && initialTime) {
      setHour(initialTime.hour);
      setMinute(initialTime.minute);
      setPeriod(initialTime.period);
    } else if (visible && !initialTime) {
      setHour(8);
      setMinute(0);
      setPeriod("AM");
    }
  }, [visible, initialTime]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={S.modalOverlay}>
        <View style={S.modalCard}>
          <View style={S.modalHeader}>
            <Text style={S.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={S.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={S.timePickerRow}>
            {/* Hours */}
            <View style={S.timeColumn}>
              <Text style={S.timeColumnLabel}>Hour</Text>
              <ScrollView
                style={{ maxHeight: 160 }}
                showsVerticalScrollIndicator={false}
              >
                {HOURS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      S.timeItem,
                      h === hour && S.timeItemSelected,
                    ]}
                    onPress={() => setHour(h)}
                  >
                    <Text
                      style={[
                        S.timeItemText,
                        h === hour && S.timeItemTextSelected,
                      ]}
                    >
                      {pad2(h)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Minutes */}
            <View style={S.timeColumn}>
              <Text style={S.timeColumnLabel}>Minute</Text>
              <ScrollView
                style={{ maxHeight: 160 }}
                showsVerticalScrollIndicator={false}
              >
                {MINUTES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      S.timeItem,
                      m === minute && S.timeItemSelected,
                    ]}
                    onPress={() => setMinute(m)}
                  >
                    <Text
                      style={[
                        S.timeItemText,
                        m === minute && S.timeItemTextSelected,
                      ]}
                    >
                      {pad2(m)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Period */}
            <View style={S.timeColumn}>
              <Text style={S.timeColumnLabel}>Period</Text>
              <ScrollView
                style={{ maxHeight: 160 }}
                showsVerticalScrollIndicator={false}
              >
                {PERIODS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      S.timeItem,
                      p === period && S.timeItemSelected,
                    ]}
                    onPress={() => setPeriod(p)}
                  >
                    <Text
                      style={[
                        S.timeItemText,
                        p === period && S.timeItemTextSelected,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={S.primaryBtn}
            onPress={() => {
              const label = buildTimeLabel(hour, minute, period);
              const minutesTotal = timeToMinutes(hour, minute, period);
              onConfirm({ label, minutes: minutesTotal });
            }}
          >
            <Text style={S.primaryBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const S = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#0F172A",
  },
  modalClose: {
    fontSize: 18,
    color: "#9CA3AF",
  },

  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
  },
  timeColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeColumnLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
    textAlign: "center",
  },
  timeItem: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  timeItemSelected: {
    backgroundColor: "#DBEAFE",
  },
  timeItemText: {
    fontSize: 14,
    color: "#111827",
  },
  timeItemTextSelected: {
    fontWeight: "700",
    color: "#1D4ED8",
  },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#0B5ED7",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
});
