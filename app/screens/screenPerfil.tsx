import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#3BB2E4", "#6DD66D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image
          source={require("../../assets/images/hscare.png")}
          style={styles.fotoPerfil}
        />
        <View style={styles.conteudoHeader}>
          <Text style={styles.nomePaciente}>Nome do Paciente</Text>
        </View>
        <View style={styles.conteudoHeader}>
          <TouchableOpacity style={styles.botaoEditar}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.textoEditar}>Editar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Informações Pessoais</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>email@email.com</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>(19) 99999-9999</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Endereço</Text>
          <Text style={styles.value}>Rua Exemplo, 123 - São Paulo, SP</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>CPF</Text>
          <Text style={styles.value}>123.456.789-00</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Contatos</Text>
          <Text style={styles.value}>codigo</Text>
        </View>
      </View>

      <View style={styles.footerBotoes}>
        <TouchableOpacity
          style={styles.botaoFichaWrapper}
          onPress={() => navigation.navigate("screenFichaMedica" as never)}
        >
          <LinearGradient
            colors={["#3BB2E4", "#6DD66D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.botaoFichaMedica}
          >
            <Text style={styles.textoFichaMedica}>Ficha Médica</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  fotoPerfil: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 15,
  },
  conteudoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  nomePaciente: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginRight: 12,
  },
  botaoEditar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  textoEditar: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: { 
    padding: 20 
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  infoBox: { 
    marginBottom: 15 
  },
  label: { 
    fontSize: 14, color: "#666" 
  },
  value: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#000" 
  },
  footerBotoes: {
    flexDirection: "row",
    marginTop: "auto",
    padding: 20,
    gap: 12,
  },
  botaoFichaWrapper: { 
    flex: 1,
    borderRadius: 30, 
    overflow: "hidden" 
  },
  botaoFichaMedica: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  textoFichaMedica: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoSair: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#E53935",
    alignItems: "center",
  },
  textoSair: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
