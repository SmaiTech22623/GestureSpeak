# ✋ GestureTalk — Smart Gesture Glove Web App

Welcome to **GestureTalk**, a Next.js-powered web application that brings **gesture-based communication** to life.  
Designed to work seamlessly with the **Smart Gesture Glove**, this app enables **real-time gesture translation**, **data collection**, and **AI model training** — all from your browser.

---

## 🚀 What It Does

- 🗣️ **Live Communication Mode**  
  Instantly display gestures detected by the glove in real-time — with optional **text-to-speech (TTS)** output for voice-enabled interaction.

- 📊 **Data Collection System**  
  A guided, user-friendly interface that walks users through performing gestures (A–Z, 1–10) while logging sensor readings to power gesture recognition AI.

- 🔗 **Web Bluetooth Connectivity**  
  Directly pair your browser with the glove’s Raspberry Pi over **Web Bluetooth**, streaming live IMU and flex sensor data.

- ☁️ **Firebase Realtime Database**  
  Automatically store and organize all gesture data per user ID — enabling **multi-user training** and clean dataset management.

- 🎓 **Demonstration Mode**  
  No glove? No problem. Explore the entire data collection workflow even without a connected device.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | [Next.js (App Router)](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Kit | [Shadcn/ui](https://ui.shadcn.com/) |
| Database | [Firebase Realtime Database](https://firebase.google.com/docs/database) |
| Connectivity | [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) |

---

## 🧩 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── live/page.tsx         # Live Gesture Communication
│   └── collect/page.tsx      # Data Collection Workflow
│
├── components/
│   ├── gesture-handler.tsx   # Handles live gesture recognition
│   ├── data-collector.tsx    # Bluetooth + data capture logic
│   └── ui/                   # Reusable UI components
│
└── lib/
    └── firebase.ts           # Firebase configuration and setup
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- `npm` or `yarn`

### 1️⃣ Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <repository-name>
npm install
```

### 2️⃣ Firebase Setup

This project requires a Firebase project with the Realtime Database enabled.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Add a **Web App** and copy its `firebaseConfig` object.
3. Paste it inside `src/lib/firebase.ts`.
4. Make sure your Realtime Database is created and active.

---

### 3️⃣ Bluetooth Device Setup

To connect to your smart glove, update the Bluetooth UUIDs in:

`src/components/data-collector.tsx`

Replace placeholder values with your Raspberry Pi’s service and characteristic UUIDs:

```javascript
const GESTURE_SERVICE_UUID = 'YOUR_SERVICE_UUID';
const SENSOR_DATA_CHARACTERISTIC_UUID = 'YOUR_CHARACTERISTIC_UUID';
```

---

### 4️⃣ Run the App

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in **Google Chrome** (or any browser supporting Web Bluetooth).

---

## 💡 Future Ideas

- 🧬 AI-powered gesture classification model integration  
- 🌐 Cloud-based dataset visualization dashboard  
- 🧤 Multi-hand / multi-user gesture support  

---

## 🧑‍💻 Made With Passion

Created for inclusive communication — bridging technology and human connection through **Smart Gesture Recognition**.  
Let your hands **talk**, and let the web **listen**. 💬✨
