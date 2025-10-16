import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { styles } from "@/styles/auth.styles";
import { useAuth } from '../../context/AuthContext';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://api-auth.faishion.ai/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Email validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Sign-In Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_GO_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleBackendGoogleLogin(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      setError("Google Sign-In was cancelled or failed.");
      console.error("Google Auth Error:", response.error);
    }
  }, [response]);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleBackendGoogleLogin = async (token: string) => {
    setError("");
    setIsLoading(true);

    try {
      console.log("🔐 Google OAuth: Authenticating with backend");
      
      const response = await apiClient.post('/auth/google-auth', { token });

      console.log("✅ Google login successful");

      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('userId', response.data.userId);

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("❌ Google Login error:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      
      let errorMessage = "Google authentication failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setIsLoading(true);

    const loginEmail = email.trim().toLowerCase();
    
    try {
      console.log("🔐 Attempting login");
      console.log("📧 Email:", loginEmail);
      console.log("🔗 API URL:", `${apiClient.defaults.baseURL}/auth/login`);
      
      const response = await apiClient.post('/auth/login', {
        email: loginEmail,
        password: password,
        rememberMe: true,
      });

      console.log("✅ Login successful");
      console.log("📦 Response data:", {
        hasAccessToken: !!response.data.accessToken,
        hasUserId: !!response.data.userId
      });
      
      await login(response.data.accessToken, response.data.userId);
      router.replace("/(tabs)");
      
    } catch (error: any) {
      console.error("❌ Login failed");
      console.error("❌ Error message:", error.message);
      console.error("❌ Response status:", error.response?.status);
      console.error("❌ Response data:", error.response?.data);
      console.error("❌ Full error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = () => email.trim() && password && validateEmail(email.trim());
  
  const clearError = () => { 
    if (error) setError(""); 
  };

  return (
    <LinearGradient colors={["#f0f4ff", "#fbeeff"]} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scroll} 
            keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>f</Text>
              </View>
            </View>
            
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Log in to fAIshion.AI</Text>

            {error && (
              <View style={authStyles.errorContainer}>
                <Text style={authStyles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <TextInput 
                style={[
                  styles.input, 
                  email && !validateEmail(email.trim()) ? authStyles.inputError : null
                ]} 
                placeholder="Email" 
                placeholderTextColor="#888" 
                keyboardType="email-address" 
                autoCapitalize="none" 
                autoCorrect={false} 
                value={email} 
                onChangeText={(text) => { 
                  setEmail(text); 
                  clearError(); 
                }} 
                editable={!isLoading} 
                returnKeyType="next" 
              />
              
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={[styles.input, { flex: 1 }]} 
                  placeholder="Password" 
                  placeholderTextColor="#888" 
                  secureTextEntry={!showPass} 
                  value={password} 
                  onChangeText={(text) => { 
                    setPassword(text); 
                    clearError(); 
                  }} 
                  editable={!isLoading} 
                  returnKeyType="done" 
                  onSubmitEditing={handleLogin} 
                />
                <TouchableOpacity 
                  onPress={() => setShowPass(!showPass)} 
                  disabled={isLoading} 
                  style={{ padding: 4 }}
                >
                  <Ionicons 
                    name={showPass ? "eye-off" : "eye"} 
                    size={20} 
                    color={isLoading ? "#ccc" : "#888"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={authStyles.forgotPassword} 
              disabled={isLoading}
              onPress={() => !isLoading && router.push("/forgotPassword")}
            >
              <Text style={[
                authStyles.forgotPasswordText, 
                isLoading && { opacity: 0.6 }
              ]}>
                Forgot your password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.createBtn, 
                (!isFormValid() || isLoading) && authStyles.createBtnDisabled
              ]} 
              onPress={handleLogin} 
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <View style={authStyles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={authStyles.loadingText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.createBtnText}>Log in</Text>
              )}
            </TouchableOpacity>
            
            <View style={authStyles.dividerRow}>
              <View style={authStyles.line} />
              <Text style={authStyles.orText}>Or</Text>
              <View style={authStyles.line} />
            </View>

            <TouchableOpacity
              style={[
                authStyles.googleBtn, 
                isLoading && authStyles.createBtnDisabled
              ]}
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <Ionicons name="logo-google" size={20} color="#374151" />
              <Text style={authStyles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
              Don't have an account?{" "}
              <Text 
                style={[styles.link, isLoading && authStyles.linkDisabled]} 
                onPress={() => !isLoading && router.replace("/signup")}
              >
                Sign up
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const authStyles = StyleSheet.create({
  errorContainer: { 
    backgroundColor: '#fee2e2', 
    borderColor: '#fecaca', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16 
  },
  errorText: { 
    color: '#dc2626', 
    fontSize: 14, 
    textAlign: 'center', 
    fontWeight: '500' 
  },
  inputError: { 
    borderColor: '#dc2626', 
    borderWidth: 1 
  },
  createBtnDisabled: { 
    backgroundColor: '#d1d5db', 
    opacity: 0.7 
  },
  linkDisabled: { 
    opacity: 0.6 
  },
  loadingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { 
    marginLeft: 8, 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  forgotPassword: { 
    alignSelf: 'center', 
    marginBottom: 24 
  },
  forgotPasswordText: { 
    color: '#6366f1', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  dividerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 12 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#d1d5db' 
  },
  orText: { 
    marginHorizontal: 12, 
    color: '#6b7280', 
    fontSize: 14 
  },
  googleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    borderColor: '#d1d5db', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingVertical: 14, 
    paddingHorizontal: 16, 
    marginBottom: 24 
  },
  googleBtnText: { 
    marginLeft: 12, 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151' 
  },
});
