import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

type MonthData = {
  year: number;
  month: number;
  theme: string;
  verses: Record<string, string>;
};

const january = require("../data/january.json") as MonthData;
const february = require("../data/february.json") as MonthData;
const march = require("../data/march.json") as MonthData;
const april = require("../data/april.json") as MonthData;
const may = require("../data/may.json") as MonthData;
const june = require("../data/june.json") as MonthData;
const july = require("../data/july.json") as MonthData;
const august = require("../data/august.json") as MonthData;
const september = require("../data/september.json") as MonthData;
const october = require("../data/october.json") as MonthData;
const november = require("../data/november.json") as MonthData;
const december = require("../data/december.json") as MonthData;

const monthFiles: MonthData[] = [
  january,
  february,
  march,
  april,
  may,
  june,
  july,
  august,
  september,
  october,
  november,
  december,
];

const preachingCalendar: Record<string, MonthData> = {};
monthFiles.forEach((m) => {
  const mm = m.month < 10 ? `0${m.month}` : `${m.month}`;
  const key = `${m.year}-${mm}`;
  preachingCalendar[key] = m;
});

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function PreachingGuideSection() {
  const initialYear = 2025;
  const initialMonth = 0;

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const monthKey = `${year}-${pad(month + 1)}`;
  const monthData = preachingCalendar[monthKey];

  const entries = useMemo(() => {
    if (!monthData) return [];
    const keys = Object.keys(monthData.verses).sort();
    return keys.map((key) => {
      const date = new Date(key);
      const label = date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return {
        key,
        label,
        text: monthData.verses[key],
      };
    });
  }, [monthData]);

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preaching Guide</Text>
      <Text style={styles.subtitle}>
        Monthly prayer topics and scripture readings for the ministry.
      </Text>

      <View style={styles.monthHeader}>
        <Pressable onPress={handlePrevMonth} style={styles.arrow}>
          <Text style={styles.arrowText}>◀</Text>
        </Pressable>
        <View style={styles.monthInfo}>
          <Text style={styles.monthTitle}>
            {monthNames[month]} {year}
          </Text>
          <Text style={styles.themeText}>
            {monthData
              ? monthData.theme
              : "No preaching guide has been added for this month yet."}
          </Text>
        </View>
        <Pressable onPress={handleNextMonth} style={styles.arrow}>
          <Text style={styles.arrowText}>▶</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.listCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {entries.length > 0 ? (
          entries.map((entry) => (
            <View key={entry.key} style={styles.entryRow}>
              <View style={styles.entryDateBadge}>
                <Text style={styles.entryDateText}>{entry.label}</Text>
              </View>
              <View style={styles.entryTextBlock}>
                <Text style={styles.entryMain}>{entry.text}</Text>
              </View>
            </View>
          ))
        ) : monthData ? (
          <Text style={styles.emptyText}>
            No specific days have been configured for this month yet.
          </Text>
        ) : (
          <Text style={styles.emptyText}>
            There is no preaching guide data for this month yet.
          </Text>
        )}
      </ScrollView>
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
    textShadowColor: "#f59e0b",
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
    marginBottom: 4,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.2)",
  },
  arrowText: {
    color: "#fefce8",
    fontSize: 16,
  },
  monthInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fefce8",
  },
  themeText: {
    marginTop: 2,
    fontSize: 12,
    color: "#fde68a",
  },
  listCard: {
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
  },
  listContent: {
    padding: 10,
  },
  entryRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  entryDateBadge: {
    minWidth: 90,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  entryDateText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fde68a",
  },
  entryTextBlock: {
    flex: 1,
    justifyContent: "center",
  },
  entryMain: {
    fontSize: 13,
    color: "#e5e7eb",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 20,
  },
});