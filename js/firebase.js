// js/firebase.js
// Importando as ferramentas do Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- SUAS CHAVES CERTAS (JÁ ARRUMADO) ---
const firebaseConfig = {
  apiKey: "AIzaSyC46WJo-QefFZKrVv4zWaf_QGhUpJkCKOA",
  authDomain: "clickvenda-master.firebaseapp.com",
  projectId: "clickvenda-master",
  storageBucket: "clickvenda-master.firebasestorage.app",
  messagingSenderId: "646136259117",
  appId: "1:646136259117:web:a3f43075908c71a25a8ea4"
};

// Iniciando o Motor
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("🔥 Firebase Conectado!");

export { db, auth, collection, getDocs, addDoc, updateDoc, doc, onSnapshot, signInWithEmailAndPassword, onAuthStateChanged, signOut };