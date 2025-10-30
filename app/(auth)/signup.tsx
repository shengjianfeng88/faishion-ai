import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { styles } from "@/styles/auth.styles";
export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = () => {
    if (!agreeTerms) {
      Alert.alert("Terms not accepted", "Please accept the terms to proceed.");
      return;
    }
    // TODO: Send to backend here
    router.replace("/(onboarding)/onboardingScreen");

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
          style={[
            styles.createBtn,
            { opacity: agreeTerms ? 1 : 0.5 },
          ]}
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

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scroll: {
//     padding: 24,
//     paddingTop: 80,
//     alignItems: "center",
//   },
//   logoContainer: { marginBottom: 16 },
//   logoCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 6,
//     textAlign: "center",
//   },
//   subheading: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   inputGroup: { width: "100%", maxWidth: 340 },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 2,
//     marginBottom: 16,
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 20,
//     maxWidth: 320,
//   },
//   checkboxText: {
//     fontSize: 12,
//     color: "#333",
//     marginLeft: 8,
//     flex: 1,
//   },
//   link: {
//     color: "#6A5ACD",
//     textDecorationLine: "underline",
//   },
//   createBtn: {
//     backgroundColor: "#6A5ACD",
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     borderRadius: 12,
//     width: "100%",
//     maxWidth: 340,
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   createBtnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     width: "100%",
//     maxWidth: 320,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#ccc",
//   },
//   orText: {
//     marginHorizontal: 12,
//     color: "#666",
//   },
//   googleBtn: {
//     backgroundColor: "#888",
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//     width: "100%",
//     maxWidth: 340,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//     marginBottom: 30,
//   },
//   googleBtnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//     marginLeft: 8,
//   },
//   loginText: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 20,
//   },
// });
