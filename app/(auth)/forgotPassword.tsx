import React, { useState } from "react";
import { useRouter } from "expo-router";
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
import { LinearGradient } from "expo-linear-gradient";
import apiClient from "@/utils/apiClient";
import { styles as authStyles } from "@/styles/auth.styles";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      console.log("🔐 Sending password reset request");
      console.log("📧 Email:", email.trim());
      
      await apiClient.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      console.log("✅ Password reset email sent");
      setIsSent(true);
    } catch (err: any) {
      console.error("❌ Forgot password error:", err);
      console.error("❌ Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || "Failed to send reset link. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f0f4ff", "#fbeeff"]} style={authStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={authStyles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={authStyles.logoContainer}>
              <View style={authStyles.logoCircle}>
                <Text style={authStyles.logoText}>f</Text>
              </View>
            </View>

            {/* Header */}
            <Text style={authStyles.heading}>Forgot Password</Text>
            <Text style={authStyles.subheading}>
              {isSent
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </Text>

            {isSent ? (
              <View style={localStyles.successContainer}>
                <Text style={localStyles.successText}>
                  Reset link sent! Please check your email.
                </Text>
                <TouchableOpacity
                  style={[authStyles.createBtn, { marginTop: 24 }]}
                  onPress={() => router.replace("/login")}
                >
                  <Text style={authStyles.createBtnText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {error && (
                  <View style={localStyles.errorContainer}>
                    <Text style={localStyles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={authStyles.inputGroup}>
                  <TextInput
                    style={[
                      authStyles.input,
                      error && localStyles.inputError,
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    editable={!isLoading}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    authStyles.createBtn,
                    (!email.trim() || isLoading) && localStyles.createBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!email.trim() || isLoading}
                >
                  {isLoading ? (
                    <View style={localStyles.loadingContainer}>
                      <ActivityIndicator color="white" size="small" />
                      <Text style={localStyles.loadingText}>Sending...</Text>
                    </View>
                  ) : (
                    <Text style={authStyles.createBtnText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>

                <Text style={authStyles.loginText}>
                  Remember your password?{" "}
                  <Text
                    style={[authStyles.link, isLoading && localStyles.linkDisabled]}
                    onPress={() => !isLoading && router.replace("/login")}
                  >
                    Log in
                  </Text>
                </Text>
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  successContainer: {
    marginTop: 24,
  },
  successText: {
    color: '#059669',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  createBtnDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.7,
  },
  linkDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
