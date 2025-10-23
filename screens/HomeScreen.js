import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.appName}>CampusGo</Text>
          <Text style={styles.slogan}>
            The Official NORSU Transportation Service
          </Text>
        </View>

        {/* Announcements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements & Updates</Text>
          <View style={styles.announcementsGrid}>
            
            {/* Announcement Card 1 */}
            <View style={styles.card}>
              <Text style={styles.cardTag}>🛠️ ALERT</Text>
              <Text style={styles.cardTitle}>System Maintenance</Text>
              <Text style={styles.cardText}>
                CampusGo will undergo scheduled maintenance on October 15 from
                12AM to 4AM. Please plan accordingly.
              </Text>
            </View>

            {/* Announcement Card 2 */}
            <View style={styles.card}>
              <Text style={styles.cardTag}>✨ NEW</Text>
              <Text style={styles.cardTitle}>Feature Release!</Text>
              <Text style={styles.cardText}>
                We’ve added a new Request System for campus forms — simplifying
                transactions.
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            CampusGo is a platform dedicated to enhancing the campus experience
            by streamlining essential services. Our mission is to provide
            efficient, reliable, and secure access to transportation management
            and administrative processes for all NORSU students.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <Text style={styles.paragraph}>
            📧 Support: support@campusgo.edu{"\n"}
            📞 Office: (02) 1234 5678{"\n"}
            📍 Location: University Road, City Campus, NORSU
          </Text>
        </View>

        {/* Login / Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loginpage")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login / Sign Up</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

// 🎨 Styling
const PRIMARY_COLOR = "#005FB8"; // Blue
const ACCENT_COLOR = "#10B981"; // Green
const BACKGROUND_COLOR = "#F5F7FA"; // Light gray

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  contentWrapper: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: PRIMARY_COLOR,
  },
  slogan: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#374151",
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
    paddingLeft: 10,
  },
  announcementsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: 150,
    minHeight: 140,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: ACCENT_COLOR,
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 5,
    color: "#1F2937",
  },
  cardText: {
    fontSize: 13,
    color: "#6B7280",
  },
  paragraph: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
