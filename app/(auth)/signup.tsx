import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = async () => {
    if (!agreeTerms) {
      Alert.alert("Terms not accepted", "Please accept the terms to proceed.");
      return;
    }

    try {
      // Call the backend API
      const response = await axios.post(
        "https://api-auth.faishion.ai/v1/auth/request-register",
        {
          email: email,
          password: password,
        }
      );

      // Show success message
      Alert.alert("Success", "Verification email sent! Check your inbox.", [
        {
          text: "OK",
          onPress: () => router.replace("/(onboarding)/onboardingScreen"),
        },
      ]);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <LinearGradient colors={["#f0f4ff", "#fbeeff"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>f</Text>
              </View>
            </View>

            {/* Header */}
            <Text style={styles.heading}>Welcome to fAIshion.AI</Text>
            <Text style={styles.subheading}>
              Your AI shopping assistant, tailor, and many more...
            </Text>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? "eye-off" : "eye"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox */}
            <View style={styles.checkboxRow}>
              <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} />
              <Text style={styles.checkboxText}>
                By checking this box, you agree to the{" "}
                <Text style={styles.link}>privacy policy</Text> and{" "}
                <Text style={styles.link}>terms of service</Text>.
              </Text>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[styles.createBtn, { opacity: agreeTerms ? 1 : 0.5 }]}
              onPress={handleCreateAccount}
              disabled={!agreeTerms}
            >
              <Text style={styles.createBtnText}>Create account</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.line} />
            </View>

            {/* Google Button */}
            <TouchableOpacity style={styles.googleBtn}>
              <Ionicons name="logo-google" size={20} color="white" />
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.link} onPress={() => router.push("/login")}>
                Log in
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
