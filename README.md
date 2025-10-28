# GestureTalk: Smart Gesture Glove Web Application

This is a Next.js web application designed to interface with the "GestureTalk" smart glove. It provides a platform for real-time gesture communication and a comprehensive data collection system for training a machine learning model.

## Core Features

- **Live Communication Mode**: Displays detected gestures sent from the smart glove in real-time, with optional text-to-speech (TTS) output.
- **Data Collection Workflow**: A guided user interface to collect sensor data for a predefined set of gestures (A-Z, 1-10). This data is essential for training the gesture recognition model.
- **Web Bluetooth Integration**: Connects directly to the smart glove's Raspberry Pi via the browser's Web Bluetooth API to stream live sensor data during the collection process.
- **Firebase Realtime Database**: All collected gesture data is structured and uploaded to a Firebase Realtime Database, organized by a unique user ID for multi-user support.
- **Demonstration Mode**: The data collection interface can be used without a Bluetooth connection, allowing for demonstration of the app's workflow.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/docs/database)
- **Connectivity**: [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

## Project Structure

- `src/app/`: Contains the main pages for the application.
  - `page.tsx`: The home page.
  - `live/page.tsx`: The live gesture communication interface.
  - `collect/page.tsx`: The data collection interface.
- `src/components/`: Includes all the React components.
  - `gesture-handler.tsx`: Component for the Live Mode page.
  - `data-collector.tsx`: Component for the Data Collection page, including all Bluetooth and data handling logic.
  - `ui/`: UI components from Shadcn/ui.
- `src/lib/`: Core utility files.
  - `firebase.ts`: Handles Firebase Realtime Database initialization and configuration.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- `npm` or `yarn`

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd <repository-name>
npm install
```

### 2. Firebase Setup

This project requires a Firebase project with the Realtime Database enabled.

1.  Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
2.  In your project, create a new **Web App**.
3.  Copy the `firebaseConfig` object provided during the setup.
4.  Paste your configuration into the `firebaseConfig` object in `src/lib/firebase.ts`.
5.  In the Firebase console, go to the **Realtime Database** section and ensure it is created and enabled.

### 3. Bluetooth Device Setup

To connect to the smart glove, you must configure the correct Bluetooth UUIDs in the data collector component.

- Open `src/components/data-collector.tsx`.
- Find the following constants and replace the placeholder UUIDs with the ones advertised by your Raspberry Pi:

```javascript
const GESTURE_SERVICE_UUID = 'YOUR_SERVICE_UUID';
const SENSOR_DATA_CHARACTERISTIC_UUID = 'YOUR_CHARACTERISTIC_UUID';
```

### 4. Running the Application

Once the setup is complete, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser that supports Web Bluetooth (like Google Chrome) to see the application.
