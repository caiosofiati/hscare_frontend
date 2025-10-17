import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { salvarDados } from "../hooks/CacheHook";
import { registrar } from "../hooks/LoginHook";

export default function RegistroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const animacaoFade = useRef(new Animated.Value(0)).current;
  const scaleDaAnimacao = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animacaoFade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleDaAnimacao, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleCadastro() {
      try {
        const data = await registrar(nome, email, senha, cpf);
        router.push("../screens/screenHome");
  
        salvarDados("usuario", JSON.stringify(data.usuario));
        salvarDados("token", String(data.token));
      } catch (err) {
        console.log(err);
      }
    }

  return (
    <LinearGradient
      colors={["#3BB2E4", "#6DD66D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Animated.Image
          source={require("../../assets/images/hscare-bkg.png")}
          style={[
            styles.logo,
            { opacity: animacaoFade, transform: [{ scale: scaleDaAnimacao }] },
          ]}
          resizeMode="contain"
        />

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#3BB2E4" />
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#777"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#3BB2E4" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={20} color="#3BB2E4" />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#777"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#3BB2E4" />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#777"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
          onPress={handleCadastro}
        >
          <LinearGradient
            colors={["#3BB2E4", "#3BB2E4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={[styles.gradientTexto, { opacity: 1 }]}>
              Já tem conta? Faça login
            </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 40,
    tintColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  botao: {
    width: "100%",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  gradientTexto: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
  },
});
