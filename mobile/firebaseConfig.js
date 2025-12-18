import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCayskPNuk1re0To5n6Op7HnwCFiEmcvpk",
    authDomain: "ordem-de-servico-2025.firebaseapp.com",
    projectId: "ordem-de-servico-2025",
    storageBucket: "ordem-de-servico-2025.firebasestorage.app",
    messagingSenderId: "21332335828",
    appId: "1:21332335828:web:4fca8d6d089257864d2f41"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
