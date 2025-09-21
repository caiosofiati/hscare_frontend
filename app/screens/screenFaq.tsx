import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FAQScreen() {
  const navigation = useNavigation();
  const [expandir, setExpandir] = useState<number | null>(null);

  // PEGAR AS PERGUNTAS DO BANCO DE DADOS
  const faqs = [
    {
      id: 1,
      pergunta: "Como marcar uma consulta?",
      resposta:
        "Você pode marcar consultas diretamente pelo aplicativo, acessando a aba de agendamentos no menu principal.",
    },
    {
      id: 2,
      pergunta: "Como redefinir minha senha?",
      resposta:
        "Na tela de login, selecione 'Esqueci minha senha' e siga as instruções enviadas para o seu e-mail cadastrado.",
    },
    {
      id: 3,
      pergunta: "Meus dados são seguros?",
      resposta:
        "Sim. Todos os seus dados são criptografados e armazenados de acordo com a LGPD, garantindo total segurança.",
    },
    {
      id: 4,
      pergunta: "Posso exportar minhas informações médicas?",
      resposta:
        "Sim. Na aba de ficha médica, você pode exportar os dados em PDF através do botão de exportação.",
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandir(expandir === id ? null : id);
  };

  return (
    <View style={styles.container}>
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

      <ScrollView contentContainerStyle={styles.content}>
        {faqs.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={styles.pergunta}>{item.pergunta}</Text>
              <Ionicons
                name={expandir === item.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#3BB2E4"
              />
            </TouchableOpacity>

            {expandir === item.id && (
              <Text style={styles.resposta}>{item.resposta}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: '100%',
  },
  menuButton: {
    marginRight: -15,
  },
  logo: {
    flex: 1,
    height: 60,
    tintColor: "#fff",
  },
  content: {
    padding: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 15,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pergunta: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  resposta: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
