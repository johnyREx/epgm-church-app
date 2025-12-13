import { View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";

const LINKS = [
  { label: "GitHub", value: "johnyREx", url: "https://github.com/johnyREx" },
  {
    label: "LinkedIn",
    value: "John Kwofie",
    url: "https://www.linkedin.com/in/john-kwofie-731960101/",
  },

  // WhatsApp Ghana: 0246408195 -> +233 246 408 195
  {
    label: "WhatsApp (Ghana)",
    value: "+233 246 408 195",
    url: "https://wa.me/233246408196",
  },

  // WhatsApp Italy: 3509860825 -> +39 350 986 0825
  {
    label: "WhatsApp (Italy)",
    value: "+39 350 986 0825",
    url: "https://wa.me/393509860825",
  },

  // Optional (delete if you don’t want email contact)
  {
    label: "Email",
    value: "Send me a message",
    url: "mailto:johnkwofie99@icloud.com?subject=EPGM%20App%20Support&body=Hello%20Johny%2C%0A%0A",
  },
];

export default function AboutDeveloperSection() {
  const open = async (url: string) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else await Linking.openURL(url); // fallback for web
    } catch (e) {
      // silent fail (no crash)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Image
            source={require("../assets/images/johnyrex.jpg")}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.name}>Johny Rex</Text>
        <Text style={styles.role}>Software Engineer · App Developer</Text>

        <Text style={styles.statement}>
          I build meaningful digital tools that serve communities, faith, and
          purpose. This application was created to support the vision of End Time
          Prayer Global Ministry by providing a simple, modern, and accessible
          platform for members worldwide.
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
          <Pressable
            key={item.label}
            onPress={() => open(item.url)}
            style={styles.linkRow}
          >
            <View style={styles.linkLeft}>
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Text style={styles.linkValue}>{item.value}</Text>
            </View>
            <Text style={styles.linkArrow}>›</Text>
          </Pressable>
        ))}

        <Text style={styles.contactNote}>
          For quick support, WhatsApp is the best option.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with ❤️ by Johny Rex</Text>
        <Text style={styles.footerSub}>Technology in service of purpose.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  avatarWrap: {
    width: 104,
    height: 104,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.92)",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.55)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#facc15",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fefce8",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  role: {
    fontSize: 12,
    color: "#e5e7eb",
    marginTop: 4,
  },
  statement: {
    marginTop: 12,
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
    fontWeight: "800",
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
    justifyContent: "space-between",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    marginBottom: 10,
  },
  linkLeft: {
    gap: 2,
  },
  linkLabel: {
    fontSize: 12,
    color: "#fde68a",
    fontWeight: "700",
  },
  linkValue: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  linkArrow: {
    fontSize: 20,
    color: "#fbbf24",
    fontWeight: "700",
  },
  contactNote: {
    marginTop: 6,
    fontSize: 11,
    color: "#9ca3af",
    lineHeight: 16,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingTop: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fef3c7",
  },
  footerSub: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
});