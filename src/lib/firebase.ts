import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

const app = getApps().length ? getApps()[0]! : initializeApp(config);

export const firebaseApp = app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const functionsRegion = process.env.NEXT_PUBLIC_FB_FUNCTIONS_REGION;
export const functions = functionsRegion
  ? getFunctions(app, functionsRegion)
  : getFunctions(app);
