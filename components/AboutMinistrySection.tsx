import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

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
  { id: "felicia", name: "Sister Felicia Niamke", role: "Member" },
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

function LeaderCard({ person }: { person: Leader }) {
  return (
    <View style={styles.personCard}>
      <View style={styles.avatarCircle}>
        {person.photo ? (
          <Image source={person.photo} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <Text style={styles.avatarInitials}>{initials(person.name)}</Text>
        )}
      </View>

      <Text style={styles.personName} numberOfLines={2}>
        {person.name}
      </Text>
      <Text style={styles.personRole} numberOfLines={2}>
        {person.role}
      </Text>
    </View>
  );
}

export default function AboutMinistrySection() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>About the Ministry</Text>
        <Text style={styles.subtitle}>
          Leadership structure and departments of End Time Prayer Global Ministry (E.P.G.M - B.P.A.M).
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leadership Hierarchy</Text>

        <View style={styles.grid}>
          {LEADERS_PRIMARY.map((p) => (
            <LeaderCard key={p.id} person={p} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Other Leaders</Text>

        <View style={styles.grid}>
          {LEADERS_OTHER.map((p) => (
            <LeaderCard key={p.id} person={p} />
          ))}
        </View>
      </View>

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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  personCard: {
    width: 150,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    alignItems: "center",
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
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fbbf24",
  },
  personName: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#fefce8",
    textAlign: "center",
  },
  personRole: {
    fontSize: 11.5,
    color: "#e5e7eb",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
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