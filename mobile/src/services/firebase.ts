import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'na-ontour.firebaseapp.com',
  projectId: 'na-ontour',
  storageBucket: 'na-ontour.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
