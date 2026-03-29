# 🧠 BPAM Church App — Architecture Guide

This document explains the internal architecture, design decisions, and system behavior of the BPAM Church App.

---

## 🏗️ Architectural Philosophy

The app is built using a **modular, component-driven architecture** with the following principles:

- Separation of concerns
- Reusable UI components
- Lightweight state management
- Offline-first design
- Minimal external dependencies

---

## 📂 High-Level Structure

```bash
app/            → Routing and screen structure (Expo Router)
components/     → Feature-based UI sections
data/           → Static application data
hooks/          → Reusable logic hooks
constants/      → Global theming and config
src/lib/        → Core logic (audio engine, utilities)


🔁 Navigation System

The app uses Expo Router for navigation.

Why Expo Router?
	•	File-based routing
	•	Clean screen organization
	•	Scalable for future features

Flow:
Onboarding → Home → Sections → Feature Components

🧩 Component Architecture

Each major feature is implemented as an independent component:

Feature                 Component
History               HistorySection
Constitution          ConstitutionSection
Radio                 RadioSection
Payer Request      PrayerRequestSection
Bible Study          BibleStudySection
Live Stream           LiveStreamSection


Why?
	•	Easy to maintain
	•	Easy to extend
	•	Clear separation of logic

🎧 Radio System Architecture (Core System)

Problem

Without control:
	•	Multiple streams can play at once
	•	State becomes inconsistent
	•	UI desynchronizes from audio

⸻

Solution

A global radio player system implemented in:
src/lib/RadioPlayer

Key Concepts

1. Singleton Player
Only ONE audio instance exists globally.

2. Central State
{
  active: RadioStation | null
  isPlaying: boolean
}

3. Subscription Model
UI components subscribe to state changes:
Radio.subscribe(listener)

Playback Flow
User taps station
→ stop current stream
→ load new stream
→ update global state
→ UI updates automatically

Benefits
	•	Prevents overlapping audio
	•	Syncs UI across screens
	•	Ensures consistent playback behavior

⸻

💾 State Management Strategy

The app uses a hybrid approach:

Local State

Used for:
	•	UI interactions
	•	Component-level updates

Global State (Radio Only)

Used for:
	•	Audio playback
	•	Cross-screen synchronization

⸻

👤 Profile System

Storage:
AsyncStorage

Data:
{
  name: string
  about: string
  avatar: string
}

Why AsyncStorage?
	•	No backend required
	•	Fast access
	•	Persistent across sessions

🎨 Theming System

Located in:
constants/theme.ts

Design Principles:
	•	Dark mode base
	•	Gold accent for branding
	•	Spiritual aesthetic

🌐 Data Layer

Located in:
data/

Example:
RADIO_STATIONS

Why static data?
	•	No API dependency
	•	Faster performance
	•	Easier testing

🔄 Refresh System

Implemented using:

RefreshControl


Used to:
	•	Simulate content refresh
	•	Improve user experience

⸻

📱 Responsiveness Strategy

Handled via:
useWindowDimensions()

Used for:
	•	Adaptive menu width
	•	Responsive layouts
	•	Device compatibility

🚀 Deployment Architecture

Build Tool:
EAS Build

Output:
Android App Bundle (.aab)

Release Flow:
	1.	Closed Testing
	2.	Tester Validation
	3.	Production Access Request
	4.	Production Release

🔐 Security Considerations
	•	No sensitive data stored
	•	No backend exposure
	•	User data remains local


🧭 Future Improvements
	•	Firebase Authentication
	•	Push Notifications
	•	Backend API integration
	•	Media uploads
	•	Admin dashboard

⸻

🧑‍💻 Developer Notes

This project was built with a focus on:
	•	Practical usability
	•	Clean UI/UX
	•	Scalable architecture

⸻

Built with ❤️ by Johny Rex