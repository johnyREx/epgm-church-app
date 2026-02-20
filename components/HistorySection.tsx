import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function HistorySection() {
  const fullText =
    "To God be the glory. Bishop Peter Ababio Ministry was started on Sunday 25th May 2014. E.P.G.M. began on Accra24.com Radio Germany and later on True Gospel Radio Italy. On 21st November 2016, by the grace of God, the ministry was planted at Spilamberto Commune, Piazza Caduti Libertà 3. The first congregation was seven people, three adults and four children. Jesus Christ is the builder of the Church (Matthew 16:18). We thank God for End Time Prayer Global Ministry.";

  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      if (i >= fullText.length) {
        setVisibleText(fullText);
        clearInterval(interval);
      } else {
        setVisibleText(fullText.slice(0, i));
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.heroRow}>
        <View style={styles.portraitBlock}>
          <Image
            source={require("../assets/images/bishop.png")}
            style={styles.portrait}
            resizeMode="cover"
          />
          <Text style={styles.name}>Bishop Dr. Peter Ababio</Text>
        </View>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.portraitBlock}>
          <Image
            source={require("../assets/images/rev_sabina.png")}
            style={styles.portrait}
            resizeMode="cover"
          />
          <Text style={styles.name}>Rev. Sabina Nsiah Ababio</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>The Birth of the Ministry</Text>
        <Text style={styles.subheading}>
          Bishop Peter Ababio Ministries (B.P.A.M)
        </Text>
        <Text style={styles.body}>{visibleText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },

  portraitBlock: {
    alignItems: "center",
    width: 100,
  },

  portrait: {
    width: 95,
    height: 130,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#facc15",
    backgroundColor: "#fbbf24",
  },

  name: {
    marginTop: 6,
    fontSize: 11,
    color: "#fefce8",
    textAlign: "center",
    fontWeight: "600",
  },

  logo: {
    width: 95,
    height: 95,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: "rgba(250,204,21,0.10)",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.55)",
    shadowColor: "#facc15",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fefce8",
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },

  subheading: {
    fontSize: 12,
    color: "#fde68a",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "#fefce8",
    textShadowColor: "#f97316",
    textShadowRadius: 8,
  },
});