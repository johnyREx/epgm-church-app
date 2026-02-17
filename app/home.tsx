import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Alert,
} from "react-native";

import AboutDeveloperSection from "../components/AboutDeveloperSection";
import AboutMinistrySection from "../components/AboutMinistrySection";
import BibleStudySection from "../components/BibleStudySection";
import ConstitutionSection from "../components/ConstitutionSection";
import ContactSection from "../components/ContactSection";
import HistorySection from "../components/HistorySection";
import LiveStreamSection from "../components/LiveStreamSection";
import PrayerRequestSection from "../components/PrayerRequestSection";
import PreachingGuideSection from "../components/PreachingGuideSection";
import RadioSection from "../components/RadioSection";

const PROFILE_KEY = "epgm_profile";
const currentYear = new Date().getFullYear();
const APP_VERSION = "v1.0.0";

type Profile = {
  name: string;
  about: string;
  avatar: string;
};

const MENU_ITEMS = [
  { key: "history", label: "History" },
  { key: "constitution", label: "Constitution" },
  { key: "preachingGuide", label: "Preaching Guide" },
  { key: "prayerRequest", label: "Prayer Request" },
  { key: "bibleStudy", label: "Bible Study" },
  { key: "liveStream", label: "Live Stream" },
  { key: "radio", label: "Radio" },
  { key: "aboutMinistry", label: "About the Ministry" },
  { key: "contact", label: "Locations & Contacts" },
  { key: "aboutDeveloper", label: "About the Developer" },
  { key: "logout", label: "Logout" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeKey, setActiveKey] = useState(MENU_ITEMS[0].key);
  const [menuOpen, setMenuOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      if (!stored) {
        router.replace("/");
        return;
      }
      try {
        setProfile(JSON.parse(stored));
      } catch {
        router.replace("/");
      }
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    router.replace("/");
  };

  const handleOpenDeveloperGitHub = () => {
    Linking.openURL("https://github.com/johnyREx");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const renderContent = () => {

    if (activeKey === "logout") {
      Alert.alert(
        "Log Out",
        "Logging out will remove your profile from this device.\n\nThis app does NOT store personal information online, so you are not losing anything important.",
        [
          { text: "Cancel", style: "cancel", onPress: () => setActiveKey("history") },
          { text: "Log Out", style: "destructive", onPress: handleLogout },
        ]
      );
      return null;
    }

    switch (activeKey) {
      case "history":
        return <HistorySection />;
      case "constitution":
        return <ConstitutionSection />;
      case "preachingGuide":
        return <PreachingGuideSection />;
      case "prayerRequest":
        return <PrayerRequestSection />;
      case "bibleStudy":
        return <BibleStudySection />;
      case "liveStream":
        return <LiveStreamSection />;
      case "radio":
        return <RadioSection />;
      case "aboutMinistry":
        return <AboutMinistrySection />;
      case "contact":
        return <ContactSection />;
      case "aboutDeveloper":
        return <AboutDeveloperSection />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/theme.jpg")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.headerTitle}>
                  BPAM Church App{" "}
                  <Text style={styles.footerVersion}>{APP_VERSION}</Text>
                </Text>
                <Text style={styles.headerSubtitle}>
                  Bishop Peter Ababio Ministries
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Pressable
                onPress={() => setMenuOpen((v) => !v)}
                style={styles.menuToggle}
              >
                <Text style={styles.menuToggleText}>☰</Text>
              </Pressable>

              {/* ✅ FIXED LAYOUT */}
              <View style={styles.profileWrapper}>
                <View style={styles.profileBlock}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarGlyph}>
                      {profile?.avatar || "🔥"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.profileName}>
                      {profile?.name || "EPGM Member"}
                    </Text>
                    {profile?.about ? (
                      <Text style={styles.profileAbout} numberOfLines={1}>
                        {profile.about}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* LOGOUT BUTTON REMOVED FROM HEADER */}

              </View>

            </View>
          </View>

          {/* ===== BODY ===== */}
          <View style={styles.body}>
            {menuOpen && (
              <View style={styles.menu}>
                {MENU_ITEMS.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => setActiveKey(item.key)}
                    style={[
                      styles.menuItem,
                      activeKey === item.key && styles.menuItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        activeKey === item.key && styles.menuItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.content}>
              <ScrollView
                contentContainerStyle={styles.contentScroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#f97316"
                  />
                }
              >
                {renderContent()}
              </ScrollView>
            </View>
          </View>

          {/* ===== FOOTER ===== */}
          <View style={styles.footerWrapper}>
            <View style={styles.divider} />

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.footerCopyright}>
                © {currentYear} Bishop Peter Ababio Ministries
              </Text>

              <Text style={styles.footerVersion}>{APP_VERSION}</Text>

              <Pressable onPress={handleOpenDeveloperGitHub}>
                <Text style={styles.footerText}>
                  Built with <Text style={styles.heart}>❤️</Text> by{" "}
                  <Text style={styles.footerLink}>Johny Rex</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.7)" },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 44, height: 44 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fef9c3" },
  headerSubtitle: { fontSize: 11, color: "#e5e7eb" },

  headerRight: { flexDirection: "row", alignItems: "flex-start", gap: 12 },

  profileWrapper: {
    alignItems: "flex-end",
  },

  menuToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
  },
  menuToggleText: { fontSize: 16, color: "#fefce8" },

  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
  },

  logoutBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.15)",
    borderWidth: 1,
    borderColor: "#f97316",
  },

  logoutText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f97316",
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlyph: { fontSize: 18 },
  profileName: { fontSize: 13, fontWeight: "700", color: "#fef9c3" },
  profileAbout: { fontSize: 11, color: "#e5e7eb", maxWidth: 160 },

  body: { flex: 1, flexDirection: "row", gap: 12 },

  menu: {
    width: 170,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },

  menuItem: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  menuItemActive: { backgroundColor: "#f97316" },
  menuItemText: { fontSize: 13, color: "#e5e7eb" },
  menuItemTextActive: { color: "#0b1120", fontWeight: "700" },

  content: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    padding: 14,
  },
  contentScroll: { paddingBottom: 24 },

  footerWrapper: { paddingTop: 10 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  footer: { alignItems: "center", gap: 4 },
  footerVersion: { fontSize: 11, color: "#fbbf24", letterSpacing: 1 },
  footerCopyright: { fontSize: 11, color: "#9ca3af" },
  footerText: { fontSize: 12, color: "#e5e7eb" },
  heart: { color: "#f97316" },
  footerLink: { color: "#fbbf24", textDecorationLine: "underline" },
});