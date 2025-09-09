import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from "expo-linear-gradient";
import * as Print from 'expo-print';
import { useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import React, { useState } from "react";
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

export default function Ficha_MedicaScreen() {
  // Estados dos campos editáveis
  const [language, setLanguage] = useState("pt-BR");

  const [medicalCondition, setMedicalCondition] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);

  const [allergy, setAllergy] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  const [medication, setMedication] = useState("");
  const [medications, setMedications] = useState<string[]>([]);

  const [isDonor, setIsDonor] = useState(false);

  // const [contacts, setContacts] = useState<
  //   { name: string; relationship: string; phone: string }[]
  // >([]);
  // const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "" });
  const router = useRouter();

  const addToList = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item.trim() !== "") {
      setter([...list, item.trim()]);
    }
  };

const [fullName, setFullName] = useState("Bagriel TchupaPika");
const [birthDate, setBirthDate] = useState(new Date("1997-04-18"));
const [showDatePicker, setShowDatePicker] = useState(false);
const [age, setAge] = useState("23");
const [gender, setGender] = useState("Masculino");
const [bloodType, setBloodType] = useState("O+");
const [height, setHeight] = useState("185"); 
const [weight, setWeight] = useState("70");  


  // const addContact = () => {
  //   if (newContact.name && newContact.relationship && newContact.phone) {
  //     setContacts([...contacts, newContact]);
  //     setNewContact({ name: "", relationship: "", phone: "" });
  //   }
  // };

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
        <p><strong>Nome:</strong> ${fullName}</p>
        <p><strong>Data de nascimento:</strong> ${birthDate.toLocaleDateString("pt-BR")}</p>
        <p><strong>Idade:</strong> ${age}</p>
        <p><strong>Gênero:</strong> ${gender}</p>
        <p><strong>Tipo sanguíneo:</strong> ${bloodType}</p>
        <p><strong>Altura:</strong> ${height}</p>
        <p><strong>Peso:</strong> ${weight}</p>
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
  const newFileName = 'Ficha Médica Gabriel Tchupapika.pdf';
  const newPath = `${FileSystem.documentDirectory}${newFileName}`;

  // Move (renomeia) o arquivo
  await FileSystem.moveAsync({
    from: uri,
    to: newPath
  });

  // Compartilha o novo arquivo
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
        
              <Image
                source={require("../../assets/images/hscare-bkg.png")}
                style={styles.logo}
                resizeMode="contain"
              />
          </LinearGradient>


        <View style={styles.conteudo}>
          <Text style={styles.sectionTitle}>Informações pessoais</Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input}/>

          <Text style={styles.label}>Data de nascimento</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              editable={false}
              value={birthDate.toLocaleDateString("pt-BR")}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={(event: any, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
            />
          )}


          <Text style={styles.label}>Idade</Text>
          <TextInput value={age} onChangeText={setAge} style={styles.input}  keyboardType="numeric"/>

          <Text style={styles.label}>Gênero</Text>
          <View style={styles.botao}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Geladeira Eletrolux" value="Geladeira Eletrolux" />
          </Picker>
        </View>


          <Text style={styles.label}>Tipo sanguíneo</Text>
          <View style={styles.botao}>
          <Picker
            selectedValue={bloodType}
            onValueChange={(itemValue) => setBloodType(itemValue)}
            style={styles.picker}
          >
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

          <Text style={styles.label}>Altura</Text>
          <TextInput value={height} onChangeText={setHeight} style={styles.input} keyboardType="numeric"/>

          <Text style={styles.label}>Peso</Text>
          <TextInput value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric"/>

          {/* Condições médicas */}
          <Text style={styles.sectionTitle}>Condições médicas</Text>

          {medicalConditions.map((cond, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.listItem}>🩺 {cond}</Text>
            </View>
          ))}


          <TextInput
            placeholder="Ex: Diabetes"
            style={styles.input}
            value={medicalCondition}
            onChangeText={setMedicalCondition}
          />

          <TouchableOpacity style={styles.botao} onPress={() => {
              addToList(medicalCondition, medicalConditions, setMedicalConditions);
              setMedicalCondition("");
            }} >
            <LinearGradient
              colors={["#3BB2E4", "#6DD66D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botao}
            >
              <Text style={styles.addButtonText}>Adicionar condição</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Alergias */}
          <Text style={styles.sectionTitle}>Alergias e reações adversas</Text>
          {allergies.map((a, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.listItem}>⚠️ {a}</Text>
            </View>
          ))}
          <TextInput
            placeholder="Ex: Alergia a penicilina"
            style={styles.input}
            value={allergy}
            onChangeText={setAllergy}
          />
          <TouchableOpacity
            style={styles.botao}
            onPress={() => {
              addToList(allergy, allergies, setAllergies);
              setAllergy("");
            }}
          >

            <LinearGradient
              colors={["#3BB2E4", "#6DD66D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botao}
            >
              <Text style={styles.addButtonText}>Adicionar alergia</Text>
            </LinearGradient>
          </TouchableOpacity>


          {/* Medicamentos */}
          <Text style={styles.sectionTitle}>Medicamentos em uso</Text>

          {medications.map((m, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.listItem}>💊 {m}</Text>
            </View>
          ))}


          <TextInput 
          placeholder="Ex: Metformina" 
          style={styles.input} 
          value={medication}
          onChangeText={setMedication}/>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => {
              addToList(medication, medications, setMedications);
              setMedication("");
            }}
          >
            <LinearGradient
              colors={["#3BB2E4", "#6DD66D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botao}
            >
              <Text style={styles.addButtonText}>Adicionar medicamento</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Doador de órgãos */}
          <Text style={styles.sectionTitle}>Status de doador de órgãos</Text>
          <View style={styles.donorCard}>
            <Text style={styles.donorLabel}>Você é doador de órgãos?</Text>
            <Switch
              value={isDonor}
              onValueChange={setIsDonor}
              trackColor={{ false: "#ccc", true: "#6DD66D" }}
              thumbColor={isDonor ? "#3BB2E4" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.donorStatus}>
            {isDonor ? "✅ Doador registrado" : "❌ Não é doador"}
          </Text>


          Contatos de emergência
          {/* <Text style={styles.sectionTitle}>Contatos de emergência</Text>

          {contacts.map((contact, idx) => (
            <View key={idx} style={styles.contactCard}>
              <Text style={styles.listItem}>👤 {contact.name}</Text>
              <Text style={styles.listItem}>🤝 {contact.relationship}</Text>
              <Text style={styles.listItem}>📞 {contact.phone}</Text>
            </View>
          ))}

          <TextInput
            placeholder="Nome do contato"
            style={styles.input}
            value={newContact.name}
            onChangeText={(text) => setNewContact({ ...newContact, name: text })}
          />
          <TextInput
            placeholder="Grau de parentesco"
            style={styles.input}
            value={newContact.relationship}
            onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
          />
          <TextInputMask
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) '
          }}
          placeholder="Telefone"
          style={styles.input}
          value={newContact.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
          /> */}

          {/* <TouchableOpacity style={styles.addButton} onPress={addContact}>
            <Text style={styles.addButtonText}>Adicionar contato</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.botao}
            onPress={generatePDF}
          >

            <LinearGradient
              colors={["#3BB2E4", "#6DD66D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botao}
            >
              <Text style={styles.addButtonText}>Exportar para PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    width: '100%',  // <-- esta linha é essencial
  },
    conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12
  },
    label: {
    width: "90%",
    borderRadius: 25,
    bottom: 5,
    alignItems: "center",
    fontSize:14,
  },
  botao: {
    width: "90%",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    fontSize:14,
  },
  readOnlyInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    color: "#888"
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
  listItem: {
    marginLeft: 10,
    marginTop: 4
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8
  },
  contactCard: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginBottom: 10,
    
  },
  addButton: {
    backgroundColor: "#3BB2E4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
  marginBottom: 10,
  paddingVertical: 6,
  paddingHorizontal: 12,
  alignSelf: 'flex-start',
  backgroundColor: '#e0e0e0',
  borderRadius: 8
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logo: {
  flex: 1,
  height: 60,
  tintColor: "#fff",
},

backButtonIcon: {
  paddingRight: 10,
  zIndex: 10,
},

iconStyle: {
  width: 24,
  height: 24,
  tintColor: "#fff",
},
itemCard: {
  padding: 10,
  backgroundColor: "#f0f0f0",
  borderRadius: 8,
  marginBottom: 10,
  width: "100%",
},
donorCard: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  padding: 15,
  borderRadius: 8,
  width: "100%",
  marginBottom: 10,
},

donorLabel: {
  fontSize: 16,
  fontWeight: "500",
},

donorStatus: {
  alignSelf: "center",
  fontSize: 14,
  color: "#555",
  marginBottom: 20,
  marginTop: -5,
},
pickerContainer: {
  width: "100%",
  backgroundColor: "#f2f2f2",
  borderRadius: 25,
  marginBottom: 15,
  borderWidth: 1,
  padding:5,
  borderColor: "#ddd",
  overflow: "hidden"
},
picker: {
  width: "100%",
  height: 50,
},



});
