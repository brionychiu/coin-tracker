import { initializeApp } from 'firebase/app';
import type { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = await userCredential.user.getIdToken();
    Cookies.set('authToken', token, { expires: 180, secure: true });

    return userCredential;
  } catch (error: any) {
    console.error('登入失敗:', error.code, error.message);

    const errorMessages: Record<string, string> = {
      'auth/invalid-email': '無效的電子郵件格式',
      'auth/user-disabled': '此帳戶已被停用',
      'auth/user-not-found': '找不到該使用者',
      'auth/wrong-password': '密碼錯誤，請重新輸入',
      'auth/too-many-requests': '嘗試次數過多，請稍後再試',
    };
    const errorMessage =
      errorMessages[error.code] || '登入失敗，請輸入正確信箱或密碼';
    toast.error(errorMessage);
    return null;
  }
};

const registerUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

const logoutUser = () => signOut(auth);

const subscribeToAuthChanges = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export { auth, db, doc, logoutUser, registerUser, signIn, storage, subscribeToAuthChanges, updateDoc };

