import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";

type MonthData = {
  year: number;
  month: number;
  theme: string;
  verses: Record<string, string>;
};

// ===== 2025 =====
const y2025_jan = require("../data/2025/january.json") as MonthData;
const y2025_feb = require("../data/2025/february.json") as MonthData;
const y2025_mar = require("../data/2025/march.json") as MonthData;
const y2025_apr = require("../data/2025/april.json") as MonthData;
const y2025_may = require("../data/2025/may.json") as MonthData;
const y2025_jun = require("../data/2025/june.json") as MonthData;
const y2025_jul = require("../data/2025/july.json") as MonthData;
const y2025_aug = require("../data/2025/august.json") as MonthData;
const y2025_sep = require("../data/2025/september.json") as MonthData;
const y2025_oct = require("../data/2025/october.json") as MonthData;
const y2025_nov = require("../data/2025/november.json") as MonthData;
const y2025_dec = require("../data/2025/december.json") as MonthData;

// ===== 2026 =====
const y2026_jan = require("../data/2026/january.json") as MonthData;
const y2026_feb = require("../data/2026/february.json") as MonthData;
const y2026_mar = require("../data/2026/march.json") as MonthData;
const y2026_apr = require("../data/2026/april.json") as MonthData;
const y2026_may = require("../data/2026/may.json") as MonthData;
const y2026_jun = require("../data/2026/june.json") as MonthData;
const y2026_jul = require("../data/2026/july.json") as MonthData;
const y2026_aug = require("../data/2026/august.json") as MonthData;
const y2026_sep = require("../data/2026/september.json") as MonthData;
const y2026_oct = require("../data/2026/october.json") as MonthData;
const y2026_nov = require("../data/2026/november.json") as MonthData;
const y2026_dec = require("../data/2026/december.json") as MonthData;

const monthFiles: MonthData[] = [
  y2025_jan,
  y2025_feb,
  y2025_mar,
  y2025_apr,
  y2025_may,
  y2025_jun,
  y2025_jul,
  y2025_aug,
  y2025_sep,
  y2025_oct,
  y2025_nov,
  y2025_dec,

  y2026_jan,
  y2026_feb,
  y2026_mar,
  y2026_apr,
  y2026_may,
  y2026_jun,
  y2026_jul,
  y2026_aug,
  y2026_sep,
  y2026_oct,
  y2026_nov,
  y2026_dec,
];

const preachingCalendar: Record<string, MonthData> = {};

