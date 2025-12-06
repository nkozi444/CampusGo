// screens/UserHome/modals/CalendarModal.js
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { monthMatrix, fmt } from "../utils";

export default function CalendarModal({ visible, onClose, onSelect, minDate }) {
  const [viewMonth, setViewMonth] = useState({
    year: minDate.getFullYear(),
    month: minDate.getMonth(),
  });

  useEffect(() => {
    if (visible) {
      setViewMonth({
        year: minDate.getFullYear(),
        month: minDate.getMonth(),
      });
    }
  }, [visible, minDate]);

  const matrix = useMemo(
    () => monthMatrix(viewMonth.year, viewMonth.month),
    [viewMonth]
  );

  function changeMonth(delta) {
    setViewMonth((cur) => {
      let { year, month } = cur;
      month += delta;
      if (month < 0) {
        month = 11;
        year -= 1;
      } else if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  }

  function isBeforeMinDate(d) {
    const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const minOnly = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    return dOnly < minOnly;
  }

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
            <Text style={S.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={S.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={S.calHead}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={S.calNav}>‹</Text>
            </TouchableOpacity>
            <Text style={S.calTitle}>
              {new Date(
                viewMonth.year,
                viewMonth.month
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Text key={d} style={S.weekText}>
                {d}
              </Text>
            ))}
          </View>

          {matrix.map((week, i) => (
            <View key={i} style={S.weekRow}>
              {week.map((d, j) => {
                if (!d) return <View key={j} style={S.cellEmpty} />;

                const disabled = isBeforeMinDate(d);
                return (
                  <TouchableOpacity
                    key={j}
                    disabled={disabled}
                    style={[S.cell, disabled && S.cellDisabled]}
                    onPress={() => {
                      onSelect(fmt(d));
                      onClose();
                    }}
                  >
                    <Text
                      style={[S.cellNum, disabled && S.cellNumDisabled]}
                    >
                      {d.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
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
  cellDisabled: {
    backgroundColor: "#F9FAFB",
  },
  cellNum: { fontWeight: "700", color: "#0F172A", fontSize: 12 },
  cellNumDisabled: {
    color: "#CBD5F5",
  },
});
