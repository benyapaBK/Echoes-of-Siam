import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isConfigured } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  isFirebaseActive: boolean;
  loginAsDemoAdmin: () => void;
  loginWithFirebase: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  adminEmail: null,
  isFirebaseActive: false,
  loginAsDemoAdmin: () => {},
  loginWithFirebase: async () => {},
  logout: async () => {},
  authError: null
});

const DEMO_ADMIN_KEY = 'museum_atlas_demo_admin_active';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_ADMIN_KEY) === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem(DEMO_ADMIN_KEY) === 'true' ? 'admin@gmail.com' : null;
  });
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user && (user.email === 'admin@gmail.com' || user.email === 'Benyapabaibuaw@gmail.com')) {
          setIsAdmin(true);
          setAdminEmail(user.email);
        } else if (localStorage.getItem(DEMO_ADMIN_KEY) === 'true') {
          setIsAdmin(true);
          setAdminEmail('admin@gmail.com');
        } else {
          setIsAdmin(false);
          setAdminEmail(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const loginAsDemoAdmin = () => {
    localStorage.setItem(DEMO_ADMIN_KEY, 'true');
    setIsAdmin(true);
    setAdminEmail('admin@gmail.com');
    setAuthError(null);
  };

  const loginWithFirebase = async (email: string, pass: string) => {
    setAuthError(null);
    if (!isConfigured || !auth) {
      // In local preview without live Firebase server credentials
      if (email.trim().toLowerCase() === 'admin@gmail.com' && pass === 'admin123456') {
        loginAsDemoAdmin();
        return;
      }
      throw new Error('Firebase credentials not yet configured in .env. Use the Quick Access Demo Admin button or provide Firebase credentials.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      if (credential.user.email === 'admin@gmail.com' || credential.user.email === 'Benyapabaibuaw@gmail.com') {
        setIsAdmin(true);
        setAdminEmail(credential.user.email);
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
      loginAsDemoAdmin,
      loginWithFirebase,
      logout,
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
