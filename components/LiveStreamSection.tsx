import { View, Text, StyleSheet, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";

const STREAMS = [
  {
    label: "Facebook Live",
    hint: "Watch the ministry live on Facebook",
    url: "https://www.facebook.com/share/1ABdpcX8s5/",
    icon: "📘",
  },
  {
    label: "YouTube Channel",
    hint: "Watch services & videos",
    url: "https://www.youtube.com/@triplekmediagh",
    icon: "▶️",
  },
  {
    label: "TikTok Live",
    hint: "Join the live on TikTok",
    url: "https://tiktok.com/@triplekmedia.com389540",
    icon: "🎵",
  },
];

export default function LiveStreamSection() {
  const open = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>📡 Live Streams</Text>
        <Text style={styles.subtitle}>
          Choose where you want to watch. We’ll keep adding more options.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Watch & Join</Text>

        {STREAMS.map((s) => (
          <Pressable key={s.label} style={styles.row} onPress={() => open(s.url)}>
            <Text style={styles.icon}>{s.icon}</Text>
            <View style={styles.textBlock}>
              <Text style={styles.label}>{s.label}</Text>
              <Text style={styles.hint}>{s.hint}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}

        <Text style={styles.note}>
          Tip: For the smoothest experience, members can also open the stream in
          the native app from here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  headerBlock: { paddingHorizontal: 4 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fefce8",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.25,
    borderColor: "rgba(250,204,21,0.35)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fefce8",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    marginBottom: 10,
  },
  icon: { fontSize: 18, marginRight: 10 },
  textBlock: { flex: 1, gap: 2 },
  label: { fontSize: 13, fontWeight: "800", color: "#fde68a" },
  hint: { fontSize: 11, color: "#e5e7eb" },
  arrow: { fontSize: 20, color: "#fbbf24", fontWeight: "700" },
  note: { fontSize: 11, color: "#9ca3af", marginTop: 6, lineHeight: 16 },
});