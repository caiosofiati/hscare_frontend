import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [editando, setEditando] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // BUSCAR ESSES DADOS DO BANCO
  const [perfil, setPerfil] = useState({
    email: "email@email.com",
    telefone: "(19) 99999-9999",
    endereco: "Rua Exemplo, 123 - São Paulo, SP",
    cpf: "123.456.789-00",
  });

  // BUSCAR ESSES DADOS DO BANCO
  const [contatos, setContatos] = useState<
    { nome: string; telefone: string }[]
  >([
    { nome: "Mãe", telefone: "(11) 91234-5678" },
    { nome: "João(Irmão)", telefone: "(19) 98765-4321" },
  ]);

  const [novoContato, setNovoContato] = useState({ nome: "", telefone: "" });

  const handleChange = (key: keyof typeof perfil, value: string) => {
    setPerfil((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = () => {
    if (editando) {
      // ADICIONAR A LOGICA DE SALVAR NO BANCO
      console.log("Salvando perfil:", perfil, "Contatos:", contatos);
    }
    setEditando(!editando);
  };

  const adicionarContato = () => {
    if (novoContato.nome && novoContato.telefone) {
      setContatos([...contatos, novoContato]);
      setNovoContato({ nome: "", telefone: "" });
    }
  };

  const removerContato = (index: number) => {
    setContatos(contatos.filter((_, i) => i !== index));
  };

  const escolherFoto = async () => {
    if (!editando) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#3BB2E4", "#6DD66D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={escolherFoto} activeOpacity={editando ? 0.7 : 1}>
          <Image
            source={
              fotoPerfil
                ? { uri: fotoPerfil }
                : require("../../assets/images/hscare.png")
            }
            style={styles.fotoPerfil}
          />
          {editando && (
            <View style={styles.overlayCamera}>
              <Ionicons name="camera" size={28} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.conteudoHeader}>
          <Text style={styles.nomePaciente}>Nome do Paciente</Text>
        </View>
        <View style={styles.conteudoHeader}>
          <TouchableOpacity style={styles.botaoEditar} onPress={toggleEdit}>
            <Ionicons
              name={editando ? "save-outline" : "create-outline"}
              size={20}
              color="#fff"
            />
            <Text style={styles.textoEditar}>
              {editando ? "Salvar" : "Editar"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Informações Pessoais</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={perfil.email}
              onChangeText={(t) => handleChange("email", t)}
            />
          ) : (
            <Text style={styles.value}>{perfil.email}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Telefone</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={perfil.telefone}
              onChangeText={(t) => handleChange("telefone", t)}
            />
          ) : (
            <Text style={styles.value}>{perfil.telefone}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Endereço</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={perfil.endereco}
              onChangeText={(t) => handleChange("endereco", t)}
            />
          ) : (
            <Text style={styles.value}>{perfil.endereco}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>CPF</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={perfil.cpf}
              onChangeText={(t) => handleChange("cpf", t)}
            />
          ) : (
            <Text style={styles.value}>{perfil.cpf}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Contatos</Text>
          {editando && (
            <View style={styles.novoContatoContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nome"
                value={novoContato.nome}
                onChangeText={(t) =>
                  setNovoContato((prev) => ({ ...prev, nome: t }))
                }
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                placeholder="Telefone"
                value={novoContato.telefone}
                onChangeText={(t) =>
                  setNovoContato((prev) => ({ ...prev, telefone: t }))
                }
              />
              <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarContato}>
                <LinearGradient
                  colors={["#3BB2E4", "#6DD66D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.botaoGradiente}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={contatos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.contatoItem}>
                <LinearGradient
                  colors={["#3BB2E4", "#6DD66D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconeContato}
                >
                  <Ionicons name="person" size={20} color="#fff" />
                </LinearGradient>
                <Text style={styles.value}>
                  {item.nome} - {item.telefone}
                </Text>

                {editando && (
                  <TouchableOpacity
                    onPress={() => removerContato(index)}
                    style={styles.botaoRemover}
                  >
                    <Ionicons name="remove-circle" size={24} color="#E53935" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
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
  container: { flex: 1, backgroundColor: "#fff" },
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
  overlayCamera: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
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
  infoContainer: { padding: 20 },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  infoBox: { marginBottom: 15 },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 16, fontWeight: "500", color: "#000" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 2,
    color: "#000",
  },
  footerBotoes: {
    flexDirection: "row",
    marginTop: "auto",
    padding: 20,
    gap: 12,
  },
  botaoFichaWrapper: { flex: 1, borderRadius: 30, overflow: "hidden" },
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
  contatoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  iconeContato: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  botaoAdicionar: {
    marginLeft: 8,
  },
  botaoGradiente: {
    borderRadius: 20,
    padding: 4,
  },
  novoContatoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  botaoRemover: {
    marginLeft: "auto",
  },
});
