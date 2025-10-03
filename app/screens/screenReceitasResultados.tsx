import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import type { ImagePickerAsset } from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type ArquivoSelecionado = (ImagePickerAsset | DocumentPicker.DocumentPickerAsset) & {
  fileName?: string;
  name?: string;
  mimeType?: string;
  localUri?: string; // URI permanente
};

type Item = {
  titulo: string;
  arquivo: ArquivoSelecionado;
  tipo: string;
};

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

  // Salva arquivo permanentemente
  const salvarArquivoPermanente = async (uri: string, nomeArquivo: string) => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'ficha_medica/');
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'ficha_medica/', { intermediates: true });
      }

      const destino = FileSystem.documentDirectory + 'ficha_medica/' + Date.now() + '_' + nomeArquivo;
      await FileSystem.copyAsync({ from: uri, to: destino });
      console.log('Arquivo salvo em:', destino);
      return destino;
    } catch (error) {
      console.log('Erro ao salvar arquivo:', error);
      return uri;
    }
  };

  const escolherArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const arquivo = result.assets[0];
        
        // Salva o arquivo permanentemente
        const localUri = await salvarArquivoPermanente(
          arquivo.uri, 
          arquivo.name || 'documento'
        );
        
        setArquivo({ ...arquivo, localUri });
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
  const [arquivo, setArquivo] = useState<ArquivoSelecionado | null>(null);
  const [itens, setItens] = useState<Item[]>([]);
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
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [editando, setEditando] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState<number | null>(null);

  const toggleEdit = () => {
    if (editando && indiceSelecionado !== null) {
      setItens((prev) => {
        const novos = [...prev];
        novos[indiceSelecionado] = {
          ...novos[indiceSelecionado],
          titulo: titulo,
        };
        return novos;
      });

      setItemSelecionado((prev) =>
        prev ? { ...prev, titulo: titulo } : null
      );
    }
    setEditando(!editando);
  };

  // Função para abrir PDF
  const abrirPDF = async () => {
    if (!itemSelecionado?.arquivo) {
      console.log("Erro: Nenhum arquivo selecionado.");
      return;
    }

    const arquivo = itemSelecionado.arquivo;

    // Verifica se o mimeType é válido para PDF
    if (!arquivo.mimeType?.startsWith("application/pdf")) {
      console.log("Erro: Arquivo selecionado não é um PDF.");
      return;
    }

    // Verifica se existe um URI válido para o arquivo
    const uri = arquivo.localUri || arquivo.uri;
    if (!uri) {
      console.log("Erro: URI do arquivo não encontrado.");
      return;
    }

    try {
      // Abre o PDF no navegador ou visualizador
      await WebBrowser.openBrowserAsync(uri);
    } catch (error) {
      console.log("Erro ao abrir PDF:", error);
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
              style={[styles.aba, abaSelecionada === "Receita" && styles.abaSelecionada]}
              onPress={() => setAbaSelecionada("Receita")}
            >
              <Text style={[styles.textoAba, abaSelecionada === "Receita" && styles.textoAbaSelecionado]}>
                Receitas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aba, abaSelecionada === "Resultado" && styles.abaSelecionada]}
              onPress={() => setAbaSelecionada("Resultado")}
            >
              <Text style={[styles.textoAba, abaSelecionada === "Resultado" && styles.textoAbaSelecionado]}>
                Resultados de exames
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conteudoCorpo}>
            {itensFiltrados.map((item, index) => {
              const indexReal = itens.findIndex(i => i === item);
              return (
                <View key={indexReal} style={styles.itemCard}>
                  <TouchableOpacity
                    onPress={() => {
                      setItemSelecionado(item);
                      setIndiceSelecionado(indexReal);
                      setTitulo(item.titulo);
                      setModalItemVisible(true);
                    }}
                  >
                    <Text style={styles.itemTitulo}>{item.titulo}</Text>
                    <Text style={styles.itemSubtitulo}>{item.arquivo.fileName || item.arquivo.name || "Sem nome"}</Text>
                    <Text style={styles.itemTipo}>
                      Tipo: {item.tipo === "Receita" ? "Receita" : "Resultado de Exame"}
                    </Text>
                  </TouchableOpacity>

                  {/* Botão de Remover */}
                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() =>
                      Alert.alert(
                        "Confirmação",
                        "Você deseja realmente excluir este item?",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Excluir",
                            style: "destructive",
                            onPress: () => {
                              setItens((prev) => prev.filter((_, i) => i !== indexReal));
                            },
                          },
                        ]
                      )
                    }
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.textoEditar}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => fecharModal()}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.botaoFecharX} onPress={() => fecharModal()}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#aaa"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TouchableOpacity onPress={() => escolherArquivo()} style={{ width: "100%" }}>
              <LinearGradient
                colors={["#3BB2E4", "#6DD66D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botaoInserirModal}
              >
                <Ionicons name="cloud-upload-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.textoBotaoModal}>
                  {arquivo?.fileName || arquivo?.name || "Selecionar arquivo"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

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

      {/* MODAL ITEM */}
      <Modal
        visible={modalItemVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalItemVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.botaoFecharX} onPress={() => setModalItemVisible(false)}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>

            {itemSelecionado?.arquivo?.mimeType?.startsWith("image/") ? (
              <Image
                source={{ uri: itemSelecionado?.arquivo?.localUri || itemSelecionado?.arquivo?.uri }}
                style={{ width: 250, height: 250, borderRadius: 12, marginBottom: 10 }}
                resizeMode="contain"
              />
            ) : (
              itemSelecionado?.arquivo && itemSelecionado?.arquivo.mimeType?.startsWith("application/pdf") && (
                <TouchableOpacity
                  onPress={abrirPDF}
                  style={{
                    padding: 12,
                    backgroundColor: "#3BB2E4",
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Abrir PDF</Text>
                </TouchableOpacity>
              )
            )}

            <View style={styles.contatoItem}>
              <TouchableOpacity style={[styles.botaoEditar, { right: 0 }]} onPress={toggleEdit}>
                <Ionicons name={editando ? "save-outline" : "create-outline"} size={20} color="#fff" />
                <Text style={styles.textoEditar}>{editando ? "Salvar" : "Editar"}</Text>
              </TouchableOpacity>
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
    marginBottom: 15,
  },
  botaoInserir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 12,
    width: "100%",
    overflow: "hidden",
  },
  textoBotaoModal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  botaoFecharX: {
    position: "fixed",
    top: -5,
    right: 0,
    left: 155,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#e0ddddff",
  },
  botaoInserirGravar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 15,
    width: "100%",
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
    backgroundColor: "#d11a1a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  contatoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  itemCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitulo: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  itemSubtitulo: {
    fontSize: 14,
    color: "#666",
  },
  itemTipo: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#3BB2E4",
    marginTop: 4,
  },
});