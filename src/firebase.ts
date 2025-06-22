import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAccZotMLEP5BgVSRj6QS-9Imj2U5ErPng',
  authDomain: 'scrumpoker-vue.firebaseapp.com',
  databaseURL: 'https://scrumpoker-vue-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'scrumpoker-vue',
  storageBucket: 'scrumpoker-vue.firebasestorage.app',
  messagingSenderId: '616336610177',
  appId: '1:616336610177:web:da1f3e19448548d9234e80',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
