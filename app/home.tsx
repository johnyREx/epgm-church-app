import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Linking,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const PROFILE_KEY = "epgm_profile";

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
  { key: "aboutMinistry", label: "About the Ministry" },
  { key: "aboutDeveloper", label: "About the Developer" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeKey, setActiveKey] = useState(MENU_ITEMS[0].key);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      if (!stored) {
        router.replace("/");
        return;
      }
      try {
        const parsed: Profile = JSON.parse(stored);
        setProfile(parsed);
      } catch {
        router.replace("/");
      }
    };
    load();
  }, [router]);

  const handleOpenDeveloperGitHub = () => {
    Linking.openURL("https://github.com/johnyREx");
  };

  const renderContent = () => {
    switch (activeKey) {
      case "history":
        return (
          <Text style={styles.contentText}>
            This is where the full history and journey of End Time Prayer Global
            Ministry will be displayed.
          </Text>
        );
      case "constitution":
        return (
          <Text style={styles.contentText}>
            This section will contain the Church Constitution with smooth
            reading and download options.
          </Text>
        );
      case "preachingGuide":
        return (
          <Text style={styles.contentText}>
            This is the Preaching Guide space for outlines, scriptures, topics,
            and schedules.
          </Text>
        );
      case "prayerRequest":
        return (
          <Text style={styles.contentText}>
            Here members will submit prayer requests that reach the leadership
            of the ministry.
          </Text>
        );
      case "bibleStudy":
        return (
          <Text style={styles.contentText}>
            This area will hold Bible Study plans, passages, notes, and weekly
            themes.
          </Text>
        );
      case "liveStream":
        return (
          <Text style={styles.contentText}>
            This section will connect members to live streams and recorded
            services.
          </Text>
        );
      case "aboutMinistry":
        return (
          <Text style={styles.contentText}>
            This screen will introduce the Bishop, Rev. Sabina, the vision,
            mission, and mandate of the ministry.
          </Text>
        );
      case "aboutDeveloper":
        return (
          <Text style={styles.contentText}>
            This screen will present Johny Rex, the developer of this app, with
            links to GitHub, LinkedIn, and other platforms.
          </Text>
        );
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
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.headerTitle}>EPGM Church App</Text>
                <Text style={styles.headerSubtitle}>
                  End Time Prayer Global Ministry
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
            </View>
          </View>

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
              >
                {renderContent()}
              </ScrollView>
            </View>
          </View>

          <Pressable style={styles.footer} onPress={handleOpenDeveloperGitHub}>
            <Text style={styles.footerText}>
              Built with <Text style={styles.heart}>❤️</Text> by{" "}
              <Text style={styles.footerLink}>Johny Rex</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.7)",
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fef9c3",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#e5e7eb",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
  },
  menuToggleText: {
    fontSize: 16,
    color: "#fefce8",
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
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
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
    maxWidth: 160,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  menu: {
    width: 170,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  menuItem: {
    paddingVertical: 8,
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
  },
  contentScroll: {
    paddingBottom: 24,
  },
  contentText: {
    fontSize: 14,
    color: "#e5e7eb",
    lineHeight: 22,
  },
  footer: {
    marginTop: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  heart: {
    color: "#f97316",
  },
  footerLink: {
    color: "#fbbf24",
    textDecorationLine: "underline",
  },
});