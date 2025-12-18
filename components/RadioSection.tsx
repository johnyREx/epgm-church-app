import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { RADIO_STATIONS, RadioStation } from "../data/radioStations";
import * as Radio from "../src/lib/RadioPlayer";

export default function RadioSection() {
  const stations = useMemo(() => RADIO_STATIONS, []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // keep UI in sync with global player
    const sync = () => {
      const s = Radio.getState();
      setActiveId(s.active?.id ?? null);
      setIsPlaying(s.isPlaying);
    };

    sync();
    const unsub = Radio.subscribe(sync);
    return unsub;
  }, []);

  const onPlay = async (station: RadioStation) => {
    try {
      setError(null);
      setLoadingId(station.id);
      await Radio.playStation(station);
    } catch {
      setError("Could not start the radio stream. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const onToggle = async () => {
    try {
      setError(null);
      await Radio.togglePause();
    } catch {}
  };

  const onStop = async () => {
    try {
      setError(null);
      await Radio.stop();
    } catch {}
  };

  const activeStation = stations.find((s) => s.id === activeId) ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>📻 EPGM Radio</Text>
        <Text style={styles.subtitle}>
          Start a station and keep listening while you browse other pages.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* GRID */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stations</Text>

        <View style={styles.grid}>
          {stations.map((s) => {
            const selected = activeId === s.id;
            const loading = loadingId === s.id;

            return (
              <Pressable
                key={s.id}
                onPress={() => onPlay(s)}
                style={[styles.stationTile, selected && styles.stationTileActive]}
              >
                <Text style={styles.stationEmoji}>{selected ? "🔊" : "📡"}</Text>

                <Text style={styles.stationName} numberOfLines={2}>
                  {s.name}
                </Text>

                <Text style={styles.stationHint}>
                  {loading ? "Connecting..." : selected ? (isPlaying ? "Playing" : "Paused") : "Tap to play"}
                </Text>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {loading ? "…" : selected ? (isPlaying ? "⏸" : "▶️") : "▶️"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* PLAYER */}
      <View style={styles.playerCard}>
        <Text style={styles.playerTitle}>Now Playing</Text>
        <Text style={styles.playerStation}>{activeStation?.name || "No station selected"}</Text>

        <View style={styles.playerButtons}>
          <Pressable
            style={[styles.btn, !activeStation && styles.btnDisabled]}
            onPress={onToggle}
            disabled={!activeStation}
          >
            <Text style={styles.btnText}>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>

          <Pressable
            style={[styles.btnOutline, !activeStation && styles.btnDisabled]}
            onPress={onStop}
            disabled={!activeStation}
          >
            <Text style={styles.btnOutlineText}>Stop</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Tip: Switching tabs will NOT stop audio anymore. Use Stop to end.
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
  subtitle: { fontSize: 13, color: "#e5e7eb", marginTop: 6, lineHeight: 20 },

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
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.25,
    borderColor: "rgba(250,204,21,0.35)",
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#fefce8", marginBottom: 10 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  stationTile: {
    width: "48%",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    position: "relative",
    minHeight: 120,
  },
  stationTileActive: {
    borderColor: "rgba(250,204,21,0.55)",
    backgroundColor: "rgba(30,41,59,0.65)",
  },
  stationEmoji: { fontSize: 18, marginBottom: 8 },
  stationName: { fontSize: 13, fontWeight: "900", color: "#fef3c7" },
  stationHint: { fontSize: 11, color: "#e5e7eb", marginTop: 6, lineHeight: 16 },

  badge: {
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.35)",
  },
  badgeText: { color: "#fbbf24", fontWeight: "900" },

  playerCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.25,
    borderColor: "rgba(148,163,184,0.45)",
  },
  playerTitle: { fontSize: 13, fontWeight: "800", color: "#fefce8" },
  playerStation: { fontSize: 14, fontWeight: "800", color: "#fde68a", marginTop: 6 },

  playerButtons: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
  },
  btnText: { fontSize: 13, fontWeight: "800", color: "#0b1120" },
  btnOutline: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  btnOutlineText: { fontSize: 13, fontWeight: "800", color: "#fbbf24" },
  btnDisabled: { opacity: 0.6 },

  note: { fontSize: 11, color: "#9ca3af", marginTop: 10, lineHeight: 16 },
});