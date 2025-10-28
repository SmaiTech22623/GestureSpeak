import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// --- IMPORTANT ---
// Please fill in your Firebase project configuration here.
// You can find this in your Firebase project settings.
const firebaseConfig = {
  "apiKey": "AIzaSyCEXbzrzoS6xaGV3Nirom7p0xs3WtLvXPA",
  "authDomain": "studio-6011348590-68ee1.firebaseapp.com",
  "databaseURL": "https://studio-6011348590-68ee1.firebaseio.com",
  "projectId": "studio-6011348590-68ee1",
  "storageBucket": "studio-6011348590-68ee1.appspot.com",
  "messagingSenderId": "646238283731",
  "appId": "1:646238283731:web:e0da559c40a8880d22b126"
};

/**
 * Firebase Realtime Database Structure:
 * 
 * /commands/to_pi/{pushId}
 *   - text: string (e.g., "Hello")
 *   - timestamp: serverTimestamp
 *   This path is used by the app to send new gesture commands to the Raspberry Pi.
 *   The Pi should listen for 'child_added' events on this path.
 * 
 * /gestures/from_pi/{pushId}
 *   - text: string (e.g., "Gesture 1 Detected")
 *   - timestamp: number
 *   This path is used by the Raspberry Pi to send detected gestures to the app.
 *   The app listens for 'child_added' events on this path to display and speak the gesture.
 */

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
