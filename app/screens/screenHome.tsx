import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { buscarDados } from "../hooks/CacheHook";

export default function HomeScreen() {
  const navigation = useNavigation();

    const [usuario, setUsuario] = useState<{ nome: string } | null>({ nome: 'Nome do Paciente' });
  
    useEffect(() => {
      const carregarUsuario = async () => {
        try {
          const dados = await buscarDados("usuario");
          if (dados) {
            setUsuario(JSON.parse(dados));
          }
        } catch (e) {
          console.error("Erro ao carregar usuário:", e);
        }
      };
  
      carregarUsuario();
    }, []);

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

      <View style={styles.conteudo}>
        <Text>Bem-vindo ao HSCare, {usuario?.nome || 'Nome do Paciente'} ! 👋</Text>
      </View>

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
  },
  menuButton: {
    marginRight: -15,
  },
  logo: {
    flex: 1,
    height: 60,
    tintColor: "#fff",
  },
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
});
