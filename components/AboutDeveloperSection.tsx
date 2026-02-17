import { View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";

const ICONS = {
  github: require("../assets/images/icons/github.png"),
  linkedin: require("../assets/images/icons/linkedin.png"),
  whatsapp: require("../assets/images/icons/whatsapp.png"),
  email: require("../assets/images/icons/email.png"),
};

const LINKS = [
  {
    key: "github",
    label: "GitHub",
    value: "johnyREx",
    url: "https://github.com/johnyREx",
    icon: ICONS.github,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "John Kwofie",
    url: "https://www.linkedin.com/in/john-kwofie-731960101/",
    icon: ICONS.linkedin,
  },
  {
    key: "whatsappGh",
    label: "WhatsApp (Ghana)",
    value: "+233 246 408 195",
    url: "https://wa.me/233246408195",
    icon: ICONS.whatsapp,
  },
  {
    key: "whatsappIt",
    label: "WhatsApp (Italy)",
    value: "+39 350 986 0825",
    url: "https://wa.me/393509860825",
    icon: ICONS.whatsapp,
  },
  {
    key: "email",
    label: "Email",
    value: "Send me a message",
    url: "mailto:johnkwofie99@icloud.com?subject=EPGM%20App%20Support&body=Hello%20Johny%2C%0A%0A",
    icon: ICONS.email,
  },
];

export default function AboutDeveloperSection() {
  const open = async (url: string) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else await Linking.openURL(url);
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatarRing}>
          <Image
            source={require("../assets/images/johnyrex.jpg")}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.name}>Johny Rex</Text>
        <Text style={styles.role}>Software Engineer · App Developer</Text>

        <Text style={styles.identity}>
          John Kwofie by birth, Johny Rex by code, and T-Rex to friends.
          Johny Rex is my developer alter-ego — the builder of systems and apps.
          John Kwofie is the political philosopher, thinker, and observer of society.
        </Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>React Native</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Expo</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Firebase</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Thinker</Text>
          </View>
        </View>

        <Text style={styles.statement}>
          I am driven by creativity, purpose, and the belief that technology
          should serve people and communities. Through Johny Rex, I design and
          develop digital tools that are clean, scalable, and meaningful.
          Through John Kwofie, I remain a student of politics, philosophy, and
          human behavior. This application reflects my commitment to building
          solutions that support faith, structure, and global connection.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contribution</Text>

        <View style={styles.bulletRow}>
          <View style={styles.dot} />
          <Text style={styles.bulletText}>
            Designed and developed the EPGM mobile application for Android and iOS.
          </Text>
        </View>

        <View style={styles.bulletRow}>
          <View style={styles.dot} />
          <Text style={styles.bulletText}>
            Implemented Preaching Guide, Prayer Request, Constitution, and Bible School
            enrollment foundations.
          </Text>
        </View>

        <View style={styles.bulletRow}>
          <View style={styles.dot} />
          <Text style={styles.bulletText}>
            Built with a clean, scalable structure for future updates and ministry growth.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connect</Text>

        {LINKS.map((item) => (
          <Pressable key={item.key} onPress={() => open(item.url)} style={styles.linkRow}>
            <View style={styles.linkIconWrap}>
              <Image source={item.icon} style={styles.linkIcon} resizeMode="contain" />
            </View>

            <View style={styles.linkMid}>
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Text style={styles.linkValue} numberOfLines={1}>
                {item.value}
              </Text>
            </View>

            <Text style={styles.linkArrow}>›</Text>
          </Pressable>
        ))}

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Support</Text>
          <Text style={styles.tipText}>
            For quick support, WhatsApp is the best option.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with <Text style={styles.heart}>❤️</Text> by Johny Rex
        </Text>
        <Text style={styles.footerSub}>Technology in service of purpose.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },

  hero: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 6,
  },

  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 999,
    padding: 3,
    backgroundColor: "rgba(250,204,21,0.35)",
    shadowColor: "#facc15",
    shadowOpacity: 0.7,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(15,23,42,0.9)",
  },

  name: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fefce8",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  role: {
    fontSize: 12,
    color: "#e5e7eb",
    marginTop: 4,
  },

  identity: {
    fontSize: 12,
    color: "#d1d5db",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },

  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fde68a",
  },

  statement: {
    marginTop: 2,
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
    textAlign: "center",
  },

  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.25,
    borderColor: "rgba(148,163,184,0.45)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#fefce8",
    marginBottom: 10,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#fbbf24",
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    marginBottom: 10,
  },
  linkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  linkIcon: { width: 18, height: 18 },

  linkMid: { flex: 1, gap: 2 },

  linkLabel: {
    fontSize: 12,
    color: "#fde68a",
    fontWeight: "900",
  },
  linkValue: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  linkArrow: {
    fontSize: 20,
    color: "#fbbf24",
    fontWeight: "900",
  },

  tipBox: {
    marginTop: 4,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(245,158,11,0.10)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.25)",
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#fef3c7",
  },
  tipText: {
    fontSize: 11,
    color: "#e5e7eb",
    lineHeight: 16,
    marginTop: 4,
  },

  footer: {
    alignItems: "center",
    paddingTop: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fef3c7",
  },
  heart: { color: "#f97316" },
  footerSub: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
});