import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { RADIO_STATIONS, RadioStation } from "../data/radioStations";
import * as Radio from "../src/lib/RadioPlayer";

export default function RadioSection() {
  const stations = useMemo(() => RADIO_STATIONS, []);
  const { width } = useWindowDimensions();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // responsive columns
  const numColumns = width >= 900 ? 3 : 2;
  const tileWidth = numColumns === 3 ? "31.5%" : "48%";

  useEffect(() => {
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

      const current = Radio.getState();

      // if user taps the currently selected station, just toggle pause/play
      if (current.active?.id === station.id) {
        await Radio.togglePause();
        return;
      }

      // IMPORTANT: stop previous station before starting another
      await Radio.stop();
      await Radio.playStation(station);
    } catch (e) {
      setError("Could not start the radio stream. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const onToggle = async () => {
    try {
      setError(null);
      await Radio.togglePause();
    } catch {
      setError("Could not control playback.");
    }
  };

  const onStop = async () => {
    try {
      setError(null);
      await Radio.stop();
    } catch {
      setError("Could not stop playback.");
    }
  };

  const activeStation = stations.find((s) => s.id === activeId) ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>📻 EPGM Radio</Text>
        <Text style={styles.subtitle}>
          Listen live while browsing the app. Tap any station below to start streaming.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* STATIONS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Stations</Text>

        <View style={styles.grid}>
          {stations.map((s) => {
            const selected = activeId === s.id;
            const loading = loadingId === s.id;

            return (
              <Pressable
                key={s.id}
                onPress={() => onPlay(s)}
                style={[
                  styles.stationTile,
                  { width: tileWidth },
                  selected && styles.stationTileActive,
                ]}
              >
                <View style={styles.stationTop}>
                  <Text style={styles.stationEmoji}>
                    {loading ? "⏳" : selected ? "🔊" : "📡"}
                  </Text>

                  <View style={[styles.statusBadge, selected && styles.statusBadgeActive]}>
                    <Text style={[styles.statusBadgeText, selected && styles.statusBadgeTextActive]}>
                      {loading
                        ? "Connecting"
                        : selected
                        ? isPlaying
                          ? "Live"
                          : "Paused"
                        : "Ready"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.stationName} numberOfLines={2}>
                  {s.name}
                </Text>

                <Text style={styles.stationHint}>
                  {loading
                    ? "Please wait..."
                    : selected
                    ? isPlaying
                      ? "Now streaming"
                      : "Tap to resume"
                    : "Tap to play"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* NOW PLAYING */}
      <View style={styles.playerCard}>
        <Text style={styles.playerTitle}>Now Playing</Text>
        <Text style={styles.playerStation}>
          {activeStation?.name || "No station selected"}
        </Text>

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
          Selecting another station will now stop the previous one automatically.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },

  headerBlock: {
    paddingHorizontal: 4,
  },
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
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.92)",
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

  stationTile: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(2,6,23,0.4)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    minHeight: 130,
  },
  stationTileActive: {
    borderColor: "rgba(250,204,21,0.65)",
    backgroundColor: "rgba(30,41,59,0.78)",
    shadowColor: "#f59e0b",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  stationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationEmoji: {
    fontSize: 20,
    marginBottom: 10,
  },
  stationName: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fef3c7",
    marginTop: 6,
  },
  stationHint: {
    fontSize: 11,
    color: "#e5e7eb",
    marginTop: 8,
    lineHeight: 16,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  statusBadgeActive: {
    borderColor: "rgba(250,204,21,0.4)",
    backgroundColor: "rgba(120,53,15,0.35)",
  },
  statusBadgeText: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "800",
  },
  statusBadgeTextActive: {
    color: "#fde68a",
  },

  playerCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.92)",
    borderWidth: 1.25,
    borderColor: "rgba(148,163,184,0.45)",
  },
  playerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fefce8",
  },
  playerStation: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fde68a",
    marginTop: 6,
  },

  playerButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  btn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0b1120",
  },
  btnOutline: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  btnOutlineText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fbbf24",
  },
  btnDisabled: {
    opacity: 0.6,
  },

  note: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 10,
    lineHeight: 16,
  },
});