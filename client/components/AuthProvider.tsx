"use client";

import React, { useEffect } from "react";

import { onIdTokenChanged } from "firebase/auth";

import api from "@/lib/axios-instance";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";

type AuthProviderProps = { children: React.ReactNode };

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { skipAuth, setUser, setAuthToken, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (skipAuth) return;

      try {
        setLoading(true);

        if (user) {
          const idToken = await user.getIdToken();
          api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
          setAuthToken(idToken);

          const res = await api.get(`/user/uid/${user.uid}`);
          const userData = res.data;
          setUser(userData);
        } else {
          delete api.defaults.headers.common["Authorization"];
          setAuthToken(null);
          setUser(null);
        }
      } catch {
        delete api.defaults.headers.common["Authorization"];
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [skipAuth, setUser, setAuthToken, setLoading]);

  return <>{children}</>;
};

export default AuthProvider;
