import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from './authContextObject';
import { useContext } from 'react';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthContext: Initial session user:', session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: Auth state changed. Event:', event, 'Session user:', session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: async (data) => {
      const response = await supabase.auth.signInWithPassword(data);
      console.log('AuthContext: Sign In attempt. User:', response.data.user, 'Error:', response.error);
      return response;
    },
    signOut: async () => {
      const response = await supabase.auth.signOut();
      console.log('AuthContext: Sign Out attempt. Error:', response.error);
      return response;
    },
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}