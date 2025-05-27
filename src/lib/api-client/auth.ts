import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase';

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const token = await userCredential.user.getIdToken();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!res.ok) {
      throw new Error('無法設置登入 Cookie');
    }

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
    toast.error(errorMessages[error.code] || '登入失敗，請輸入正確信箱或密碼');
    return null;
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!res.ok) throw new Error('無法設置登入 Cookie');

    return result.user;
  } catch (error: any) {
    console.error('Google 登入失敗:', error);
    throw error;
  }
};

export const registerUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);
