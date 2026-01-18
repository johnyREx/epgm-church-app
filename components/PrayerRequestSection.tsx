import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Linking,
} from "react-native";

const PRAYER_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwqTKVlhZYggLnKJC75g-FWtHgqL8kxKidjipIfEZdotMTF-2ZDRmkWuphXpPNe3NvEOw/exec";

const WHATSAPP_NUMBER_1 = "393895403600";
const WHATSAPP_NUMBER_2 = "233248490953";

type Props = {
  defaultName?: string;
};

export default function PrayerRequestSection({ defaultName }: Props) {
  const [name, setName] = useState(defaultName || "");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a prayer topic.");
      return;
    }
    if (!message.trim()) {
      setError("Please write your prayer request.");
      return;
    }

    setError("");
    setSubmitting(true);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanTopic = topic.trim();
    const cleanMessage = message.trim();

    const bodyLines = [
      `Name: ${cleanName}`,
      cleanEmail ? `Email: ${cleanEmail}` : "Email: (not provided)",
      "",
      "Prayer Topic:",
      cleanTopic,
      "",
      "Prayer Request:",
      cleanMessage,
      "",
      "Sent via EPGM Church App",
    ];
    const body = bodyLines.join("\n");

    try {
      const res = await fetch(PRAYER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          topic: cleanTopic,
          message: cleanMessage,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      const encodedWhatsAppText = encodeURIComponent(body);
      const waUrl1 = `https://wa.me/${WHATSAPP_NUMBER_1}?text=${encodedWhatsAppText}`;
      const waUrl2 = `https://wa.me/${WHATSAPP_NUMBER_2}?text=${encodedWhatsAppText}`;

      Linking.openURL(waUrl1).catch(() => {});

      setTimeout(() => {
        Linking.openURL(waUrl2).catch(() => {});
      }, 800);

      Alert.alert("Prayer Request Sent", "Your request was successfully sent.");

      setEmail("");
      setTopic("");
      setMessage("");
    } catch (e) {
      Alert.alert(
        "Error",
        "There was a problem sending your prayer request. Please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prayer Request</Text>
      <Text style={styles.subtitle}>
        Share your prayer burden. The Bishop and the prayer team will stand in
        agreement with you.
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Prayer Topic</Text>
        <TextInput
          value={topic}
          onChangeText={setTopic}
          placeholder="E.g. Healing, Family, Direction"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Prayer Request</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write your request here..."
          placeholderTextColor="#9ca3af"
          style={[styles.input, styles.textArea]}
          multiline
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitText}>
          {submitting ? "Sending..." : "Send Prayer Request"}
        </Text>
      </Pressable>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Your request will be emailed to the ministry and opened for WhatsApp
          prayer lines.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fefce8",
    textAlign: "left",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
    marginBottom: 8,
  },
  fieldGroup: {
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: "#e5e7eb",
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f9fafb",
    backgroundColor: "rgba(15,23,42,0.8)",
    fontSize: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    color: "#fecaca",
    marginTop: 4,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#f97316",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#0b1120",
    fontSize: 15,
    fontWeight: "700",
  },
  infoBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.4)",
    padding: 10,
    backgroundColor: "rgba(250,204,21,0.06)",
  },
  infoText: {
    fontSize: 12,
    color: "#e5e7eb",
    lineHeight: 18,
  },
});