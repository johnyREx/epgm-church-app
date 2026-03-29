# 🚀 BPAM Church App — Deployment Guide

This document explains the full process of building, testing, and deploying the BPAM Church App to Google Play.

---

## 🏗️ Build System

The app uses **Expo EAS Build** to generate production-ready Android bundles.

### Build Command

```bash
npx eas build --platform android --profile production

Output
Android App Bundle (.aab)

📦 Versioning Strategy

Each build uses:
	•	versionName → User-facing version (e.g. 1.0.0)
	•	versionCode → Internal build number (auto-incremented)

Example:
versionName: 1.0.0
versionCode: 10

🧪 Testing Strategy (Google Play Requirement)

Google Play requires strict testing before public release.

Closed Testing Requirements
	•	Minimum 12 testers
	•	Minimum 14 days testing period
	•	Testers must install and use the app

⸻

Closed Testing Flow
	1.	Create Closed Test Track
	2.	Add testers (emails or link)
	3.	Upload .aab
	4.	Release to testers
	5.	Collect feedback & fix issues

⸻

🔐 Production Access Request

After testing is complete:
	1.	Go to Play Console Dashboard
	2.	Click Apply for production access
	3.	Submit application

⸻

Review Process

Google verifies:
	•	App stability
	•	Tester engagement
	•	Policy compliance
	•	Data safety declaration

⸻

✅ Production Access Approval

Once approved:
“Congratulations! Your app has been granted production access”

You can now release the app publicly.

🚀 Production Release

Steps
	1.	Go to:

Test and release → Production

    2.	Click:
Create new release

    3.	Upload .aab (or reuse tested build)
	4.	Add release notes
Example:
Initial public release of BPAM Church App.
Includes Radio, Live Stream, Prayer Request, Bible Study and Ministry features.

📊 Rollout Strategy

Recommended:
	•	Start with 20% rollout
	•	Monitor crashes and feedback
	•	Increase gradually to 100%

⸻

🔍 Google Review

After submission:
	•	Automated checks run
	•	Manual review may occur

⏱️ Typical time:
	•	Few hours to 24 hours
	•	Sometimes up to 3 days

⸻

🌍 App Goes Live

Once approved:
	•	App becomes searchable on Play Store
	•	Users can install globally
	•	Ratings & analytics begin

⸻

🔄 Updating the App

To release updates:
	1.	Make code changes
	2.	Build new .aab
	3.	Upload to Production
	4.	Submit for review

⸻

⚠️ Common Pitfalls
	•	Uploading new builds during review (delays process)
	•	Not meeting tester requirements
	•	Incorrect Data Safety form
	•	Missing Privacy Policy
	•	Version code conflicts

⸻

🧠 Best Practices
	•	Always test before production
	•	Keep release notes clear
	•	Monitor crashes after launch
	•	Maintain version control (GitHub)
	•	Prepare updates ahead of time

⸻

🧑‍💻 Developer

Built with ❤️ by Johny Rex
GitHub: https://github.com/johnyREx