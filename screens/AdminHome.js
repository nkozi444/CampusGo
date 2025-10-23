import { useRouter } from "expo-router";
import React, { useState } from "react"; 
import { Calendar, Clock, CheckCircle, Car, Users } from "lucide-react-native"; 

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform 
} from "react-native";

export default function AdminHome() {
  const router = useRouter();
  // Default tab set to "Approved" for now
  const [activeTab, setActiveTab] = useState('Approved'); 
  
  const userName = "Admin"; 

  return (
    <View style={styles.outerContainer}> 
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>CampusGo - Admin Dashboard</Text>
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
          {/* Stats Cards */}
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: '#FFFBEA' }]}>
              <Text style={styles.cardTitle}>Pending Requests</Text>
              <Text style={[styles.cardValue, { color: '#C58900' }]}>1</Text>
            </View>
            <View style={[styles.card, { backgroundColor: '#ECFDF5' }]}>
              <Text style={styles.cardTitle}>Approved</Text>
              <Text style={[styles.cardValue, { color: '#16A34A' }]}>2</Text>
            </View>
            <View style={[styles.card, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.cardTitle}>Available Vehicles</Text>
              <Text style={[styles.cardValue, { color: '#2563EB' }]}>3</Text>
            </View>
            <View style={[styles.card, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.cardTitle}>Completed</Text>
              <Text style={[styles.cardValue, { color: '#9333EA' }]}>1</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
  {[
    { name: 'Calendar', icon: <Calendar size={16} color={activeTab === 'Calendar' ? '#2563EB' : '#6B7280'} /> },
    { name: 'Timeline', icon: <Clock size={16} color={activeTab === 'Timeline' ? '#2563EB' : '#6B7280'} /> },
    { name: 'Pending', icon: <Clock size={16} color={activeTab === 'Pending' ? '#2563EB' : '#6B7280'} /> },
    { name: 'Approved', icon: <CheckCircle size={16} color={activeTab === 'Approved' ? '#2563EB' : '#6B7280'} /> },
    { name: 'Vehicles', icon: <Car size={16} color={activeTab === 'Vehicles' ? '#2563EB' : '#6B7280'} /> },
    { name: 'Drivers', icon: <Users size={16} color={activeTab === 'Drivers' ? '#2563EB' : '#6B7280'} /> },
  ].map((tab) => (
    <TouchableOpacity
      key={tab.name}
      style={[
        styles.tabButton,
        activeTab === tab.name && styles.activeTabButton,
      ]}
      onPress={() => setActiveTab(tab.name)}
    >
      <View style={styles.tabContent}>
        {tab.icon}
        <Text
          style={[
            styles.tabText,
            activeTab === tab.name && styles.activeTabText,
          ]}
        >
          {tab.name}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

          {/* --- PENDING REQUESTS SECTION --- */}
          {activeTab === 'Pending' && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Pending Booking Requests</Text>
              <View style={styles.requestCard}>
                {/* Request Header Row */}
                <View style={styles.requestHeaderRow}>
                  <Text style={styles.requestName}>👤 Marah (<Text style={styles.requestEmail}>marah@gmail.com</Text>)</Text>
                  <Text style={styles.requestDateText}>Requested: 9/23/2025</Text>
                </View>

                {/* Vehicle and Status */}
                <View style={styles.vehicleStatusRow}>
                  <Text style={styles.requestDetail}>🚍 Bus - </Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Pending</Text>
                  </View>
                </View>

                {/* Two Column Details Layout */}
                <View style={styles.detailsRow}>
                  {/* Left Column */}
                  <View style={styles.detailColumn}>
                    <Text style={styles.requestDetail}>📅 9/24/2025</Text>
                    <Text style={styles.requestDetail}>⏰ 06:00 - 09:00</Text>
                    <Text style={styles.requestDetail}>👤 1 passenger</Text>
                  </View>
                  
                  {/* Right Column */}
                  <View style={styles.detailColumn}>
                    <Text style={styles.requestDetail}>📍 Valencia</Text>
                    <Text style={styles.requestPurpose}>Purpose: Meeting</Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.actionButton, styles.declineButton]}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* --- APPROVED BOOKINGS SECTION --- */}
          {activeTab === 'Approved' && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Approved Bookings</Text>

              {/* Approved Request Card 1 */}
              <View style={[styles.approvedCard, { marginBottom: 16 }]}>
                <View style={styles.approvedHeaderRow}>
                  <View style={styles.approvedUserInfo}>
                    <Text style={styles.approvedName}>👤 Marah</Text>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.approvedBadgeText}>Approved</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.markCompleteButton}>
                    <Text style={styles.markCompleteText}>Mark Complete</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.approvedDetailsRow}>
                  <View style={styles.detailColumn}>
                    <Text style={styles.approvedDetail}>📅 9/24/2025</Text>
                    <Text style={styles.approvedDetail}>⏰ 06:30 - 07:30</Text>
                    <Text style={styles.approvedDetail}>👤 1 passengers</Text>
                  </View>
                  <View style={styles.detailColumn}>
                    <Text style={styles.approvedDetail}>📍 Valencia</Text>
                  </View>
                </View>
                <Text style={styles.assignedText}>
                  Assigned: <Text style={styles.assignedVehicle}>vehicle_car_001</Text> | Driver: Sarah Wilson
                </Text>
              </View>

              {/* Approved Request Card 2 */}
              <View style={styles.approvedCard}>
                <View style={styles.approvedHeaderRow}>
                  <View style={styles.approvedUserInfo}>
                    <Text style={styles.approvedName}>👤 Niki</Text>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.approvedBadgeText}>Approved</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.markCompleteButton}>
                    <Text style={styles.markCompleteText}>Mark Complete</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.approvedDetailsRow}>
                  <View style={styles.detailColumn}>
                    <Text style={styles.approvedDetail}>📅 9/27/2025</Text>
                    <Text style={styles.approvedDetail}>⏰ 07:00 - 17:00</Text>
                    <Text style={styles.approvedDetail}>👤 1 passengers</Text>
                  </View>
                  <View style={styles.detailColumn}>
                    <Text style={styles.approvedDetail}>📍 Cebu City</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* --- DRIVER STATUS SECTION --- */}
          {activeTab === 'Drivers' && (
            <View style={styles.requestBox}>
              <Text style={styles.sectionTitle}>Driver Status</Text>
              <Text style={styles.driverSubtitle}>
                Current availability status of all drivers
              </Text>

              {/* Driver status cards */}
              <View style={styles.driverStatusRow}>
                <View style={[styles.driverCard, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={styles.driverCardTitle}>Available</Text>
                  <Text style={[styles.driverCardValue, { color: '#16A34A' }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={styles.driverCardTitle}>Assigned</Text>
                  <Text style={[styles.driverCardValue, { color: '#2563EB' }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: '#FEF2F2' }]}>
                  <Text style={styles.driverCardTitle}>Off Duty</Text>
                  <Text style={[styles.driverCardValue, { color: '#DC2626' }]}>0</Text>
                </View>
                <View style={[styles.driverCard, { backgroundColor: '#F3E8FF' }]}>
                  <Text style={styles.driverCardTitle}>Total</Text>
                  <Text style={[styles.driverCardValue, { color: '#9333EA' }]}>0</Text>
                </View>
              </View>

              {/* No drivers found message */}
              <View style={styles.noDriverBox}>
                <Text style={styles.noDriverIcon}>👤</Text>
                <Text style={styles.noDriverText}>No drivers found</Text>
                <Text style={styles.noDriverSub}>
                  Contact your system administrator to add drivers to the system.
                </Text>
              </View>
            </View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- GENERAL LAYOUT & MARGINS ---
  outerContainer: { 
    flex: 1, 
    backgroundColor: '#F9FAFB',
    alignItems: 'center', 
  },
  container: { 
    flex: 1, 
    width: '100%',
    maxWidth: 1050, 
    backgroundColor: '#F9FAFB'
  },
  scrollContainer: { 
    padding: 16,
    paddingBottom: 50, 
  },

  // --- HEADER ---
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280' },
  signOutButton: { 
    backgroundColor: '#F3F4F6', 
    paddingVertical: 6, 
    paddingHorizontal: 10,
    borderRadius: 8, 
    marginTop: 4, 
  },
  signOutText: { color: '#111827', fontWeight: '500', fontSize: 12 }, 

  // --- STATS CARDS ---
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  card: {
    width: '23%', 
    minWidth: 150, 
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: '#374151', marginBottom: 5 }, 
  cardValue: { fontSize: 28, fontWeight: 'bold', }, 

  // --- TABS ---
tabs: {
  flexDirection: 'row',
  backgroundColor: '#F3F4F6',
  borderRadius: 20,
  padding: 4,
  marginBottom: 16,
  alignSelf: 'center',
  width: '100%',         // full width
  maxWidth: 1050,        // match container maxWidth
  justifyContent: 'space-between',
},
tabButton: {
  flex: 1,               // makes each tab equal width
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 8,
  borderRadius: 16,
  marginHorizontal: 2,
},
activeTabButton: {
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},
tabContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},
tabText: {
  fontSize: 13,
  color: '#6B7280',
  fontWeight: '500',
},
activeTabText: {
  color: '#2563EB',
  fontWeight: '600',
},
 
  // --- COMMON REQUEST SECTION STYLES ---
  requestBox: { backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  detailColumn: { width: '48%' },

  // --- PENDING CARD STYLES ---
  requestCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FACC15',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    paddingRight: 15, 
  },
  requestHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestName: { fontWeight: '600', fontSize: 14, color: '#374151' },
  requestEmail: { fontWeight: '400', color: '#6B7280', fontSize: 13 },
  requestDateText: { fontSize: 12, color: '#6B7280' },
  vehicleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pendingBadge: {
    backgroundColor: '#FCD34D', 
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  pendingBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#FBBF24', 
    paddingBottom: 10,
  },
  requestDetail: { fontSize: 13, color: '#374151', marginBottom: 4 },
  requestPurpose: { fontSize: 13, fontWeight: '500', marginTop: 4, color: '#374151' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  actionButton: {
    paddingVertical: 8, 
    paddingHorizontal: 16,
    borderRadius: 6, 
    marginLeft: 10,
    minWidth: 80, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  approveButton: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#86EFAD' },
  declineText: { color: '#B91C1C', fontWeight: '600' },
  approveText: { color: '#15803D', fontWeight: '600' },

  // --- APPROVED CARD STYLES ---
  approvedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34D399',
    backgroundColor: '#F0FFF7',
    borderRadius: 8,
    padding: 12,
  },
  approvedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  approvedUserInfo: { flexDirection: 'row', alignItems: 'center' },
  approvedName: { fontWeight: '700', fontSize: 14, color: '#10B981', marginRight: 8 },
  approvedBadge: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  approvedBadgeText: { color: '#065F46', fontSize: 11, fontWeight: '700' },
  markCompleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  markCompleteText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  approvedDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  approvedDetail: { fontSize: 13, color: '#059669', marginBottom: 4, marginRight: 15 },
  assignedText: { fontSize: 13, color: '#059669', fontWeight: '500', marginTop: 4 },
  assignedVehicle: { fontWeight: '700', textDecorationLine: 'underline' },

  // --- DRIVER STATUS ---
  driverSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  driverStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  driverCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverCardTitle: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  driverCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  noDriverBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  noDriverIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: '#9CA3AF',
  },
  noDriverText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  noDriverSub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

