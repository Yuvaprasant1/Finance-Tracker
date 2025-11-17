import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration from environment variables
 * All values must be prefixed with REACT_APP_ to be accessible in React
 * 
 * Required environment variables:
 * - REACT_APP_FIREBASE_API_KEY
 * - REACT_APP_FIREBASE_AUTH_DOMAIN
 * - REACT_APP_FIREBASE_PROJECT_ID
 * - REACT_APP_FIREBASE_STORAGE_BUCKET
 * - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
 * - REACT_APP_FIREBASE_APP_ID
 * - REACT_APP_FIREBASE_MEASUREMENT_ID (optional)
 */
const getFirebaseConfig = (): FirebaseOptions => {
  const requiredEnvVars = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  // Validate required environment variables
  const missingVars: string[] = [];
  const envVarMap: Record<string, string> = {
    apiKey: 'REACT_APP_FIREBASE_API_KEY',
    authDomain: 'REACT_APP_FIREBASE_AUTH_DOMAIN',
    projectId: 'REACT_APP_FIREBASE_PROJECT_ID',
    storageBucket: 'REACT_APP_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'REACT_APP_FIREBASE_APP_ID',
  };
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(envVarMap[key]);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      `Please set these in your .env file or environment configuration.`
    );
  }

  const config: FirebaseOptions = {
    apiKey: requiredEnvVars.apiKey!,
    authDomain: requiredEnvVars.authDomain!,
    projectId: requiredEnvVars.projectId!,
    storageBucket: requiredEnvVars.storageBucket!,
    messagingSenderId: requiredEnvVars.messagingSenderId!,
    appId: requiredEnvVars.appId!,
  };

  // Measurement ID is optional
  if (process.env.REACT_APP_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
  }

  return config;
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);