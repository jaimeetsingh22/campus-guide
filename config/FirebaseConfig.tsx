// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLwlPFq1182D01VXZpUzg-4WvppqZC8qo",
  authDomain: "campus-guid-react-native.firebaseapp.com",
  projectId: "campus-guid-react-native",
  storageBucket: "campus-guid-react-native.firebasestorage.app",
  messagingSenderId: "681555506666",
  appId: "1:681555506666:web:8c378f3b9cb589b47f2e93",
  measurementId: "G-E86F3ZCREQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const analytics = getAnalytics(app);
