import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 1. Define the shape of the context data
interface AuthContextData {
  userId: string | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (newAccessToken: string, newUserId: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Define the shape of the provider's props (for children)
interface AuthProviderProps {
  children: ReactNode;
}

// 3. Create the context with the defined type
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// 4. Create the provider component with typed props
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedToken && storedUserId) {
          setAccessToken(storedToken);
          setUserId(storedUserId);
        }
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const login = async (newAccessToken: string, newUserId: string) => {
    try {
      setAccessToken(newAccessToken);
      setUserId(newUserId);
      await AsyncStorage.setItem('accessToken', newAccessToken);
      await AsyncStorage.setItem('userId', newUserId);
      router.replace("/(tabs)/homepage");
    } catch (e) {
      console.error("Failed to save auth data", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userId');
      setAccessToken(null);
      setUserId(null);
      router.replace('/login');
    } catch (e) {
      console.error("Failed to clear auth data", e);
    }
  };

  const value: AuthContextData = { userId, accessToken, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Create the custom hook with a check for undefined context
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};