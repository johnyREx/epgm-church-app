# 📱 BPAM Church App

> A modern mobile application for **Bishop Peter Ababio Ministries (B.P.A.M)** built with React Native (Expo), designed to provide spiritual resources, live engagement, and community connection.

---

## ✨ Features

- 📖 **Bible Study Enrollment**
- 📻 **Live Radio Streaming (Global Player)**
- 🙏 **Prayer Request Submission**
- 🎥 **Live Stream Integration**
- 📜 **Church Constitution Viewer**
- 🧭 **Ministry Leadership Hierarchy**
- 👤 **Offline Profile System**
- 🌍 **Multi-region Play Store Deployment**

---

## 🏗️ Tech Stack

- **React Native (Expo)**
- **Expo Router**
- **TypeScript**
- **AsyncStorage (Offline persistence)**
- **Custom Audio Streaming Engine**
- **Google Play Console (Closed Testing → Production)**

---

## 📂 Project Structure

```bash
app/            # App screens & navigation (Expo Router)
components/     # Reusable UI sections (Radio, History, etc.)
assets/         # Images, icons, branding assets
constants/      # Theme and global constants
data/           # Static data (e.g. radio stations)
hooks/          # Custom hooks (theme, color scheme)
src/lib/        # Core logic (e.g. radio player engine)
scripts/        # Utility scripts

🧠 Architecture Overview

The app follows a modular component-based architecture:
	•	Each feature (Radio, History, Bible Study, etc.) is built as an isolated section component
	•	Navigation is handled using Expo Router
	•	State is primarily local + controlled global logic (for audio)
	•	No backend required — app is offline-first

⸻

🎧 Radio System (Core Feature)

The radio system is designed using a global player architecture:

Key Concepts:
	•	Singleton audio player
	•	Centralized state management
	•	Cross-screen synchronization
	•	Controlled playback logic

Why this approach?

Without a global player:

❌ Multiple radios can play at once
❌ State becomes inconsistent
❌ Poor user experience

With this system:

✅ Only one station plays at a time
✅ Seamless switching between stations
✅ Persistent playback across screens

⸻

👤 Profile System
	•	Stored locally using AsyncStorage
	•	No backend required
	•	User enters:
	•	Name
	•	Status
	•	Avatar

This ensures:

✅ Privacy
✅ Offline usability
✅ Lightweight performance

⸻

🎨 UI/UX Design Philosophy
	•	Dark + Gold spiritual theme
	•	Card-based layout for clarity
	•	Hierarchical display for ministry structure
	•	Minimal clutter, focus on content
	•	Responsive design across devices

⸻

🚀 Deployment Process (Google Play)

This app follows the official Google Play release pipeline:

1. Closed Testing
	•	Minimum 12 testers
	•	Minimum 14 days testing

2. Production Access
	•	Requested after testing completion
	•	Reviewed by Google

3. Production Release
	•	AAB uploaded
	•	Store listing finalized
	•	Released to global users

⸻

📦 Build & Run
# Install dependencies
npm install

# Start development server
npx expo start

# Build Android (EAS)
npx eas build --platform android# Install dependencies
npm install

# Start development server
npx expo start

# Build Android (EAS)
npx eas build --platform android

🔐 Permissions

The app may request:
	•	Internet access (for radio & streaming)
	•	Optional input data (prayer requests)

No sensitive personal data is stored or sold.

⸻

🧑‍💻 Developer

Johny Rex
Built with ❤️
	•	GitHub: https://github.com/johnyREx

⸻

📜 License

This project is developed for Bishop Peter Ababio Ministries.
All rights reserved.

