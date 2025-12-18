import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from "react-native";

type Leader = {
  id: string;
  name: string;
  role: string;
  photo?: any; // require(...)
};

type Department = {
  name: string;
  members: string[];
};

const LEADERS_PRIMARY: Leader[] = [
  {
    id: "bishop",
    name: "Bishop Dr. Peter Ababio",
    role: "Leader / Overseer",
    photo: require("../assets/images/bishop-peter.png"),
  },
  {
    id: "revSabina",
    name: "Reverend Sabina Nsiah Ababio",
    role: "Assistant Overseer",
    photo: require("../assets/images/rev-sabina.png"),
  },
  {
    id: "apostleKwabena",
    name: "Apostle Kwabena Boateng",
    role: "Apostle",
    photo: require("../assets/images/apostle-kwabena.png"),
  },
  {
    id: "revDaniel",
    name: "Reverend Daniel Sackey",
    role: "Reverend Minister",
    photo: require("../assets/images/rev-daniel.png"),
  },
  {
    id: "revMarcia",
    name: "Reverend Marcia Hayford",
    role: "Reverend Minister",
    photo: require("../assets/images/rev-marcia.png"),
  },
  {
    id: "dorothy",
    name: "Mrs. Dorothy Boateng",
    role: "Secretary",
    photo: require("../assets/images/mrs-dorothy.png"),
  },
  {
    id: "alice",
    name: "Sister Alice Osei",
    role: "Church Elder",
    photo: require("../assets/images/sis-alice.png"),
  },
];

const LEADERS_OTHER: Leader[] = [
  { id: "kenneth", name: "Keneth Amaro", role: "Elder" },
  { id: "felicia", name: "Sister Felicia Niamke", role: "Church Elder" },
  { id: "john", name: "Brother John Kwofie", role: "Youth President" },
  { id: "seth", name: "Brother Seth Andrews Ackah", role: "Youth Vice President" },
];

const DEPARTMENTS: Department[] = [
  {
    name: "Harvest Committee",
    members: ["Apostle Kwabena Boateng", "Sister Alice Osei", "Keneth Amaro"],
  },
  {
    name: "Ushers",
    members: ["Sister Alice Osei", "Sister Felicia Niamke"],
  },
];

function initials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function LeaderNode({
  person,
  size = "md",
}: {
  person: Leader;
  size?: "lg" | "md";
}) {
  const isLg = size === "lg";

  return (
    <View style={[styles.nodeWrap, isLg && styles.nodeWrapLg]}>
      <View style={[styles.avatarCircle, isLg && styles.avatarCircleLg]}>
        {person.photo ? (
          <Image source={person.photo} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <Text style={[styles.avatarInitials, isLg && styles.avatarInitialsLg]}>
            {initials(person.name)}
          </Text>
        )}
      </View>

      <Text style={[styles.personName, isLg && styles.personNameLg]} numberOfLines={2}>
        {person.name}
      </Text>
      <Text style={[styles.personRole, isLg && styles.personRoleLg]} numberOfLines={2}>
        {person.role}
      </Text>
    </View>
  );
}

