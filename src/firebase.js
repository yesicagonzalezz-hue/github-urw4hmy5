import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD3bIAeE445ZsU_vn3LRsbk7--AMqae3_g',
  authDomain: 'labiblia-a5113.firebaseapp.com',
  projectId: 'labiblia-a5113',
  storageBucket: 'labiblia-a5113.firebasestorage.app',
  messagingSenderId: '85230599769',
  appId: '1:85230599769:web:7da410a35cce9812907b48',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