monthFiles.forEach((m) => {
  const verseKeys = Object.keys(m.verses);
  if (verseKeys.length === 0) return;

  const firstDate = verseKeys[0];
  const parts = firstDate.split("-");
  if (parts.length < 2) return;

  const yearStr = parts[0];
  const monthStr = parts[1];
  const key = `${yearStr}-${monthStr}`;
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

const weekdayShort = ["S", "M", "T", "W", "T", "F", "S"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

type CalendarCell = {
  label: string;
  dateKey: string | null;
  hasEntry: boolean;
  isToday: boolean;
};

function findBestAvailableMonthKey(targetYear: number, targetMonthIndex: number) {
  const desired = `${targetYear}-${pad(targetMonthIndex + 1)}`;
  if (preachingCalendar[desired]) return desired;

  // fallback: try nearest month backward then forward
  for (let step = 1; step <= 24; step++) {
    const backDate = new Date(targetYear, targetMonthIndex - step, 1);
    const backKey = `${backDate.getFullYear()}-${pad(backDate.getMonth() + 1)}`;
    if (preachingCalendar[backKey]) return backKey;

    const forwardDate = new Date(targetYear, targetMonthIndex + step, 1);
    const forwardKey = `${forwardDate.getFullYear()}-${pad(forwardDate.getMonth() + 1)}`;
    if (preachingCalendar[forwardKey]) return forwardKey;
  }

  // final fallback
  return "2025-01";
}

export default function PreachingGuideSection() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  // Start with today month/year (we’ll adjust with best available monthKey)
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // ✅ On first load: jump to today’s month/year (or nearest month that exists in data)
  useEffect(() => {
    const bestKey = findBestAvailableMonthKey(today.getFullYear(), today.getMonth());
    const [y, m] = bestKey.split("-");
    const yNum = Number(y);
    const mNum = Number(m) - 1;

    setYear(yNum);
    setMonth(mNum);

    // Auto-select today ONLY if it has an entry in that month
    const md = preachingCalendar[bestKey];
    const hasTodayEntry = !!md?.verses?.[todayKey];
    setSelectedDateKey(hasTodayEntry ? todayKey : null);
  }, []);

  const monthKey = `${year}-${pad(month + 1)}`;
  const monthData = preachingCalendar[monthKey];

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  const firstDayOfWeek = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const calendarCells: CalendarCell[] = useMemo(() => {
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const cells: CalendarCell[] = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDayOfWeek + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push({
          label: "",
          dateKey: null,
          hasEntry: false,
          isToday: false,
        });
      } else {
        const dateKey = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
        const hasEntry = !!monthData?.verses?.[dateKey];
        const isToday = dateKey === todayKey;

        cells.push({
          label: `${dayNum}`,
          dateKey,
          hasEntry,
          isToday,
        });
      }
    }

    return cells;
  }, [daysInMonth, firstDayOfWeek, month, monthData, todayKey, year]);

  const selectedText =
    selectedDateKey && monthData?.verses?.[selectedDateKey]
      ? monthData.verses[selectedDateKey]
      : null;

  const selectedDateLabel =
    selectedDateKey && selectedText
      ? new Date(selectedDateKey).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }

    setMonth(newMonth);
    setYear(newYear);
    setSelectedDateKey(null);
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
    setSelectedDateKey(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preaching Guide</Text>
      <Text style={styles.subtitle}>
        Monthly prayer topics and scripture readings for the ministry.
      </Text>

      <View style={styles.monthHeader}>
        <Pressable onPress={handlePrevMonth} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>‹</Text>
        </Pressable>

        <View style={styles.monthTitleBlock}>
          <Text style={styles.monthTitle}>
            {monthNames[month]} {year}
          </Text>
          <Text style={styles.themeText}>
            {monthData ? monthData.theme : "No preaching guide has been added for this month yet."}
          </Text>
        </View>

        <Pressable onPress={handleNextMonth} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.calendarCard}>
        {/* ✅ FAINT LOGO WATERMARK (won’t block taps) */}
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.watermark}
          resizeMode="contain"
          pointerEvents="none"
        />

        <View style={styles.weekdaysRow}>
        {weekdayShort.map((d, index) => (
  <Text key={`${d}-${index}`} style={styles.weekdayLabel}>
    {d}
  </Text>
))}
        </View>

        <View style={styles.daysGrid}>
          {calendarCells.map((cell, index) => {
            const isSelected =
              cell.dateKey &&
              selectedDateKey &&
              cell.dateKey === selectedDateKey &&
              !!selectedText;

            const showDot = cell.hasEntry;

            return (
              <Pressable
                key={index}
                style={[
                  styles.dayCell,
                  cell.isToday && styles.dayToday,
                  isSelected && styles.daySelected,
                ]}
                disabled={!cell.dateKey}
                onPress={() => {
                  if (cell.dateKey && cell.hasEntry) setSelectedDateKey(cell.dateKey);
                }}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    cell.hasEntry && styles.dayLabelWithEntry,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  {cell.label}
                </Text>

                {showDot && !isSelected && <View style={styles.dayDot} />}
                {showDot && isSelected && <View style={styles.dayBar} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.detailsWrapper}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedText && selectedDateLabel ? (
          <>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightDate}>{selectedDateLabel}</Text>
              <Text style={styles.highlightText}>{selectedText}</Text>
            </View>

            <View style={styles.readingCard}>
              <Text style={styles.readingTitle}>Daily Reading</Text>
              <Text style={styles.readingText}>{selectedText}</Text>
              <Text style={styles.readingHint}>
                Use this scripture as your meditation and prayer focus for the day.
              </Text>
            </View>
          </>
        ) : monthData ? (
          <Text style={styles.detailsEmpty}>
            Tap any marked date in the calendar to view the scripture or prayer focus for that day.
          </Text>
        ) : (
          <Text style={styles.detailsEmpty}>
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
  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.18)",
  },
  monthArrowText: {
    color: "#fefce8",
    fontSize: 18,
  },
  monthTitleBlock: {
    flex: 1,
    marginHorizontal: 10,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fefce8",
  },
  themeText: {
    marginTop: 2,
    fontSize: 12,
    color: "#fde68a",
  },

  calendarCard: {
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.96)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    position: "relative",
    overflow: "hidden",
  },

  // ✅ NEW: Watermark style
  watermark: {
    position: "absolute",
    width: 260,
    height: 260,
    opacity: 0.05,
    alignSelf: "center",
    top: 18,
  },

  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    paddingHorizontal: 6,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    letterSpacing: 0.5,
    color: "#cbd5f5",
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayToday: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.4)",
  },
  daySelected: {
    borderRadius: 16,
    backgroundColor: "#f97316",
  },
  dayLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 3,
  },
  dayLabelWithEntry: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  dayLabelSelected: {
    color: "#0b1120",
    fontWeight: "800",
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#facc15",
  },
  dayBar: {
    marginTop: 2,
    width: 20,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#0b1120",
  },

  detailsWrapper: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.96)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
  },
  detailsContent: {
    padding: 12,
    gap: 10,
  },
  highlightCard: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(250,204,21,0.14)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.9)",
    shadowColor: "#facc15",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  highlightDate: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fefce8",
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: "#0b1120",
    fontWeight: "600",
  },
  readingCard: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(15,23,42,0.98)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  readingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  readingText: {
    fontSize: 14,
    color: "#e5e7eb",
    lineHeight: 22,
    marginBottom: 6,
  },
  readingHint: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
  },
  detailsEmpty: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 20,
  },
});