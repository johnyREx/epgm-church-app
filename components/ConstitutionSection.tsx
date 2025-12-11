import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";

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
          Ministry – Bishop Peter Ababio Ministries.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Audio Constitution</Text>
        <Text style={styles.cardSubtitle}>
          A short audio version of the constitution will be available here. Later
          the full teaching will be added with download options.
        </Text>

        <Pressable style={[styles.button, styles.buttonDisabled]}>
          <Text style={styles.buttonIcon}>▶️</Text>
          <Text style={styles.buttonText}>Play Constitution Audio (soon)</Text>
        </Pressable>

        <Pressable style={[styles.buttonOutline, styles.buttonDisabled]}>
          <Text style={styles.buttonTextOutline}>
            Download Constitution Audio (soon)
          </Text>
        </Pressable>

        <Text style={styles.note}>
          This section will later include playback controls, progress tracking
          and offline downloads, so members can meditate on the constitution
          anywhere.
        </Text>
      </View>

      <ScrollView
        style={styles.constitutionCard}
        contentContainerStyle={styles.constitutionContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>1. Doctrinal Beliefs</Text>
        <Text style={styles.sectionText}>
          We believe in Almighty God and in His Son Jesus Christ. We believe that
          God sent His Son to die for our sins, that He was crucified, and that
          He rose again on the third day. We believe that Jesus ascended to
          Heaven and is seated at the right hand of God the Father. We believe
          in the presence, power, and work of the Holy Spirit.
        </Text>
        <Text style={styles.sectionText}>
          Anyone who joins this ministry must share these beliefs and stand in
          the same faith with us. Anyone who does not believe in God, in the
          earthly ministry and suffering of Jesus Christ, and in the Holy Spirit
          cannot be part of this ministry.
        </Text>

        <Text style={styles.sectionTitle}>2. Membership</Text>
        <Text style={styles.sectionText}>
          All new members must complete a membership form to be officially
          recognized as part of EPGM–BPAM. Anyone who does not fill this form is
          not considered a member of the ministry. Members must participate
          actively in the ministry’s activities and support its vision.
        </Text>

        <Text style={styles.sectionTitle}>3. Conduct Within the Ministry</Text>
        <Text style={styles.sectionText}>
          Members must not speak evil, gossip, or create conflict against the
          elders, leaders, or the ministry as a whole. Whatever happens within
          the ministry is to be handled and resolved within the ministry.
        </Text>
        <Text style={styles.sectionText}>
          The ministry reserves the right to dismiss backbiters, troublemakers
          and people who create division, after three warnings or counsels. This
          is to protect the ministry from destruction and spiritual downfall.
        </Text>

        <Text style={styles.sectionTitle}>4. Leadership and Ministry Roles</Text>
        <Text style={styles.sectionText}>
          Anyone who desires to take up a role in the ministry, such as usher,
          protocol, chorister or prayer leader, must first go through the
          doctrines of the ministry and accept them fully. All ministry leaders
          and elders must attend every prayer meeting, except in cases of
          emergency or unavoidable situations. In such cases, they must inform
          the ministry in advance.
        </Text>
        <Text style={styles.sectionText}>
          Leaders must participate in decision-making, share their concerns and
          contribute to the growth and direction of the ministry. Anyone who
          desires to take leadership roles must go through the leadership
          teachings of the ministry.
        </Text>

        <Text style={styles.sectionTitle}>5. Preaching and External Ministers</Text>
        <Text style={styles.sectionText}>
          Any member who aspires to be a preacher must complete the ministry’s
          Bible School training. Only ordained pastors or approved preachers of
          the ministry are allowed to stand on the pulpit to preach. No one
          outside the recognized pastors or preachers is allowed to bless
          members or pray on their behalf in an official capacity.
        </Text>
        <Text style={styles.sectionText}>
          If an outside preacher wishes to worship with us, they do not
          automatically become a preacher in our ministry. They must first go
          through our teachings, accept our doctrines and be officially appointed
          before they can minister. No pastor or leader in this ministry has the
          authority to invite outside preachers to lead programs or minister. All
          programs and roles must be handled by members and preachers from within
          the ministry.
        </Text>

        <Text style={styles.sectionTitle}>6. Discipline and Restoration</Text>
        <Text style={styles.sectionText}>
          During leadership meetings, every leader has the right to contribute
          and participate so that all may learn and grow together. Any leader who
          engages in immoral, ungodly or unacceptable behavior outside the
          ministry, and is found guilty, will be stripped of their duties and
          removed from leadership functions until they repent and refrain from
          such acts.
        </Text>
      </ScrollView>
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
  constitutionCard: {
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    maxHeight: 340,
  },
  constitutionContent: {
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fefce8",
    marginTop: 4,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
  },
});