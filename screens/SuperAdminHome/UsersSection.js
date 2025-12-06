import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function UsersSection({ router, users = [] }) {
  return (
    <View style={S.card}>
      <View style={S.header}>
        <View>
          <Text style={S.title}>User Management</Text>
          <Text style={S.subtitle}>Manage users, roles, and access</Text>
        </View>

        <TouchableOpacity
          style={S.primaryBtn}
          onPress={() => router.push("/users")}
          activeOpacity={0.85}
        >
          <Text style={S.primaryBtnText}>Open Users</Text>
        </TouchableOpacity>
      </View>

      {users.length === 0 ? (
        <View style={S.emptyBox}>
          <Text style={S.emptyTitle}>No users loaded</Text>
          <Text style={S.emptySub}>Try refreshing or check your data source.</Text>
        </View>
      ) : (
        <View style={S.list}>
          {users.slice(0, 7).map((u, idx) => {
            const role = u.role || "user";
            const email = u.email || "—";
            const isAdmin = role === "admin" || role === "superadmin";

            return (
              <View key={u.id ?? `${email}-${idx}`} style={[S.row, idx === 0 && { borderTopWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={S.nameLine} numberOfLines={1}>
                    {email} <Text style={S.roleText}>({role})</Text>
                  </Text>
                  <Text style={S.meta}>UID: {u.id}</Text>
                </View>

                <View style={[S.badge, isAdmin ? S.badgeAdmin : S.badgeActive]}>
                  <Text style={[S.badgeText, isAdmin ? S.badgeAdminText : S.badgeActiveText]}>
                    {isAdmin ? "Admin" : "Active"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 2 },
      default: { shadowOpacity: 0.06 },
    }),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12, letterSpacing: 0.3 },

  list: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },

  nameLine: { fontSize: 14, fontWeight: "900", color: "#0F172A" },
  roleText: { color: "#64748B", fontWeight: "800" },
  meta: { marginTop: 3, fontSize: 12, color: "#64748B" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontWeight: "900", fontSize: 11, letterSpacing: 0.3 },

  badgeActive: { backgroundColor: "#ECFDF5", borderColor: "#86EFAC" },
  badgeActiveText: { color: "#065F46" },

  badgeAdmin: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  badgeAdminText: { color: "#1D4ED8" },

  emptyBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
  },
  emptyTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  emptySub: { marginTop: 4, fontSize: 12, color: "#64748B" },
});
