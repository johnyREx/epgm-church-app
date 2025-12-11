import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";

const EMAILJS_SERVICE_ID = "service_hwiplta";
const EMAILJS_TEMPLATE_ID = "template_mo6j37g";
const EMAILJS_PUBLIC_KEY = "_ShX81Rdy7w-NDBoz";
const BISHOP_EMAIL = "TRIPLEKMEDIA.COM@GMAIL.COM";

const CLASS_TYPES = ["Online", "In-person", "Hybrid"] as const;
const LANGUAGES = ["English", "Twi", "English + Twi"] as const;
const PAYMENT_METHODS = ["PayPal", "Card (Visa/Mastercard)", "Mobile Money"] as const;

export default function BibleStudySection() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [classType, setClassType] = useState<(typeof CLASS_TYPES)[number]>("Online");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("English");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]>("Mobile Money");
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanLocation = location.trim();
    const cleanMotivation = motivation.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }
    if (!cleanPhone) {
      setError("Please enter your phone or WhatsApp number.");
      return;
    }
    if (!cleanMotivation) {
      setError("Please tell us briefly why you want to join the Bible School.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setError("");
    setSubmitting(true);

    const subject = `Bible School Enrollment - ${cleanName}`;
    const bodyLines = [
      "EPGM Bible School Enrollment Request",
      "",
      `Name: ${cleanName}`,
      `Phone/WhatsApp: ${cleanPhone}`,
      cleanEmail ? `Email: ${cleanEmail}` : "Email: (not provided)",
      cleanLocation ? `City/Country: ${cleanLocation}` : "City/Country: (not provided)",
      `Preferred Class Type: ${classType}`,
      `Preferred Language: ${language}`,
      `Payment Method: ${paymentMethod}`,
      "",
      "Motivation:",
      cleanMotivation,
      "",
      "Sent via EPGM Church App – Bible School section.",
    ];
    const body = bodyLines.join("\n");

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: BISHOP_EMAIL,
            subject,
            body,
            name: cleanName,
            email: cleanEmail || "(not provided)",
            topic: "Bible School Enrollment",
            message: cleanMotivation,
          },
        }),
      });

      const raw = await response.text();
      if (!response.ok) {
        throw new Error(raw || "EmailJS request failed");
      }

      Alert.alert(
        "Enrollment Sent",
        "Your Bible School enrollment details have been sent. The ministry will contact you with payment instructions."
      );

      setFullName("");
      setPhone("");
      setEmail("");
      setLocation("");
      setMotivation("");
      setClassType("Online");
      setLanguage("English");
      setPaymentMethod("Mobile Money");
    } catch (e) {
      Alert.alert(
        "Error",
        "There was a problem sending your enrollment. Please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>EPGM Bible School</Text>
      <Text style={styles.subtitle}>
        Enroll to be trained in the Word, doctrine and ministry work under EPGM–BPAM.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Personal Details</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone / WhatsApp</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Include country code if outside Italy/Ghana"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email (optional)</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>City / Country (optional)</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Modena, Italy or Accra, Ghana"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Class Preference</Text>

        <Text style={styles.labelSmall}>Class Type</Text>
        <View style={styles.chipRow}>
          {CLASS_TYPES.map((type) => {
            const selected = classType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setClassType(type)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.labelSmall, { marginTop: 8 }]}>Preferred Language</Text>
        <View style={styles.chipRow}>
          {LANGUAGES.map((lang) => {
            const selected = language === lang;
            return (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {lang}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Payment Intention</Text>

        <Text style={styles.labelSmall}>Preferred Payment Method</Text>
        <View style={styles.chipColumn}>
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method;
            return (
              <Pressable
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={[styles.chipWide, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {method}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.paymentNote}>
          At this stage, payments are handled directly by the ministry. After you submit,
          the Bible School team will contact you with the exact fee and payment details
          for PayPal, card or mobile money.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Motivation</Text>
        <Text style={styles.labelSmall}>Why do you want to join the Bible School?</Text>
        <TextInput
          value={motivation}
          onChangeText={setMotivation}
          placeholder="Share briefly your desire to study the Word and serve in ministry..."
          placeholderTextColor="#9ca3af"
          style={[styles.input, styles.textArea]}
          multiline
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        disabled={submitting}
        onPress={handleSubmit}
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitText}>
          {submitting ? "Submitting..." : "Submit Enrollment"}
        </Text>
      </Pressable>

      <Text style={styles.footerNote}>
        By submitting this form you confirm that you are willing to be trained under the
        doctrines and leadership of End Time Prayer Global Ministry – Bishop Peter Ababio
        Ministries.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
  },
  content: {
    padding: 14,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fefce8",
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
  },
  section: {
    marginTop: 8,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fefce8",
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  labelSmall: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: "#f9fafb",
    backgroundColor: "rgba(15,23,42,0.95)",
    fontSize: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chipColumn: {
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  chipWide: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  chipSelected: {
    borderColor: "#f97316",
    backgroundColor: "rgba(249,115,22,0.15)",
  },
  chipText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  chipTextSelected: {
    color: "#fbbf24",
    fontWeight: "600",
  },
  paymentNote: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#fecaca",
    marginTop: 4,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#f97316",
    borderRadius: 16,
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
  footerNote: {
    fontSize: 11,
    color: "#9ca3af",
    lineHeight: 18,
    marginTop: 6,
  },
});