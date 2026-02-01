import { View, Text, StyleSheet, Pressable, Linking, Platform } from "react-native";

type LocationCard = {
  title: string;
  subtitle?: string;
  addressLine?: string;
  gps?: string;
  phones?: { label: string; value: string }[];
  website?: { label: string; url: string }[];
};

const GHANA: LocationCard = {
  title: "Ghana Branch",
  subtitle: "Bishop Peter Ababio Ministries",
  addressLine: "Proton St, Weija–Gbawe",
  gps: "GS-0137-9154",
  phones: [
    { label: "Call / WhatsApp", value: "+233248490953" },
    { label: "Call / WhatsApp", value: "+233244562322" },
  ],
  website: [
    { label: "Website", url: "https://www.triplekmedia.com" },
    { label: "YouTube", url: "https://www.youtube.com/@triplekmediagh" },
    { label: "Facebook", url: "https://www.facebook.com/share/1ABdpcX8s5/" },
    { label: "TikTok", url: "https://tiktok.com/@triplekmedia.com389540" },
  ],
};

const ITALY: LocationCard = {
  title: "Italy Branch",
  subtitle: "End Time Prayer Global Ministry",
  addressLine: "Piazza Caduti Liberta 3, Spilamberto",
  phones: [{ label: "WhatsApp (Italy)", value: "+393895403600" }],
  website: [
    { label: "Website", url: "https://www.triplekmedia.com" },
    { label: "YouTube", url: "https://www.youtube.com/@triplekmediagh" },
  ],
};

function formatPhoneForTel(phone: string) {
  return phone.replace(/\s+/g, "");
}

function mapUrlFromQuery(query: string) {
  const encoded = encodeURIComponent(query);
  if (Platform.OS === "ios") return `http://maps.apple.com/?q=${encoded}`;
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

export default function ContactSection() {
  const open = async (url: string) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else await Linking.openURL(url);
    } catch {}
  };

  const openMaps = (card: LocationCard) => {
    const query = [card.subtitle, card.addressLine, card.gps].filter(Boolean).join(", ");
    open(mapUrlFromQuery(query));
  };

  const callPhone = (phone: string) => {
    open(`tel:${formatPhoneForTel(phone)}`);
  };

  const openWhatsApp = (phone: string) => {
    const clean = phone.replace("+", "").replace(/\s+/g, "");
    open(`https://wa.me/${clean}`);
  };

  const Card = ({ card }: { card: LocationCard }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{card.title}</Text>
      {card.subtitle ? <Text style={styles.cardSubtitle}>{card.subtitle}</Text> : null}

      {card.addressLine ? (
        <Text style={styles.line}>
          <Text style={styles.label}>Street:</Text> {card.addressLine}
        </Text>
      ) : null}

      {card.gps ? (
        <Text style={styles.line}>
          <Text style={styles.label}>GPS:</Text> {card.gps}
        </Text>
      ) : null}

      <Pressable style={styles.actionPrimary} onPress={() => openMaps(card)}>
        <Text style={styles.actionPrimaryText}>📍 Open in Maps</Text>
      </Pressable>

      {card.phones?.length ? (
        <View style={styles.actionsGrid}>
          {card.phones.map((p) => (
            <View key={p.value} style={styles.actionRow}>
              <Text style={styles.actionLabel}>{p.label}</Text>

              <View style={styles.actionButtons}>
                <Pressable style={styles.actionOutline} onPress={() => callPhone(p.value)}>
                  <Text style={styles.actionOutlineText}>📞 Call</Text>
                </Pressable>
                <Pressable style={styles.actionOutline} onPress={() => openWhatsApp(p.value)}>
                  <Text style={styles.actionOutlineText}>💬 WhatsApp</Text>
                </Pressable>
              </View>

              <Text style={styles.actionValue}>{p.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {card.website?.length ? (
        <View style={styles.linksBlock}>
          <Text style={styles.linksTitle}>Links</Text>
          {card.website.map((w) => (
            <Pressable key={w.url} onPress={() => open(w.url)} style={styles.linkRow}>
              <Text style={styles.linkText}>{w.label}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Locations & Contacts</Text>
        <Text style={styles.subtitle}>
          Reach the ministry, visit a branch, or connect online.
        </Text>
      </View>

      <Card card={GHANA} />
      <Card card={ITALY} />
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
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#fefce8" },
  cardSubtitle: { fontSize: 12.5, color: "#fde68a", marginTop: 4 },
  line: { marginTop: 8, fontSize: 12.5, color: "#e5e7eb", lineHeight: 18 },
  label: { fontWeight: "800", color: "#fef3c7" },

  actionPrimary: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
  },
  actionPrimaryText: { fontSize: 13, fontWeight: "900", color: "#0b1120" },

  actionsGrid: { marginTop: 12, gap: 10 },
  actionRow: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
  },
  actionLabel: { fontSize: 12, fontWeight: "800", color: "#fde68a" },
  actionButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
  actionOutline: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.45)",
  },
  actionOutlineText: { fontSize: 12, fontWeight: "800", color: "#fefce8" },
  actionValue: { marginTop: 8, fontSize: 11.5, color: "#9ca3af" },

  linksBlock: { marginTop: 14 },
  linksTitle: { fontSize: 12, fontWeight: "900", color: "#fefce8", marginBottom: 8 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.10)",
    marginBottom: 10,
  },
  linkText: { fontSize: 12.5, fontWeight: "800", color: "#e5e7eb" },
  linkArrow: { fontSize: 20, fontWeight: "900", color: "#fbbf24" },
});