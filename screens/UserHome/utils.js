// screens/UserHome/utils.js
import { Dimensions } from "react-native";

export const TODAY = new Date();

// Minimum date = 7 days ahead from today
export const MIN_DATE = new Date(
  TODAY.getFullYear(),
  TODAY.getMonth(),
  TODAY.getDate() + 7
);

// ✅ FIX: local YYYY-MM-DD (no UTC shift)
export const fmt = (d) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Wide-screen breakpoint (same idea as before)
export const WIDE = Dimensions.get("window").width >= 920;

// Calendar matrix for a given month
export function monthMatrix(year, month) {
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

// ---------- Helpers for time ----------
export const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0..55 step 5
export const PERIODS = ["AM", "PM"];

export function pad2(n) {
  return n.toString().padStart(2, "0");
}

export function buildTimeLabel(hour, minute, period) {
  return `${pad2(hour)}:${pad2(minute)} ${period}`;
}

export function timeToMinutes(hour, minute, period) {
  let h = hour % 12;
  if (period === "PM") h += 12;
  return h * 60 + minute;
}
