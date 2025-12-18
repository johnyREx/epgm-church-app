import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";

type StreamItem = {
  id: string;
  label: string;
  hint: string;
  url: string;        // web fallback
  icon: string;
  kind: "external" | "zoom";
  zoomDeepLink?: string; // only for zoom
};

const ZOOM_WEB =
  "https://us02web.zoom.us/j/3895403600?pwd=VitFWWFSUzJjbEFVSms1Um9NQnhPZz09";

// Zoom deep link (preferred). This prompts the Zoom app if installed.
const ZOOM_DEEP_LINK =
  "zoomus://zoom.us/join?confno=3895403600&pwd=VitFWWFSUzJjbEFVSms1Um9NQnhPZz09";

const STREAMS: StreamItem[] = [
  {
    id: "zoom",
    label: "Join via Zoom",
    hint: "Join live meeting (best for interaction)",
    url: ZOOM_WEB,
    icon: "🟦",
    kind: "zoom",
    zoomDeepLink: ZOOM_DEEP_LINK,
  },
  {
    id: "facebook",
    label: "Facebook Live",
    hint: "Watch the ministry live on Facebook",
    url: "https://www.facebook.com/share/1ABdpcX8s5/",
    icon: "📘",
    kind: "external",
  },
  {
    id: "youtube",
    label: "YouTube Channel",
    hint: "Watch services & videos",
    url: "https://www.youtube.com/@triplekmediagh",
    icon: "▶️",
    kind: "external",
  },
  {
    id: "tiktok",
    label: "TikTok Live",
    hint: "Join the live on TikTok",
    url: "https://tiktok.com/@triplekmedia.com389540",
    icon: "🎵",
    kind: "external",
  },
];

export default function LiveStreamSection() {
  const items = useMemo(() => STREAMS, []);
  const [error, setError] = useState<string | null>(null);

  const openExternal = async (url: string) => {
    try {
      setError(null);
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch {
      setError("Could not open the link. Please try again.");
    }
  };

  const openZoom = async (deepLink: string | undefined, webUrl: string) => {
    try {
      setError(null);

      if (deepLink) {
        const can = await Linking.canOpenURL(deepLink);
        if (can) {
          await Linking.openURL(deepLink);
          return;
        }
      }

      // fallback to web if zoom app not installed
      await WebBrowser.openBrowserAsync(webUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch {
      setError("Could not open Zoom. Please try again.");
    }
  };

  const handlePress = async (s: StreamItem) => {
    if (s.kind === "zoom") {
      await openZoom(s.zoomDeepLink, s.url);
      return;
    }
    await openExternal(s.url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>📡 Live Streams</Text>
        <Text style={styles.subtitle}>
          Choose where you want to watch or join. Zoom is best for participation.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Watch & Join</Text>

        <View style={styles.grid}>
          {items.map((s) => (
            <Pressable
              key={s.id}
              style={[styles.tile, s.kind === "zoom" && styles.tileZoom]}
              onPress={() => handlePress(s)}
            >
              <View style={styles.tileTop}>
                <Text style={styles.tileIcon}>{s.icon}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{s.kind === "zoom" ? "JOIN" : "OPEN"}</Text>
                </View>
              </View>

              <Text style={styles.tileLabel} numberOfLines={2}>
                {s.label}
              </Text>
              <Text style={styles.tileHint} numberOfLines={3}>
                {s.hint}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.note}>
          Tip: Facebook, YouTube & TikTok open externally for the smoothest experience.
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

  error: {
    color: "#fecaca",
    backgroundColor: "rgba(127,29,29,0.35)",
    borderColor: "rgba(239,68,68,0.4)",
    borderWidth: 1,
    padding: 10,
    borderRadius: 14,
    fontSize: 12,
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
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  tile: {
    width: "48%",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    minHeight: 132,
  },
  tileZoom: {
    borderColor: "rgba(250,204,21,0.55)",
    backgroundColor: "rgba(30,41,59,0.65)",
  },

  tileTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tileIcon: { fontSize: 20 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
  },
  badgeText: { color: "#fbbf24", fontWeight: "900", fontSize: 11 },

  tileLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fde68a",
  },
  tileHint: {
    fontSize: 11,
    color: "#e5e7eb",
    marginTop: 6,
    lineHeight: 16,
  },

  note: { fontSize: 11, color: "#9ca3af", marginTop: 10, lineHeight: 16 },
});