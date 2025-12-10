import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "epgm_profile";

const avatars = ["🔥", "🕊️", "📖", "🙏🏾", "🌟", "🕯️"];

type Profile = {
  name: string;
  about: string;
  avatar: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_KEY);
        if (stored) {
          router.replace("/home");
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!avatar) {
      setError("Please select an avatar.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }
    setError("");
    setSubmitting(true);
    const profile: Profile = {
      name: name.trim(),
      about: about.trim(),
      avatar,
    };
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      router.replace("/home");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeveloper = () => {
    Linking.openURL("https://github.com/johnyREx");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/theme.jpg")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              END TIME PRAYER GLOBAL MINISTRIES
            </Text>
            <Text style={styles.subtitle}>
              BISHOP PETER ABABIO MINISTRIES
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create Your EPGM Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#d1d5db"
              style={styles.input}
            />

            <Text style={styles.label}>About / Status</Text>
            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder="E.g. A burning vessel for Christ"
              placeholderTextColor="#d1d5db"
              style={[styles.input, styles.aboutInput]}
              multiline
            />

            <Text style={styles.label}>Choose an avatar</Text>
            <View style={styles.avatarRow}>
              {avatars.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setAvatar(item)}
                  style={[
                    styles.avatarChip,
                    avatar === item && styles.avatarChipActive,
                  ]}
                >
                  <Text style={styles.avatarText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.termsRow}
              onPress={() => setAcceptedTerms((v) => !v)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.termsText}>
                I accept the Terms and Conditions
              </Text>
            </Pressable>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
            >
              <Text style={styles.submitText}>
                {submitting ? "Entering..." : "Enter App"}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.footer} onPress={handleOpenDeveloper}>
            <Text style={styles.footerText}>
              Built with <Text style={styles.heart}>❤️</Text> by{" "}
              <Text style={styles.footerLink}>Johny Rex</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  headerBlock: {
    alignItems: "center",
    marginTop: 16,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fef9c3",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#e5e7eb",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fef9c3",
    marginBottom: 8,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    color: "#e5e7eb",
    marginTop: 6,
  },
  input: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f9fafb",
    backgroundColor: "rgba(15,23,42,0.7)",
    fontSize: 14,
  },
  aboutInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  avatarRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  avatarChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.3)",
    backgroundColor: "rgba(15,23,42,0.8)",
  },
  avatarChipActive: {
    backgroundColor: "#f97316",
    borderColor: "#fed7aa",
  },
  avatarText: {
    fontSize: 18,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#f97316",
    borderColor: "#fed7aa",
  },
  termsText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#fecaca",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#f97316",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#0b1120",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  heart: {
    color: "#f97316",
  },
  footerLink: {
    color: "#fbbf24",
    textDecorationLine: "underline",
  },
});