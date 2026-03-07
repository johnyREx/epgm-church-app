import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  useWindowDimensions,
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
  const { width } = useWindowDimensions();

  const isSmallPhone = width < 430;
  const isTabletLike = width >= 900;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeKey, setActiveKey] = useState(MENU_ITEMS[0].key);
  const [menuOpen, setMenuOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(isSmallPhone ? 0 : 1)).current;

  useEffect(() => {
    // on very small screens start with menu closed
    setMenuOpen(!isSmallPhone);
    menuAnim.setValue(isSmallPhone ? 0 : 1);
  }, [isSmallPhone, menuAnim]);

  const menuTargetWidth = useMemo(() => {
    if (isTabletLike) return 250;
    if (width >= 600) return 220;
    return 165;
  }, [isTabletLike, width]);

  const animatedMenuWidth = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, menuTargetWidth],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);

    Animated.timing(menuAnim, {
      toValue: next ? 1 : 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  };

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

  const onMenuItemPress = (key: string) => {
    setActiveKey(key);

    // auto close menu on small phones after selecting a section
    if (isSmallPhone && menuOpen) {
      toggleMenu();
    }
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
        <View
          style={[
            styles.container,
            {
              paddingHorizontal: isSmallPhone ? 12 : 16,
              paddingTop: isSmallPhone ? 34 : 40,
            },
          ]}
        >
          {/* HEADER */}
          <View style={[styles.header, isSmallPhone && styles.headerStack]}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../assets/images/logo.png")}
                style={[
                  styles.headerLogo,
                  { width: isSmallPhone ? 52 : 44, height: isSmallPhone ? 52 : 44 },
                ]}
                resizeMode="contain"
              />
              <View style={styles.headerTextWrap}>
                <Text
                  style={[styles.headerTitle, isSmallPhone && styles.headerTitleSmall]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  BPAM Church App{" "}
                  <Text style={styles.footerVersion}>{APP_VERSION}</Text>
                </Text>

                <Text
                  style={styles.headerSubtitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  Bishop Peter Ababio Ministries
                </Text>
              </View>
            </View>

            <View style={[styles.headerRight, isSmallPhone && styles.headerRightSmall]}>
              <Pressable onPress={toggleMenu} style={styles.menuToggle}>
                <Text style={styles.menuToggleText}>{menuOpen ? "✕" : "☰"}</Text>
              </Pressable>

              <View style={[styles.profileWrapper, isSmallPhone && styles.profileWrapperSmall]}>
                <View style={styles.profileBlock}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarGlyph}>{profile?.avatar || "🔥"}</Text>
                  </View>

                  <View style={styles.profileTextWrap}>
                    <Text
                      style={styles.profileName}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {profile?.name || "EPGM Member"}
                    </Text>

                    {profile?.about ? (
                      <Text style={styles.profileAbout} numberOfLines={1}>
                        {profile.about}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            <Animated.View
              style={[
                styles.menuAnimatedWrap,
                {
                  width: animatedMenuWidth,
                  opacity: menuAnim,
                  marginRight: menuOpen ? 12 : 0,
                },
              ]}
            >
              <View style={styles.menu}>
                {MENU_ITEMS.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => onMenuItemPress(item.key)}
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
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

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

          {/* FOOTER */}
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
    paddingBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "flex-start",
    gap: 10,
  },
  headerStack: {
    gap: 12,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerLogo: {
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fef9c3",
  },
  headerTitleSmall: {
    fontSize: 14.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#e5e7eb",
    marginTop: 2,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    maxWidth: "48%",
  },
  headerRightSmall: {
    maxWidth: "54%",
  },

  profileWrapper: {
    alignItems: "flex-end",
    flexShrink: 1,
  },
  profileWrapperSmall: {
    maxWidth: 180,
  },

  menuToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
  },
  menuToggleText: {
    fontSize: 16,
    color: "#fefce8",
    fontWeight: "700",
  },

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
    maxWidth: "100%",
  },
  profileTextWrap: {
    minWidth: 0,
    flexShrink: 1,
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlyph: {
    fontSize: 18,
  },
  profileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fef9c3",
  },
  profileAbout: {
    fontSize: 11,
    color: "#e5e7eb",
    maxWidth: 135,
  },

  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },

  menuAnimatedWrap: {
    overflow: "hidden",
  },

  menu: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },

  menuItem: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: "#f97316",
  },
  menuItemText: {
    fontSize: 13,
    color: "#e5e7eb",
  },
  menuItemTextActive: {
    color: "#0b1120",
    fontWeight: "700",
  },

  content: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    padding: 14,
    minWidth: 0,
  },
  contentScroll: {
    paddingBottom: 24,
  },

  footerWrapper: {
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  footer: {
    alignItems: "center",
    gap: 4,
  },
  footerVersion: {
    fontSize: 11,
    color: "#fbbf24",
    letterSpacing: 1,
  },
  footerCopyright: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#e5e7eb",
    textAlign: "center",
  },
  heart: {
    color: "#f97316",
  },
  footerLink: {
    color: "#fbbf24",
    textDecorationLine: "underline",
  },
});