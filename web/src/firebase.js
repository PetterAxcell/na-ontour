import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAF4jnA9TOfgll0-uvLf_tXtt2MVFlp0tU",
  authDomain: "ontour-cc7ce.firebaseapp.com",
  projectId: "ontour-cc7ce",
  storageBucket: "ontour-cc7ce.firebasestorage.app",
  messagingSenderId: "433525218949",
  appId: "1:433525218949:web:9abf9f78b58fcc6cbe93ec"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
