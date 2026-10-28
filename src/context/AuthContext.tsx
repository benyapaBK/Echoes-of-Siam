import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isConfigured } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  isFirebaseActive: boolean;
  loginWithFirebase: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  adminEmail: null,
  isFirebaseActive: false,
  loginWithFirebase: async () => {},
  logout: async () => {},
  authError: null
});

const DEMO_ADMIN_KEY = 'museum_atlas_demo_admin_active';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem(DEMO_ADMIN_KEY);
    if (!isConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      const email = user?.email?.trim();
      const normalizedEmail = email?.toLowerCase();
      if (email && (
        normalizedEmail === 'admin@gmail.com' ||
        normalizedEmail === 'benyapabaibuaw@gmail.com'
      )) {
        setIsAdmin(true);
        setAdminEmail(email);
      } else {
        setIsAdmin(false);
        setAdminEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithFirebase = async (email: string, pass: string) => {
    setAuthError(null);
    if (!isConfigured || !auth) {
      throw new Error('ยังไม่ได้ตั้งค่า Firebase Authentication กรุณาตรวจสอบ firebase-applet-config.json');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const signedInEmail = credential.user.email?.trim();
      const normalizedEmail = signedInEmail?.toLowerCase();
      if (signedInEmail && (
        normalizedEmail === 'admin@gmail.com' ||
        normalizedEmail === 'benyapabaibuaw@gmail.com'
      )) {
        setIsAdmin(true);
        setAdminEmail(signedInEmail);
      } else {
        await signOut(auth);
        throw new Error('บัญชีนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ (Unauthorized Admin)');
      }
    } catch (err: any) {
      setAuthError(err.message || 'การเข้าสู่ระบบล้มเหลว');
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_ADMIN_KEY);
    if (isConfigured && auth) {
      await signOut(auth);
    }
    setIsAdmin(false);
    setAdminEmail(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{
      isAdmin,
      adminEmail,
      isFirebaseActive: isConfigured,
      loginWithFirebase,
      logout,
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
