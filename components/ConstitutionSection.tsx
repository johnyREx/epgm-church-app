import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function ConstitutionSection() {
  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Church Constitution</Text>
        <Text style={styles.subtitle}>
          Official doctrinal and administrative guide of End Time Prayer Global
          Ministry.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Audio Constitution</Text>
        <Text style={styles.cardSubtitle}>
          Soon you will be able to listen to the full constitution as a
          continuous audio message.
        </Text>

        <Pressable style={[styles.button, styles.buttonDisabled]}>
          <Text style={styles.buttonIcon}>▶️</Text>
          <Text style={styles.buttonText}>Play Audio (coming soon)</Text>
        </Pressable>

        <Pressable style={[styles.buttonOutline, styles.buttonDisabled]}>
          <Text style={styles.buttonTextOutline}>
            Download Constitution (coming soon)
          </Text>
        </Pressable>

        <Text style={styles.note}>
          This section will later include playback controls, progress and
          offline downloads, so members can meditate on the constitution
          anywhere.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  headerBlock: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fefce8",
    textAlign: "center",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.45)",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fefce8",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f97316",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1120",
  },
  buttonOutline: {
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonTextOutline: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fbbf24",
  },
  note: {
    fontSize: 12,
    color: "#e5e7eb",
    marginTop: 4,
    lineHeight: 18,
  },
});