import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from "expo-linear-gradient";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { buscarDados } from '../hooks/CacheHook';

export default function Ficha_MedicaScreen() {
  const navigation = useNavigation();

  const [medicalCondition, setMedicalCondition] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [allergy, setAllergy] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medication, setMedication] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [isDonor, setIsDonor] = useState(false);

  const [fullName, setFullName] = useState("Usuário HSCare");
  const [birthDate, setBirthDate] = useState(new Date("1997-04-18"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState("23");
  const [gender, setGender] = useState("Masculino");
  const [bloodType, setBloodType] = useState("O+");
  const [height, setHeight] = useState("185"); 
  const [weight, setWeight] = useState("70");  

  const [usuario, setUsuario] = useState<{ _id: string,  nome: string, email: string, telefone: string, endereco: string, cpf: string } | null>({
    _id: "123",
    nome: "Nome do Paciente",
    email: "email@email.com",
    telefone: "(19) 99999-9999",
    endereco: "Rua Exemplo, 123 - São Paulo, SP",
    cpf: "123.456.789-00",
  });
    
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

  const addToList = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item.trim() !== "") {
      setter([...list, item.trim()]);
    }
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 24px; }
            h1 { color: #3BB2E4; }
            h2 { margin-top: 24px; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>Ficha Médica</h1>
          
          <h2>Informações Pessoais</h2>
          <p><strong>Nome:</strong> ${usuario?.nome}</p>
          <p><strong>Data de nascimento:</strong> ${birthDate.toLocaleDateString("pt-BR")}</p>
          <p><strong>Idade:</strong> ${age} anos</p>
          <p><strong>Gênero:</strong> ${gender}</p>
          <p><strong>Tipo sanguíneo:</strong> ${bloodType}</p>
          <p><strong>Altura:</strong> ${height} cm</p>
          <p><strong>Peso:</strong> ${weight} kg</p>
          <p><strong>Doador de órgãos:</strong> ${isDonor ? "Sim" : "Não"}</p>

          <h2>Condições Médicas</h2>
          <ul>
            ${medicalConditions.map(cond => `<li>${cond}</li>`).join("")}
          </ul>

          <h2>Alergias</h2>
          <ul>
            ${allergies.map(all => `<li>${all}</li>`).join("")}
          </ul>

          <h2>Medicamentos</h2>
          <ul>
            ${medications.map(med => `<li>${med}</li>`).join("")}
          </ul>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    const newFileName = 'fichamedicaHsCare.pdf';
    const newPath = `${FileSystem.documentDirectory}${newFileName}`;

    await FileSystem.moveAsync({ from: uri, to: newPath });
    await Sharing.shareAsync(newPath);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
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
          <Text style={styles.sectionTitle}>Informações pessoais</Text>

          <Text style={styles.label}>Nome completo</Text>
          <Text style={styles.inputMaior}>{usuario?.nome}</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={birthDate.toLocaleDateString("pt-BR")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Idade</Text>
              <TextInput value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />
            </View>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={(event: any, selectedDate?: Date) => {
                setShowDatePicker(false);
                if (selectedDate) setBirthDate(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
            </Picker>
          </View>

          <Text style={styles.label}>Tipo sanguíneo</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={bloodType} onValueChange={(itemValue) => setBloodType(itemValue)} style={styles.picker}>
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput value={height} onChangeText={setHeight} style={styles.input} keyboardType="numeric" />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Condições médicas</Text>
          {medicalConditions.map((cond, idx) => (
            <View key={idx} style={styles.itemCard}><Text>🩺 {cond}</Text></View>
          ))}
          <TextInput placeholder="Ex: Diabetes" style={styles.inputMaior} value={medicalCondition} onChangeText={setMedicalCondition} />
          <TouchableOpacity onPress={() => { addToList(medicalCondition, medicalConditions, setMedicalConditions); setMedicalCondition(""); }}>
            <LinearGradient colors={["#3BB2E4", "#6DD66D"]} style={styles.botao}>
              <Text style={styles.addButtonText}>Adicionar condição</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Alergias</Text>
          {allergies.map((a, idx) => (
            <View key={idx} style={styles.itemCard}><Text>⚠️ {a}</Text></View>
          ))}
          <TextInput placeholder="Ex: Alergia a penicilina" style={styles.inputMaior} value={allergy} onChangeText={setAllergy} />
          <TouchableOpacity onPress={() => { addToList(allergy, allergies, setAllergies); setAllergy(""); }}>
            <LinearGradient colors={["#3BB2E4", "#6DD66D"]} style={styles.botao}>
              <Text style={styles.addButtonText}>Adicionar alergia</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Medicamentos</Text>
          {medications.map((m, idx) => (
            <View key={idx} style={styles.itemCard}><Text>💊 {m}</Text></View>
          ))}
          <TextInput placeholder="Ex: Metformina" style={styles.inputMaior} value={medication} onChangeText={setMedication} />
          <TouchableOpacity onPress={() => { addToList(medication, medications, setMedications); setMedication(""); }}>
            <LinearGradient colors={["#3BB2E4", "#6DD66D"]} style={styles.botao}>
              <Text style={styles.addButtonText}>Adicionar medicamento</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Status de doador de órgãos</Text>
          <View style={styles.donorCard}>
            <Text style={styles.donorLabel}>Você é doador de órgãos?</Text>
            <Switch value={isDonor} onValueChange={setIsDonor} trackColor={{ false: "#ccc", true: "#6DD66D" }} thumbColor={isDonor ? "#3BB2E4" : "#f4f3f4"} />
          </View>
          <Text style={styles.donorStatus}>{isDonor ? "✅ Doador registrado" : "❌ Não é doador"}</Text>

          <TouchableOpacity onPress={generatePDF} style={{ width: "90%", borderRadius: 25, overflow: "hidden", marginTop: 20 }}>
            <LinearGradient colors={["#3BB2E4", "#6DD66D"]} style={styles.botao}>
              <Ionicons name="document-text-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Exportar para PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 5, width: '100%' },
  conteudo: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 12 },
  label: { alignSelf: "flex-start", fontSize: 14, marginBottom: 5 },
  input: { backgroundColor: "#f2f2f2", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: "#ddd" },
  inputMaior: { width: "100%", backgroundColor: "#f2f2f2", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: "#ddd" },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  half: { flex: 1, marginHorizontal: 5 },
  botao: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 15, borderRadius: 25, marginVertical: 8 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  pickerContainer: { width: "100%", backgroundColor: "#f2f2f2", borderRadius: 25, marginBottom: 15, borderWidth: 1, borderColor: "#ddd", overflow: "hidden" },
  picker: { width: "100%", height: 50 },
  itemCard: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 8, marginBottom: 10, width: "100%" },
  donorCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0f0f0", padding: 15, borderRadius: 8, width: "100%", marginBottom: 10 },
  donorLabel: { fontSize: 16, fontWeight: "500" },
  donorStatus: { alignSelf: "center", fontSize: 14, color: "#555", marginBottom: 20, marginTop: -5 },
  menuButton: { marginRight: -15 },
  logo: { flex: 1, height: 60, tintColor: "#fff" }
});
