import { COLORS } from "@/constants/theme";
import axios from "axios";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DIFY_API_ENDPOINT = "https://api.dify.ai/v1";
const DIFY_API_KEY = "app-RQZcF0th7nAnNuIzM6BtmG9J";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = { role: "user", content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${DIFY_API_ENDPOINT}/chat-messages`,
        {
          inputs: {},
          query: currentInput,
          response_mode: "blocking",
          user: "fashion-app-user",
          conversation_id: "",
        },
        {
          headers: {
            Authorization: `Bearer ${DIFY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage: Message = {
        role: "assistant",
        content: response.data.answer || response.data.text || "No response",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "Error: " +
          (error.response?.data?.message || error.message || "Unknown error"),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Fashion AI Assistant</Text>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ask me anything about fashion!</Text>
          <Text style={styles.emptySubtext}>
            Style advice, outfit suggestions, trend insights...
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          style={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.role === "user" && styles.userMessageText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={COLORS.grey}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.grey,
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    padding: 12,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: COLORS.surfaceLight,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: COLORS.white,
  },
  userMessageText: {
    color: COLORS.background,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.background,
    color: COLORS.white,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grey,
  },
  sendButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
