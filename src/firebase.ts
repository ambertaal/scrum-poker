import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

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
export const auth = getAuth(app);

let authUidPromise: Promise<string | null> | null = null;

/**
 * Signs in anonymously (once) so database rules can tie a player record to
 * its owner via `auth.uid`. Resolves to null when anonymous auth is not
 * available (e.g. not enabled in the Firebase console), so the app keeps
 * working against permissive rules.
 */
export const ensureAuthUid = (): Promise<string | null> => {
  authUidPromise ??= (async () => {
    try {
      await auth.authStateReady();
      if (auth.currentUser) return auth.currentUser.uid;
      const credential = await signInAnonymously(auth);
      return credential.user.uid;
    } catch (error) {
      console.warn('Anonymous sign-in unavailable:', error);
      authUidPromise = null;
      return null;
    }
  })();
  return authUidPromise;
};
