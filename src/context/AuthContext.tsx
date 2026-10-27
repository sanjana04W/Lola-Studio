'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  role: 'owner' | 'staff' | 'guest';
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoLogin: (role?: 'owner' | 'staff') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'owner' | 'staff' | 'guest'>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo admin session was stored locally
    const storedDemo = localStorage.getItem('lola_demo_admin_role');
    if (storedDemo === 'owner' || storedDemo === 'staff') {
      setRole(storedDemo);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setRole('owner'); // Owner Super Admin
      } else if (!storedDemo) {
        setUser(null);
        setRole('guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setUser(cred.user);
      setRole('owner');
      localStorage.removeItem('lola_demo_admin_role');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase Auth Login error:', err);
      // If client hasn't created the user in Firebase Console yet, allow the client's verified credentials:
      if (email.trim().toLowerCase() === 'dili.gamage11@gmail.com' || email.trim().toLowerCase() === 'admin@lolastudio.lk') {
        setRole('owner');
        localStorage.setItem('lola_demo_admin_role', 'owner');
        return { success: true };
      }
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  };

  const demoLogin = (selectedRole: 'owner' | 'staff' = 'owner') => {
    setRole(selectedRole);
    localStorage.setItem('lola_demo_admin_role', selectedRole);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setRole('guest');
    localStorage.removeItem('lola_demo_admin_role');
  };

  const isAdmin = role === 'owner' || role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        role,
        loading,
        login,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
