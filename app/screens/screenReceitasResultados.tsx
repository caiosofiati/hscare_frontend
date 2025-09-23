import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { ImagePickerAsset } from 'expo-image-picker'; // <-- Importa o tipo corretamente
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Ficha_MedicaScreen() {
  const navigation = useNavigation();
  type RouteParams = { abaInicial?: "Receita" | "Resultado" };
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const abaInicial = route.params?.abaInicial || "Receita";
  const [abaSelecionada, setAbaSelecionada] = useState(abaInicial);
  useEffect(() => {
  if (route.params?.abaInicial && route.params.abaInicial !== abaSelecionada) {
    setAbaSelecionada(route.params.abaInicial);
  }
  }, [route.params?.abaInicial]);

  
  const escolherFoto = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setArquivo(result.assets[0]); 
    }
  } catch (error) {
    console.log("Erro ao escolher arquivo:", error);
  }
};
  const [modalVisible, setModalVisible] = useState(false);
  const fecharModal = () => {
  setModalVisible(false);
  setArquivo(null);
  setTitulo("");
  };

  const [titulo, setTitulo] = useState("");
  const [arquivo, setArquivo] = useState<ImagePickerAsset | null>(null);
  const [itens, setItens] = useState<
  { titulo: string; arquivo: ImagePickerAsset; tipo: string }[]
  >([]);
  const itensFiltrados = itens.filter((item) => item.tipo === abaSelecionada);


  const gravar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Preencha o campo título antes de gravar.");
      return;
    }

    if (!arquivo) {
    Alert.alert("Atenção", "Escolha pelo menos um arquivo antes de gravar.");
    return;
    }

    setItens((prev) => [
      ...prev,
      {
        titulo,
        arquivo,
        tipo: abaSelecionada,
      },
    ]);

    setTitulo("");
    setArquivo(null);
    setModalVisible(false); 
  };

  
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<{
    titulo: string;
    arquivo: ImagePickerAsset;
    tipo: string;
  } | null>(null);
  
  const [editando, setEditando] = useState(false);
  const toggleEdit = () => {
    if (editando && indiceSelecionado !== null) {
      // Atualiza item na lista
      setItens((prev) => {
        const novos = [...prev];
        novos[indiceSelecionado] = {
          ...novos[indiceSelecionado],
          titulo: titulo, // aplica edição
        };
        return novos;
      });

      setItemSelecionado((prev) =>
        prev ? { ...prev, titulo: titulo } : null
      );
    }
    setEditando(!editando);
  };

  const [indiceSelecionado, setIndiceSelecionado] = useState<number | null>(null);

  const removerItem = () => {
  if (indiceSelecionado !== null) {
    setItens((prev) => prev.filter((_, i) => i !== indiceSelecionado));
    setModalItemVisible(false); // fecha modal após excluir
    setItemSelecionado(null);
    setIndiceSelecionado(null);
    setTitulo("");
  }
  };


  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.container}>
          {/* HEADER */}
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

          {/* TOGGLE DE ABAS */}
          <View style={styles.abasContainer}>
            <TouchableOpacity
              style={[styles.aba,
                abaSelecionada === "Receita" && styles.abaSelecionada,
              ]}
              onPress={() => setAbaSelecionada("Receita")}
            >
              <Text style={[styles.textoAba, abaSelecionada === "Receita" && styles.textoAbaSelecionado,]}>
                Receitas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.aba,
                abaSelecionada === "Resultado" && styles.abaSelecionada,
              ]}
              onPress={() => setAbaSelecionada("Resultado")}
            >
              <Text
                style={[
                  styles.textoAba,
                  abaSelecionada === "Resultado" && styles.textoAbaSelecionado,
                ]}
              >
                Resultados de exames
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conteudoCorpo}>
            {itensFiltrados.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginBottom: 15, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 }}
                onPress={() => {
                  setItemSelecionado(item);
                  setIndiceSelecionado(index);
                  setTitulo(item.titulo);
                  setModalItemVisible(true);
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.titulo}</Text>
                <Text>{item.arquivo.fileName ?? "Sem nome"}</Text>
                <Text style={{ fontStyle: "italic", color: "#666" }}>Tipo: {item.tipo == "Receita" ? "Receita" : "Resultado de Exame" }</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={["#3BB2E4", "#6DD66D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.botaoGradiente}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => fecharModal()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* BOTÃO X PARA FECHAR */}
            <TouchableOpacity 
              style={styles.botaoFecharX} 
              onPress={() => fecharModal()}
            >
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>

            {/* ENTRY */}
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#aaa"
              value={titulo}
              onChangeText={setTitulo}
            />

            {/* BOTÃO INSERIR ARQUIVOS */}
            <TouchableOpacity onPress={() => escolherFoto()} style={{ width: "100%" }}>
              <LinearGradient
                colors={["#3BB2E4", "#6DD66D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botaoInserirModal}
              >
                <Ionicons name="cloud-upload-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.textoBotaoModal}>{arquivo?.fileName || "Selecionar arquivo"}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* BOTÃO GRAVAR */}
            <TouchableOpacity onPress={() => gravar()} style={{ width: "100%" }}>
              <LinearGradient
                colors={["#3BB2E4", "#6DD66D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botaoInserirGravar}
              >
                <Ionicons name="save" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.textoBotaoModal}>Gravar</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Modal
        visible={modalItemVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalItemVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Botão fechar */}
            <TouchableOpacity
              style={styles.botaoFecharX}
              onPress={() => setModalItemVisible(false)}
            >
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>

            {/* Conteúdo */}
            {itemSelecionado && (
              <>

                {/* ENTRY */}
                {editando ? (
                <TextInput
                  style={styles.input}
                  value={titulo}
                  onChangeText={setTitulo}
                />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: "500", color: "#000", marginBottom: 15 }}>
                  {titulo}
                </Text>
              )}

                {/* Verifica se é imagem */}
                {itemSelecionado.arquivo.type?.startsWith("image") ? (
                  <Image
                    source={{ uri: itemSelecionado.arquivo.uri }}
                    style={{ width: 250, height: 250, borderRadius: 12, marginBottom: 10 }}
                    resizeMode="contain"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(itemSelecionado.arquivo.uri)}
                    style={{
                      padding: 12,
                      backgroundColor: "#3BB2E4",
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Abrir PDF
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <View style={styles.contatoItem}>
              <TouchableOpacity style={[styles.botaoEditar, { right: editando ? 30 : 0 } ]} onPress={toggleEdit}>
              <Ionicons
                name={editando ? "save-outline" : "create-outline"}
                size={20}
                color="#fff"
              />
              <Text style={styles.textoEditar}>
                {editando ? "Salvar" : "Editar"}
              </Text>
              </TouchableOpacity>

              {/* //// */}
              {editando && (
                <TouchableOpacity style={styles.botaoRemover} onPress={removerItem}>
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.textoEditar}>Excluir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: '100%',
  },
  botao: {
    borderRadius: 10,
    padding: 15,
    //justifyContent: "center",    
    //alignItems: "center",    
  },
  logo: {
  flex: 1,
  height: 60,
  tintColor: "#fff",
},
  menuButton: {
    marginRight: -15,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",      
    width: "100%",              
  },
buttonRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 25,
    right: 25,
    borderRadius: 40,
    overflow: "hidden",
    elevation: 5,
  },
  botaoGradiente: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  abasContainer: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderBottomColor: "#ffffffff",
  marginTop: 0,
},
aba: {
  flex: 1,
  paddingVertical: 12,
  alignItems: "center",
  backgroundColor: "#f0f0f0",
},
abaSelecionada: {
  backgroundColor: "#e0e0e0",
},
textoAba: {
  fontSize: 16,
  color: "#999",
  fontWeight: "500",
},
textoAbaSelecionado: {
  color: "#333",
  fontWeight: "700",
},
conteudoCorpo: {
  padding: 20,
  alignItems: "center",
  justifyContent: "center",
},
textoConteudo: {
  fontSize: 18,
  color: "#333",
},
modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 10,
  marginBottom: 15,  // espaço consistente entre o input e o botão
},
botaoInserir: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",   // centraliza tudo
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 20,
},
  fechar: {
    marginTop: 20,
  },
botaoInserirModal: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  paddingVertical: 14,
  paddingHorizontal: 12, // novo
  width: "100%",
  overflow: "hidden",    // evita vazamento
},

textoBotaoModal: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  flexShrink: 1,          // permite o texto encolher
},
botaoFecharX: {
  position: "fixed",
  top: -5,
  right: 0,
  left: 155,
  marginBottom:10,
  borderRadius:10,
  backgroundColor:"#e0ddddff",
},
  botaoInserirGravar: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  paddingVertical: 14,
  marginTop:15,
  width: "100%",     // ocupa tudo dentro do modal
},
botaoEditar: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#3BB2E4",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 15,
},
textoEditar: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
botaoRemover: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#d11a1aff",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 15,
  left: 30
},
contatoItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 6,
},

});
