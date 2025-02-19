"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { userLogin } from '@/actions/auth';
import { User } from '@prisma/client';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null, // This is correct
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authenticationResponse = await userLogin(email, password);
      if (authenticationResponse.success) {
        setIsLoggedIn(true);
        setUser(authenticationResponse.user ?? null);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);