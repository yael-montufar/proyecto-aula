// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest?.firebase?.firebaseApiKey,
  authDomain: Constants.manifest?.firebase?.firebaseAuthDomain,
  projectId: Constants.manifest?.firebase?.firebaseProjectId,
  storageBucket: Constants.manifest?.firebase?.firebaseStorageBucket,
  messagingSenderId: Constants.manifest?.firebase?.firebaseMessagingSenderId,
  appId: Constants.manifest?.firebase?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;