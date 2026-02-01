import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const GOOGLE_BIBLE_PAYMENTS_URL =
  "https://script.google.com/macros/s/AKfycbwqTKVlhZYggLnKJC75g-FWtHgqL8kxKidjipIfEZdotMTF-2ZDRmkWuphXpPNe3NvEOw/exec";

// ✅ Payment constants
const PAYMENT_AMOUNT_EUR = 10;
const PAYMENT_AMOUNT_GHS = 150;

const PAYPAL_EMAIL = "benjaminadu2005@gmail.com";
// Put your PayPal.me when you create it (recommended)
const PAYPAL_ME_LINK = "https://paypal.me/YOURPAYPALME"; // replace

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

  const [proofUri, setProofUri] = useState<string | null>(null);
  const [proofBase64, setProofBase64] = useState<string | null>(null);
  const [proofMime, setProofMime] = useState<string>("image/jpeg");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const momoInstructions = useMemo(
    () => [
      "• Dial *170#",
      "• Choose Transfer Money",
      "• Mobile Money User",
      `• Enter number: ${MOMO_NUMBER}`,
      `• Name: ${MOMO_ACCOUNT_NAME}`,
      `• Amount: ${PAYMENT_AMOUNT_GHS} GHS (equivalent of €${PAYMENT_AMOUNT_EUR})`,
      `• Reference: Bible School - (your name)`,
      "• Confirm and complete payment",
      "• Take a screenshot of the confirmation message",
      "• Upload it below and submit your form",
    ],
    []
  );

  const openPayPal = async () => {
    try {
      // If you haven't added PayPal.me yet, still show info
      if (!PAYPAL_ME_LINK || PAYPAL_ME_LINK.includes("YOURPAYPALME")) {
        Alert.alert(
          "PayPal Setup Needed",
          `Please create your PayPal.me link.\nFor now you can pay via PayPal email:\n${PAYPAL_EMAIL}`
        );
        return;
      }

      await WebBrowser.openBrowserAsync(PAYPAL_ME_LINK, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch {}
  };

  const pickProof = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission needed",
          "Please allow access to photos to upload proof."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // ✅ compress + resize (prevents Google Script upload failures)
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1280 } }],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      setProofUri(manipulated.uri);
      setProofBase64(manipulated.base64 || null);
      setProofMime("image/jpeg");
    } catch {
      Alert.alert("Error", "Could not pick image. Please try again.");
    }
  };

  const validate = () => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanMotivation = motivation.trim();

    if (!cleanName) return "Please enter your full name.";
    if (!cleanPhone) return "Please enter your phone or WhatsApp number.";
    if (!cleanMotivation)
      return "Please tell us briefly why you want to join the Bible School.";
    if (!proofBase64) return "Please upload a payment proof screenshot.";
    return "";
  };

  const postToGoogle = async (payload: any) => {
    // ✅ WEB: prevent CORS blocking
    if (Platform.OS === "web") {
      await fetch(GOOGLE_BIBLE_PAYMENTS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: true };
    }

    // ✅ NATIVE: normal fetch
    const res = await fetch(GOOGLE_BIBLE_PAYMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  const handleSubmit = async () => {
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

      amountEuro: PAYMENT_AMOUNT_EUR,
      amountGhs: PAYMENT_AMOUNT_GHS,
      paymentMethod,

      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || "",
      location: location.trim() || "",
      classType,
      language,
      motivation: motivation.trim(),

      momoNetwork: MOMO_NETWORK,
      momoNumber: MOMO_NUMBER,
      momoAccountName: MOMO_ACCOUNT_NAME,
      momoReferenceSuggested: `Bible School - ${fullName.trim()}`,

      paypalEmail: PAYPAL_EMAIL,
      paypalMeLink: PAYPAL_ME_LINK,

      proofMime,
      proofBase64,
      proofFileName: `payment-proof-${Date.now()}.jpg`,
    };

    try {
      await postToGoogle(payload);

      Alert.alert(
        "Submitted",
        "Your enrollment and payment proof have been submitted successfully."
      );

      setFullName("");
      setPhone("");
      setEmail("");
      setLocation("");
      setMotivation("");
      setPaymentMethod("Mobile Money");
      setClassType("Online");
      setLanguage("English");
      setProofUri(null);
      setProofBase64(null);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not submit. Try again.");
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
        Enrollment fee: <Text style={styles.money}>€{PAYMENT_AMOUNT_EUR}</Text> (≈{" "}
        <Text style={styles.money}>{PAYMENT_AMOUNT_GHS} GHS</Text>). Choose a payment
        method, pay, then upload proof and submit.
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
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.labelSmall, { marginTop: 8 }]}>
          Preferred Language
        </Text>
        <View style={styles.chipRow}>
          {LANGUAGES.map((lang) => {
            const selected = language === lang;
            return (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {lang}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Payment</Text>

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
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          {paymentMethod === "Mobile Money" ? (
            <>
              <Text style={styles.cardTitle}>MTN Mobile Money</Text>
              <Text style={styles.cardLine}>Number: {MOMO_NUMBER}</Text>
              <Text style={styles.cardLine}>Name: {MOMO_ACCOUNT_NAME}</Text>
              <Text style={styles.cardLine}>
                Amount: {PAYMENT_AMOUNT_GHS} GHS (≈ €{PAYMENT_AMOUNT_EUR})
              </Text>
              <Text style={styles.cardLine}>
                Reference: Bible School - (your name)
              </Text>

              <View style={styles.instructions}>
                {momoInstructions.map((x) => (
                  <Text key={x} style={styles.instructionText}>
                    {x}
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>PayPal Payment</Text>
              <Text style={styles.cardLine}>
                Amount: €{PAYMENT_AMOUNT_EUR}
              </Text>
              <Text style={styles.cardLine}>
                PayPal email: {PAYPAL_EMAIL}
              </Text>
              <Text style={styles.cardLine}>
                Tap below to open PayPal. After payment, return and upload proof.
              </Text>

              <Pressable style={styles.payBtn} onPress={openPayPal}>
                <Text style={styles.payBtnText}>Open PayPal</Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.proofBtn} onPress={pickProof}>
            <Text style={styles.proofBtnText}>
              {proofUri ? "Change Payment Screenshot" : "Upload Payment Screenshot"}
            </Text>
          </Pressable>

          {proofUri ? (
            <Image source={{ uri: proofUri }} style={styles.preview} />
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Motivation</Text>
        <Text style={styles.labelSmall}>
          Why do you want to join the Bible School?
        </Text>
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
        By submitting you confirm you are willing to be trained under the doctrines and
        leadership of End Time Prayer Global Ministry – Bishop Peter Ababio Ministries.
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
  chipText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  chipTextSelected: {
    color: "#fbbf24",
    fontWeight: "600",
  },
  card: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
    gap: 8,
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fde68a",
  },
  cardLine: {
    fontSize: 12,
    color: "#e5e7eb",
    lineHeight: 18,
  },
  instructions: {
    gap: 3,
    marginTop: 4,
  },
  instructionText: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
  },
  payBtn: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f97316",
  },
  payBtnText: {
    color: "#0b1120",
    fontSize: 14,
    fontWeight: "800",
  },
  proofBtn: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  proofBtnText: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "800",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginTop: 6,
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