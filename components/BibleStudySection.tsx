import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

const GOOGLE_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwqTKVlhZYggLnKJC75g-FWtHgqL8kxKidjipIfEZdotMTF-2ZDRmkWuphXpPNe3NvEOw/exec";

// ✅ Payment constants (update whenever you want)
const PAYMENT_AMOUNT_EUR = 50;
const PAYMENT_GHS_NOTE = "Equivalent in GHS depends on current FX rate";

const PAYPAL_ME_LINK = "https://paypal.me/obotanababio";

const MOMO_NETWORK = "MTN";
const MOMO_NUMBER = "0248490953";
const MOMO_ACCOUNT_NAME = "Peter Ababio";

const CLASS_TYPES = ["Online", "In-person", "Hybrid"] as const;
const LANGUAGES = ["English", "Twi", "English + Twi"] as const;
const PAYMENT_METHODS = ["Mobile Money", "PayPal"] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export default function BibleStudySection() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [classType, setClassType] =
    useState<(typeof CLASS_TYPES)[number]>("Online");
  const [language, setLanguage] =
    useState<(typeof LANGUAGES)[number]>("English");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Mobile Money");
  const [motivation, setMotivation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showMomo, setShowMomo] = useState(false);

  const momoInstructions = useMemo(
    () => [
      "Dial *170#",
      "Choose Transfer Money",
      "Mobile Money User",
      `Enter number: ${MOMO_NUMBER}`,
      `Name: ${MOMO_ACCOUNT_NAME}`,
      `Amount: (Pay the equivalent of €${PAYMENT_AMOUNT_EUR})`,
      `Reference: Bible School - (your name)`,
      "Confirm and complete payment",
      "Send proof to the ministry email or WhatsApp if requested",
    ],
    []
  );

  const validate = () => {
    const n = fullName.trim();
    const p = phone.trim();
    const m = motivation.trim();

    if (!n) return "Please enter your full name.";
    if (!p) return "Please enter your phone or WhatsApp number.";
    if (!m) return "Please tell us briefly why you want to join the Bible School.";
    return "";
  };

  // ✅ Works for Expo Go + Web (same approach as Prayer Request)
  const postToGoogle = async (payload: any) => {
    const body = JSON.stringify(payload);

    // Web: avoid CORS/preflight by using text/plain
    const headers =
      Platform.OS === "web"
        ? { "Content-Type": "text/plain;charset=utf-8" }
        : { "Content-Type": "application/json" };

    const res = await fetch(GOOGLE_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {}

    if (!res.ok) throw new Error(text || "Request failed");
    if (json && json.ok === false) throw new Error(json.error || "Submit failed");
    return json || { ok: true };
  };

  const openPayPal = async () => {
    try {
      await WebBrowser.openBrowserAsync(PAYPAL_ME_LINK, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch {}
  };

  const afterSubmitGoToPayment = async () => {
    if (paymentMethod === "Mobile Money") {
      setShowMomo(true);
      return;
    }
    await openPayPal();
  };

  const handleSubmitAndPay = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError("");
    setSubmitting(true);

    const payload = {
      type: "BIBLE_SCHOOL_ENROLLMENT",
      createdAt: new Date().toISOString(),

      // ✅ match Apps Script keys
      amountEur: String(PAYMENT_AMOUNT_EUR),
      amountGhsNote: PAYMENT_GHS_NOTE,
      paymentMethod,

      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || "",
      location: location.trim() || "",
      classType,
      language,
      motivation: motivation.trim(),
    };

    try {
      await postToGoogle(payload);

      Alert.alert(
        "Enrollment Submitted ✅",
        "Your form was submitted successfully. Now proceed to payment to secure your seat.",
        [
          {
            text: "Proceed",
            onPress: () => {
              // don’t clear form until user proceeds (optional)
              afterSubmitGoToPayment();
            },
          },
          { text: "Later", style: "cancel" },
        ]
      );

      // Optional: clear the form after successful submit
      setFullName("");
      setPhone("");
      setEmail("");
      setLocation("");
      setMotivation("");
      setPaymentMethod("Mobile Money");
      setClassType("Online");
      setLanguage("English");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>EPGM Bible School</Text>
        <Text style={styles.subtitle}>
          Enrollment fee: <Text style={styles.money}>€{PAYMENT_AMOUNT_EUR}</Text>{" "}
          (GHS equivalent varies). Submit the form first, then proceed to payment.
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
            {CLASS_TYPES.map((t) => {
              const selected = classType === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setClassType(t)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.labelSmall, { marginTop: 8 }]}>Preferred Language</Text>
          <View style={styles.chipRow}>
            {LANGUAGES.map((l) => {
              const selected = language === l;
              return (
                <Pressable
                  key={l}
                  onPress={() => setLanguage(l)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {l}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Payment Option</Text>
          <Text style={styles.labelSmall}>Choose Method</Text>

          <View style={styles.chipRow}>
            {PAYMENT_METHODS.map((m) => {
              const selected = paymentMethod === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setPaymentMethod(m)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.card}>
            {paymentMethod === "PayPal" ? (
              <>
                <Text style={styles.cardTitle}>PayPal</Text>
                <Text style={styles.cardLine}>Pay via: {PAYPAL_ME_LINK}</Text>
                <Text style={styles.cardLine}>
                  After you submit, the PayPal page will open.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>MTN Mobile Money</Text>
                <Text style={styles.cardLine}>Number: {MOMO_NUMBER}</Text>
                <Text style={styles.cardLine}>Name: {MOMO_ACCOUNT_NAME}</Text>
                <Text style={styles.cardLine}>
                  After you submit, MoMo instructions will show.
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Motivation</Text>
          <Text style={styles.labelSmall}>Why do you want to join?</Text>
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
          onPress={handleSubmitAndPay}
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitText}>
            {submitting ? "Submitting..." : "Submit & Pay"}
          </Text>
        </Pressable>

        <Text style={styles.footerNote}>
          By submitting you confirm you are willing to be trained under the doctrines and
          leadership of End Time Prayer Global Ministry – Bishop Peter Ababio Ministries.
        </Text>
      </ScrollView>

      {/* ✅ MoMo popup */}
      <Modal visible={showMomo} transparent animationType="fade" onRequestClose={() => setShowMomo(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mobile Money Payment (MTN)</Text>
            <Text style={styles.modalLine}>Number: {MOMO_NUMBER}</Text>
            <Text style={styles.modalLine}>Name: {MOMO_ACCOUNT_NAME}</Text>
            <Text style={styles.modalLine}>
              Pay the equivalent of €{PAYMENT_AMOUNT_EUR} (rate may vary)
            </Text>

            <View style={{ marginTop: 8, gap: 4 }}>
              {momoInstructions.map((x) => (
                <Text key={x} style={styles.modalInstruction}>• {x}</Text>
              ))}
            </View>

            <Pressable style={styles.modalBtn} onPress={() => setShowMomo(false)}>
              <Text style={styles.modalBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
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
  money: {
    color: "#fde68a",
    fontWeight: "800",
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
  fieldGroup: { gap: 4 },
  label: { fontSize: 12, color: "#e5e7eb" },
  labelSmall: { fontSize: 12, color: "#e5e7eb" },
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
  textArea: { minHeight: 110, textAlignVertical: "top" },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  chipSelected: {
    borderColor: "#f97316",
    backgroundColor: "rgba(249,115,22,0.15)",
  },
  chipText: { fontSize: 12, color: "#e5e7eb" },
  chipTextSelected: { color: "#fbbf24", fontWeight: "600" },

  card: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
    gap: 6,
    marginTop: 6,
  },
  cardTitle: { fontSize: 13, fontWeight: "800", color: "#fde68a" },
  cardLine: { fontSize: 12, color: "#e5e7eb", lineHeight: 18 },

  errorText: { fontSize: 12, color: "#fecaca", marginTop: 4 },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitText: { color: "#0b1120", fontSize: 15, fontWeight: "700" },
  footerNote: { fontSize: 11, color: "#9ca3af", lineHeight: 18, marginTop: 6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.98)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
  },
  modalTitle: { fontSize: 14, fontWeight: "800", color: "#fde68a" },
  modalLine: { fontSize: 12, color: "#e5e7eb", marginTop: 4 },
  modalInstruction: { fontSize: 12, color: "#9ca3af", lineHeight: 18 },
  modalBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f97316",
  },
  modalBtnText: { color: "#0b1120", fontSize: 14, fontWeight: "800" },
});