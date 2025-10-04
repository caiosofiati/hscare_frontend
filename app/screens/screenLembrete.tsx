import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReminderScreen() {
  const navigation = useNavigation();

  type Lembrete = {
    id: number;
    titulo: string;
    data: Date;
    dias: string[];
  };

  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const alternarDia = (dia: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const adicionarLembrete = async () => {
    const novoLembrete: Lembrete = {
      id: Date.now(),
      titulo: titulo || "Sem título",
      data: dataSelecionada,
      dias: diasSelecionados,
    };

    setLembretes((prev) => [...prev, novoLembrete]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: novoLembrete.titulo,
        body: `⏰ ${formatarData(novoLembrete.data)}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60,
      },
    });

    setTitulo("");
    setDiasSelecionados([]);
    setMostrarModal(false);
  };

  const excluirLembrete = (id: number) => {
    setLembretes((prev) => prev.filter((l) => l.id !== id));
  };

  const formatarData = (data: Date) => {
    return `${data.toLocaleDateString()} às ${data.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
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

      <FlatList
        data={lembretes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.lembreteItem}>
            <Ionicons
              name="alarm-outline"
              size={22}
              color="#3BB2E4"
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.lembreteTexto}>{formatarData(item.data)}</Text>
              {item.dias.length > 0 && (
                <Text style={styles.dias}>
                  Repetir: {item.dias.join(", ")}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.excluirBotao}
              onPress={() => excluirLembrete(item.id)}
            >
              <Ionicons name="remove-circle" size={24} color="#E53935" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum lembrete criado ainda.</Text>
        }
      />

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => setMostrarModal(true)}
      >
        <LinearGradient
          colors={["#3BB2E4", "#6DD66D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.botaoGradiente}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={mostrarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Novo Lembrete</Text>

            <TextInput
              placeholder="Título do lembrete"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setMostrarDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#3BB2E4" />
              <Text style={styles.modalTexto}>
                {dataSelecionada.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setMostrarTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#3BB2E4" />
              <Text style={styles.modalTexto}>
                {dataSelecionada.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            <View style={styles.diasContainer}>
              {diasSemana.map((dia) => (
                <TouchableOpacity
                  key={dia}
                  style={[
                    styles.dia,
                    diasSelecionados.includes(dia) && styles.diaSelecionado,
                  ]}
                  onPress={() => alternarDia(dia)}
                >
                  <Text
                    style={{
                      color: diasSelecionados.includes(dia) ? "#fff" : "#333",
                    }}
                  >
                    {dia}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mostrarDatePicker && (
              <DateTimePicker
                value={dataSelecionada}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  setMostrarDatePicker(false);
                  if (selected) {
                    const novaData = new Date(dataSelecionada);
                    novaData.setFullYear(
                      selected.getFullYear(),
                      selected.getMonth(),
                      selected.getDate()
                    );
                    setDataSelecionada(novaData);
                  }
                }}
              />
            )}
            {mostrarTimePicker && (
              <DateTimePicker
                value={dataSelecionada}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  setMostrarTimePicker(false);
                  if (selected) {
                    const novaData = new Date(dataSelecionada);
                    novaData.setHours(selected.getHours());
                    novaData.setMinutes(selected.getMinutes());
                    setDataSelecionada(novaData);
                  }
                }}
              />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelar}
                onPress={() => setMostrarModal(false)}
              >
                <Text style={{ color: "#E53935", fontWeight: "600" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.salvar} onPress={adicionarLembrete}>
                <LinearGradient
                  colors={["#3BB2E4", "#6DD66D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.botaoGradienteFooter}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Salvar
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  logo: {
    flex: 1,
    height: 60,
    tintColor: "#fff",
  },
  lembreteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titulo: { fontSize: 16, fontWeight: "700", color: "#222" },
  lembreteTexto: { fontSize: 14, color: "#555" },
  dias: { fontSize: 12, color: "#777" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  excluirBotao: { marginLeft: 10 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalBotao: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTexto: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  diasContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  dia: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  diaSelecionado: {
    backgroundColor: "#3BB2E4",
    borderColor: "#3BB2E4",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  cancelar: { justifyContent: "center", paddingHorizontal: 12 },
  salvar: { borderRadius: 20, overflow: "hidden" },
  botaoGradienteFooter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  menuButton: { marginRight: -15 },
});
