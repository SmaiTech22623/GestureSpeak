import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    "apiKey": "AIzaSyCEXbzrzoS6xaGV3Nirom7p0xs3WtLvXPA",
    "authDomain": "studio-6011348590-68ee1.firebaseapp.com",
    "databaseURL": "https://studio-6011348590-68ee1-default-rtdb.firebaseio.com",
    "projectId": "studio-6011348590-68ee1",
    "storageBucket": "studio-6011348590-68ee1.appspot.com",
    "messagingSenderId": "646238283731",
    "appId": "1:646238283731:web:e0da559c40a8880d22b126"
};

/**
 * Firebase Realtime Database Structure:
 *
 * /users/{userId}/gestures/{gesture}/{sampleId}
 *   - flex1, flex2, flex3, flex4, flex5: number
 *   - imu: {ax, ay, az, gx, gy, gz}
 *   - timestamp: number
 *   This path stores raw sensor data for each gesture collected from a user.
 * 
 * /live/sensor_data
 *   - flex1, flex2, ...
 *   - imu: { ... }
 *   A temporary path for the Pi to write live sensor data to, which the app reads during collection.
 * 
 * /uploads_log/{pushId}
 *  - userId: string
 *  - timestamp: serverTimestamp
 *  - gesturesCount: number
 *  - totalSamples: number
 *  A log to track data upload events.
 *
 * /commands/to_pi/{pushId} (Live Mode)
 *   - text: string (e.g., "Hello")
 *   - timestamp: serverTimestamp
 *   This path is used by the app to send new gesture commands to the Raspberry Pi.
 *
 * /gestures/from_pi/{pushId} (Live Mode)
 *   - text: string (e.g., "Gesture 1 Detected")
 *   - timestamp: number
 *   This path is used by the Raspberry Pi to send detected gestures to the app.
 */


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
