import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { buscarDados } from "../hooks/CacheHook";
import { enviarPerguntaGemini } from "../hooks/GeminiAPI";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function HSHelperScreen() {
  const navigation = useNavigation();

  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const dados = await buscarDados("usuario");
        if (dados) {
          const user = JSON.parse(dados);
          setUsuario(user);

          setMessages([
            {
              id: Date.now(),
              text: `Olá, ${user.nome || "usuário"}! Sou o HS Helper 👋  Como posso ajudar com as suas dúvidas de saúde hoje?`,
              sender: "ai",
            },
          ]);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
        setMessages([
          {
            id: Date.now(),
            text: `Olá! Sou o HS Helper 👋  Como posso ajudar com as suas dúvidas de saúde hoje?`,
            sender: "ai",
          },
        ]);
      }
    };

    carregarUsuario();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMessage: Message = {
    id: Date.now(),
    text: input,
    sender: "user",
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const resposta = await enviarPerguntaGemini(input);

    const aiMessage: Message = {
      id: Date.now() + 1,
      text: resposta,
      sender: "ai",
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text:
          "Desculpe, houve um problema ao processar sua pergunta. Tente novamente mais tarde.",
        sender: "ai",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={{ fontWeight: "bold", color: "#333" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return (
      <Text key={index} style={{ color: "#333" }}>
        {part}
      </Text>
    );
  });
};


  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <LinearGradient
        colors={["#3BB2E4", "#6DD66D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/hscare-bkg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageWrapper,
                item.sender === "user" ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  item.sender === "user"
                    ? styles.userBubble
                    : styles.aiBubble,
                ]}
              >
                <Text style={styles.messageText}>{renderFormattedText(item.text)}</Text>
              </View>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu texto aqui"
            value={input}
            onChangeText={setInput}
            editable={!loading}
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={loading || !input.trim()}
          >
            <LinearGradient
              colors={["#3BB2E4", "#6DD66D"]}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: "100%",
  },
  messagesContainer: {
    padding: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 4,
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: "#3BB2E4",
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#6DD66D",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    marginRight: -15,
  },
  logo: {
    flex: 1,
    height: 60,
    tintColor: "#fff",
  },
});
