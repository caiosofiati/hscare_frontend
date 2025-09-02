import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

export default function RegistroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const router = useRouter();

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Image 
        source={require("../../assets/images/hscare-bkg.png")} 
        style={[
          styles.logo, 
          { opacity: animacaoFade, transform: [{ scale: scaleDaAnimacao }] }
        ]} 
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#aaa"
        value={confirmarPassword}
        onChangeText={setConfirmarPassword}
        secureTextEntry
      />

      <TouchableOpacity style={{ width: "100%", marginTop: 10, marginBottom: 20 }}>
        <LinearGradient
          colors={["#3BB2E4", "#6DD66D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.botao}
        >
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <MaskedView
          maskElement={
            <Text style={styles.gradientTexto}>
              Já tem conta? Faça login
            </Text>
          }
        >
          <LinearGradient
            colors={["#3BB2E4", "#6DD66D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.gradientTexto, { opacity: 0 }]}>
              Já tem conta? Faça login
            </Text>
          </LinearGradient>
        </MaskedView>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
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
  textoRegistro: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "500",
  },
  gradientTexto: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