/** A tier = row of nodes + connectors above it (optional) */
function Tier({
  people,
  showTopConnector = true,
  maxPerRow = 3,
}: {
  people: Leader[];
  showTopConnector?: boolean;
  maxPerRow?: number;
}) {
  const { width } = useWindowDimensions();
  // responsive: try to fit cards nicely on phones
  const cardWidth = Math.min(170, Math.max(140, (width - 90) / Math.min(maxPerRow, people.length)));

  return (
    <View style={styles.tierWrap}>
      {showTopConnector ? (
        <View style={styles.connectorBlock}>
          <View style={styles.vLine} />
          <View style={styles.hLine} />
        </View>
      ) : null}

      <View style={styles.tierRow}>
        {people.map((p) => (
          <View key={p.id} style={{ width: cardWidth }}>
            <View style={styles.tierCard}>
              <LeaderNode person={p} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AboutMinistrySection() {
  const bishop = LEADERS_PRIMARY.find((l) => l.id === "bishop")!;
  const assistant = LEADERS_PRIMARY.find((l) => l.id === "revSabina")!;
  const ministers = LEADERS_PRIMARY.filter((l) =>
    ["apostleKwabena", "revDaniel", "revMarcia"].includes(l.id)
  );
  const adminAndElder = LEADERS_PRIMARY.filter((l) => ["dorothy", "alice"].includes(l.id));

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>About the Ministry</Text>
        <Text style={styles.subtitle}>
          Leadership hierarchy and departments of End Time Prayer Global Ministry (E.P.G.M - B.P.A.M).
        </Text>
      </View>

      {/* HIERARCHY TREE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leadership Hierarchy</Text>

        {/* TOP NODE */}
        <View style={styles.topWrap}>
          <View style={styles.topNodeCard}>
            <LeaderNode person={bishop} size="lg" />
          </View>
        </View>

        {/* CONNECTOR DOWN */}
        <View style={styles.downConnector}>
          <View style={styles.vLineTall} />
        </View>

        {/* ASSISTANT NODE */}
        <View style={styles.topWrap}>
          <View style={styles.topNodeCard}>
            <LeaderNode person={assistant} />
          </View>
        </View>

        {/* MINISTERS/APOSTLE TIER */}
        <Tier people={ministers} />

        {/* ADMIN / ELDER TIER */}
        <Tier people={adminAndElder} maxPerRow={2} />
      </View>

      {/* OTHER LEADERS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Other Leaders</Text>
        <View style={styles.simpleGrid}>
          {LEADERS_OTHER.map((p) => (
            <View key={p.id} style={styles.simpleCard}>
              <LeaderNode person={p} />
            </View>
          ))}
        </View>
      </View>

      {/* DEPARTMENTS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Departments</Text>

        {DEPARTMENTS.map((dept) => (
          <View key={dept.name} style={styles.deptBlock}>
            <Text style={styles.deptName}>• {dept.name}</Text>
            {dept.members.map((m) => (
              <Text key={m} style={styles.deptMember}>
                — {m}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 22,
    gap: 14,
  },

  headerBlock: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fefce8",
    textAlign: "center",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    textAlign: "center",
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
    marginBottom: 12,
  },

  // TREE
  topWrap: {
    alignItems: "center",
  },
  topNodeCard: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    alignItems: "center",
    width: 230,
  },

  downConnector: {
    alignItems: "center",
    paddingVertical: 10,
  },
  vLineTall: {
    width: 2,
    height: 18,
    backgroundColor: "rgba(250,204,21,0.55)",
    borderRadius: 2,
  },

  tierWrap: {
    marginTop: 10,
  },
  connectorBlock: {
    alignItems: "center",
    marginBottom: 10,
  },
  vLine: {
    width: 2,
    height: 14,
    backgroundColor: "rgba(250,204,21,0.55)",
    borderRadius: 2,
  },
  hLine: {
    height: 2,
    width: "78%",
    backgroundColor: "rgba(250,204,21,0.35)",
    borderRadius: 2,
    marginTop: 6,
  },
  tierRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
    flexWrap: "wrap",
  },
  tierCard: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    alignItems: "center",
  },

  // NODE
  nodeWrap: {
    alignItems: "center",
  },
  nodeWrapLg: {
    paddingTop: 2,
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.55)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  avatarCircleLg: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fbbf24",
  },
  avatarInitialsLg: {
    fontSize: 20,
  },
  personName: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#fefce8",
    textAlign: "center",
  },
  personNameLg: {
    fontSize: 13.5,
  },
  personRole: {
    fontSize: 11.5,
    color: "#e5e7eb",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  personRoleLg: {
    fontSize: 12,
  },

  // OTHER LEADERS GRID
  simpleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  simpleCard: {
    width: 165,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    alignItems: "center",
  },

  // DEPARTMENTS
  deptBlock: {
    marginBottom: 12,
  },
  deptName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fde68a",
    marginBottom: 6,
  },
  deptMember: {
    fontSize: 12.5,
    color: "#e5e7eb",
    lineHeight: 18,
    marginLeft: 10,
  },
});