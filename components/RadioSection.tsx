import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { RADIO_STATIONS, RadioStation } from "../data/radioStations";

export default function RadioSection() {
  const stations = useMemo(() => RADIO_STATIONS, []);
  const [active, setActive] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // iOS needs this for background/silent mode behaviour
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (sound) sound.unloadAsync().catch(() => {});
    };
  }, [sound]);

  const stop = async () => {
    try {
      setError(null);
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } catch {}
    setSound(null);
    setIsPlaying(false);
    setActive(null);
    setLoadingId(null);
  };

  const playStation = async (station: RadioStation) => {
    try {
      setError(null);
      setLoadingId(station.id);

      // If another sound exists, unload it first
      if (sound) {
        await sound.stopAsync().catch(() => {});
        await sound.unloadAsync().catch(() => {});
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.streamUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setActive(station);
      setIsPlaying(true);
    } catch (e) {
      setError("Could not start the radio stream. Please try again.");
      setActive(null);
      setIsPlaying(false);
    } finally {
      setLoadingId(null);
    }
  };

  const togglePause = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>📻 EPGM Radio</Text>
        <Text style={styles.subtitle}>
          Choose a station and listen live. You can switch stations anytime.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stations</Text>

        {stations.map((s) => {
          const selected = active?.id === s.id;
          const loading = loadingId === s.id;

          return (
            <Pressable
              key={s.id}
              onPress={() => playStation(s)}
              style={[
                styles.stationRow,
                selected && styles.stationRowActive,
              ]}
            >
              <View style={styles.stationLeft}>
                <Text style={styles.stationName}>{s.name}</Text>
                <Text style={styles.stationHint}>
                  {selected
                    ? isPlaying
                      ? "Now playing"
                      : "Paused"
                    : "Tap to play"}
                </Text>
              </View>

              <Text style={styles.stationAction}>
                {loading ? "..." : selected ? "⏸️/▶️" : "▶️"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.playerCard}>
        <Text style={styles.playerTitle}>Now Playing</Text>
        <Text style={styles.playerStation}>
          {active?.name || "No station selected"}
        </Text>

        <View style={styles.playerButtons}>
          <Pressable
            style={[styles.btn, !sound && styles.btnDisabled]}
            onPress={togglePause}
            disabled={!sound}
          >
            <Text style={styles.btnText}>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>

          <Pressable
            style={[styles.btnOutline, !sound && styles.btnDisabled]}
            onPress={stop}
            disabled={!sound}
          >
            <Text style={styles.btnOutlineText}>Stop</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Tip: If a stream fails, tap the same station again to reconnect.
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
    padding: 14,
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
  stationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    marginBottom: 10,
  },
  stationRowActive: {
    borderColor: "rgba(250,204,21,0.55)",
    backgroundColor: "rgba(30,41,59,0.65)",
  },
  stationLeft: { gap: 2, flex: 1, paddingRight: 10 },
  stationName: { fontSize: 13, fontWeight: "800", color: "#fef3c7" },
  stationHint: { fontSize: 11, color: "#e5e7eb" },
  stationAction: { fontSize: 16, color: "#fbbf24", fontWeight: "700" },

  playerCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.25,
    borderColor: "rgba(148,163,184,0.45)",
  },
  playerTitle: { fontSize: 13, fontWeight: "800", color: "#fefce8" },
  playerStation: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fde68a",
    marginTop: 6,
  },
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