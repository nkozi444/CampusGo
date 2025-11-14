import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const PRIMARY_COLOR = "#005FB8";
const ACCENT_COLOR = "#10B981";
const BACKGROUND_COLOR = "#F0F4F8";
const NAVBAR_HEIGHT = 70; // keep in sync with styles.navbar.height
const NAVBAR_MARGIN = 8;   // small extra gap when snapping to a section

export default function HomeScreen() {
  const router = useRouter();

  // Section refs (optional—but nice to keep for debugging)
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const announcementsRef = useRef(null);
  const contactRef = useRef(null);

  // ScrollView ref
  const scrollViewRef = useRef(null);

  // Store section Y positions measured via onLayout (most cross-platform stable)
  const sectionY = useRef({
    about: 0,
    services: 0,
    announcements: 0,
    contact: 0,
  });

  const scrollToKey = (key) => {
    if (!scrollViewRef.current) return;
    const rawY = sectionY.current[key] ?? 0;
    const y = Math.max(rawY - NAVBAR_HEIGHT - NAVBAR_MARGIN, 0);
    scrollViewRef.current.scrollTo({ y, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* 🌐 Navigation Bar */}
      <View style={styles.navbar}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.navLogo}
          resizeMode="contain"
        />
        <Text style={styles.navTitle}>CampusGo</Text>

        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => scrollToKey("about")}>
            <Text style={styles.navLink}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToKey("services")}>
            <Text style={styles.navLink}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToKey("announcements")}>
            <Text style={styles.navLink}>Announcements</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToKey("contact")}>
            <Text style={styles.navLink}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/loginpage")}
          >
            <Text style={styles.navButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📜 Main Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* 🖼 Header */}
        <ImageBackground
          source={require("../assets/images/norsu_building.jpg")}
          style={styles.headerBackground}
          imageStyle={{ resizeMode: "cover" }}
        >
          <View style={styles.headerOverlay}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>CampusGo</Text>
            <Text style={styles.slogan}>
              The Official NORSU Transportation Service
            </Text>
          </View>
        </ImageBackground>

        {/* 💬 Mission (About anchor) */}
        <View
          ref={aboutRef}
          onLayout={(e) => {
            sectionY.current.about = e.nativeEvent.layout.y;
          }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>{"\u25BA"}</Text>
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.paragraph}>
              CampusGo is dedicated to enhancing the campus experience by
              streamlining essential services. Our mission is to provide
              efficient, reliable, and secure access to transportation management
              and administrative processes for all NORSU students, faculty, and
              staff. We are committed to moving the campus forward by innovating
              our approach to logistics and documentation.
            </Text>
          </View>
        </View>

        {/* 💬 Vision (kept under About) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>{"\u25BA"}</Text>
            <Text style={styles.sectionTitle}>Our Vision</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.paragraph}>
              To be the digital backbone of the NORSU experience, making campus
              mobility and essential administrative processes so seamless, reliable,
              and swift that campus life moves forward without limits.
            </Text>
          </View>
        </View>

        {/* 🧭 Core Services (Services anchor) */}
        <View
          ref={servicesRef}
          onLayout={(e) => {
            sectionY.current.services = e.nativeEvent.layout.y;
          }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>{"\u25A0"}</Text>
            <Text style={styles.sectionTitle}>Our Core Services</Text>
          </View>

          <View style={styles.cardGrid}>
            <TouchableOpacity style={[styles.card, styles.blueCard]}>
              <Text style={styles.cardIcon}>{"\u27A4"}</Text>
              <Text style={styles.cardTitle}>Find a Ride / Track Bus</Text>
              <Text style={styles.cardText}>
                See the real-time location of all campus shuttles and estimated
                arrival times.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, styles.greenCard]}>
              <Text style={styles.cardIcon}>{"\u270F"}</Text>
              <Text style={styles.cardTitle}>Submit a Form / Request Documents</Text>
              <Text style={styles.cardText}>
                Submit, track, and manage transportation or administrative forms
                online.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, styles.orangeCard]}>
              <Text style={styles.cardIcon}>{"\u274C"}</Text>
              <Text style={styles.cardTitle}>View Schedules & Routes</Text>
              <Text style={styles.cardText}>
                Instantly view campus route maps, operating hours, and service
                alerts.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔔 Announcements (Announcements anchor) */}
        <View
          ref={announcementsRef}
          onLayout={(e) => {
            sectionY.current.announcements = e.nativeEvent.layout.y;
          }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>{"\u2757"}</Text>
            <Text style={styles.sectionTitle}>Announcements & Updates</Text>
          </View>

          <View style={styles.cardGrid}>
            <View style={[styles.card, styles.orangeCard]}>
              <Text style={styles.cardTag}>{"\u26A0\uFE0F"} SCHEDULED ALERT</Text>
              <Text style={styles.cardTitle}>System Maintenance</Text>
              <Text style={styles.cardText}>
                CampusGo will undergo scheduled maintenance on October 15 from
                12AM to 4AM. Please plan accordingly for temporary service
                unavailability.
              </Text>
            </View>

            <View style={[styles.card, styles.greenCard]}>
              <Text style={styles.cardTag}>{"\u272A"} NEW FEATURE</Text>
              <Text style={styles.cardTitle}>Expanded Request System</Text>
              <Text style={styles.cardText}>
                We’ve added a new Request System for campus forms, simplifying
                administrative transactions and expediting approvals.
              </Text>
            </View>

            <View style={[styles.card, styles.blueCard]}>
              <Text style={styles.cardTag}>{"\u2139\uFE0F"} IMPORTANT NOTICE</Text>
              <Text style={styles.cardTitle}>Holiday Schedule</Text>
              <Text style={styles.cardText}>
                Please be advised of special operating hours for campus
                transportation and administrative offices during the upcoming
                holiday break, from Dec 20-Jan 5.
              </Text>
            </View>
          </View>
        </View>

        {/* 📞 Contact (Contact anchor) */}
        <View
          ref={contactRef}
          onLayout={(e) => {
            sectionY.current.contact = e.nativeEvent.layout.y;
          }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>{"\u27A4"}</Text>
            <Text style={styles.sectionTitle}>Get In Touch</Text>
          </View>

          <View style={styles.contactGrid}>
            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>{"\u2709\uFE0F"}</Text>
              <Text style={styles.contactTitle}>Support Email</Text>
              <Text
                style={styles.contactText}
                onPress={() => Linking.openURL("mailto:support@campusgo.edu")}
              >
                support@campusgo.edu
              </Text>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>{"\u2706\uFE0F"}</Text>
              <Text style={styles.contactTitle}>Office Contact</Text>
              <Text style={styles.contactText}>(02) 1234 5678</Text>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>{"\u2799"}</Text>
              <Text style={styles.contactTitle}>Physical Location</Text>
              <Text style={styles.contactText}>
                8863+P9J, Capitol Area, Kagawasan Avenue, Dumaguete City, 6200 Negros Oriental
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

/* 🎨 Styles (unchanged, except keep NAVBAR_HEIGHT consistent) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  navbar: {
    height: NAVBAR_HEIGHT,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    elevation: 5,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  navLogo: { width: 40, height: 40 },
  navTitle: {
    fontWeight: "800",
    color: PRIMARY_COLOR,
    fontSize: 20,
    flex: 1,
    marginLeft: 10,
  },
  navLinks: { flexDirection: "row", alignItems: "center", gap: 25 },
  navLink: { color: "#374151", fontWeight: "600", fontSize: 15 },
  navButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 25,
    alignItems: "center",
    minHeight: height,
  },

  headerBackground: {
    width: "100%",
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
  },
  headerOverlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  appName: { fontSize: 36, fontWeight: "800", color: "#FFFFFF" },
  slogan: { fontSize: 15, color: "rgba(255, 255, 255, 0.9)", fontStyle: "italic" },

  section: { width: "100%", maxWidth: 1100, marginBottom: 50 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: PRIMARY_COLOR, marginLeft: 10 },
  icon: { fontSize: 22, color: PRIMARY_COLOR },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    width: Platform.OS === "web" ? "31%" : width > 900 ? "31%" : "100%",
    minWidth: 280,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: Platform.OS === "web" ? 0 : 20,
  },
  cardIcon: { fontSize: 24, marginBottom: 8, color: PRIMARY_COLOR },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 4 },
  cardText: { fontSize: 14, color: "#4B5563" },
  cardTag: { fontSize: 12, fontWeight: "700", marginBottom: 8, color: PRIMARY_COLOR },
  orangeCard: { borderTopWidth: 3, borderTopColor: "#F59E0B" },
  greenCard: { borderTopWidth: 3, borderTopColor: ACCENT_COLOR },
  blueCard: { borderTopWidth: 3, borderTopColor: "#3B82F6" },

  infoCard: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
    elevation: 3,
  },
  paragraph: { fontSize: 15, color: "#374151", lineHeight: 22, textAlign: "justify" },

  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  contactCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    width: Platform.OS === "web" ? "31%" : width > 900 ? "31%" : "100%",
    minWidth: 240,
    alignItems: "center",
    elevation: 3,
    marginBottom: Platform.OS === "web" ? 0 : 20,
  },
  contactIcon: { fontSize: 22, marginBottom: 6, color: PRIMARY_COLOR },
  contactTitle: { fontWeight: "700", color: PRIMARY_COLOR },
  contactText: { color: "#374151", textAlign: "center" },
});
