// app/(tabs)/advisor.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const BASE_URL = "http://192.168.7.242:8000";

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
}

export default function Advisor() {
  const { darkMode } = useTheme();
  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f9fafb" : "#111827";
  const subColor = darkMode ? "#9ca3af" : "#6b7280";

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

const sendMessage = async () => {
  console.log("sendMessage invoked. input raw:", JSON.stringify(input));
  const message = input.trim()
  if (!message) {
      console.log("sendMessage aborted: message is empty after trim");
      return;
      }
  const userMsg: Message =
   { id: Date.now().toString(),
   text: message,
   fromUser: true };

  setMessages((m) => [...m, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const raw = await response.text();
    console.log("Chatbot raw response:", raw);

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("Non-JSON response: " + raw);
    }

    if (!response.ok) {
      throw new Error(data.detail || data.reply || JSON.stringify(data));
    }

    const reply = data.reply;
    const botMsg: Message = {
    id: (Date.now() + 1).toString(),
    text: reply,
    fromUser: false };
    setMessages((m) => [...m, botMsg]);
  } catch (err: any) {
    console.error("Chatbot fetch error:", err);
    setMessages((m) => [
      ...m,
      {
        id: (Date.now() + 1).toString(),
        text: err.message || "Sorry, something went wrong.",
        fromUser: false,
      },
    ]);
  } finally {
    setLoading(false);
    flatRef.current?.scrollToEnd({ animated: true });
  }
};

  const renderBubble = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        {
          alignSelf: item.fromUser ? "flex-end" : "flex-start",
          backgroundColor: item.fromUser ? "#8b5cf6" : cardBg,
        },
      ]}
    >
      <Text style={{ color: item.fromUser ? "#fff" : textColor }}>{item.text}</Text>
    </View>
  );

  if (!started) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={64}
            color={textColor}
            style={{ marginBottom: 16 }}
          />
          <Text style={[styles.title, { color: textColor }]}>
            RZK Finance Advisor
          </Text>
          <Text style={[styles.subtitle, { color: subColor }]}>your go-to</Text>
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: "#8b5cf6" }]}
            onPress={() => setStarted(true)}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          renderItem={renderBubble}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />
        {loading && <ActivityIndicator size="small" color="#8b5cf6" style={{ margin: 8 }} />}

        <View style={[styles.inputRow, { backgroundColor: cardBg, borderTopColor: subColor }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Type your question..."
            placeholderTextColor={subColor}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.sendBtn}
           onPress={() => sendMessage()}>
             disabled={loading || !input.trim()}
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 18, marginBottom: 24 },
  startBtn: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  startText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  flex: { flex: 1 },
  chatContainer: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: "80%", borderRadius: 12, padding: 12, marginVertical: 4 },

  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
  },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 16 },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#8b5cf6",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
