import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
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

  const [contacts, setContacts] = useState<
    { name: string; relationship: string; phone: string }[]
  >([]);
  const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "" });

  const addToList = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item.trim() !== "") {
      setter([...list, item.trim()]);
    }
  };

  const addContact = () => {
    if (newContact.name && newContact.relationship && newContact.phone) {
      setContacts([...contacts, newContact]);
      setNewContact({ name: "", relationship: "", phone: "" });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Informações pessoais</Text>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput value="João da Silva" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Foto</Text>
      <TextInput value="[Foto do usuário]" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput value="01/01/1990" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Idade</Text>
      <TextInput value="35" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Gênero</Text>
      <TextInput value="Masculino" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Tipo sanguíneo</Text>
      <TextInput value="O+" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Altura</Text>
      <TextInput value="1.75m" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Peso</Text>
      <TextInput value="70kg" editable={false} style={styles.readOnlyInput} />

      <Text style={styles.label}>Língua preferida</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={language} onValueChange={setLanguage}>
          <Picker.Item label="Português (Brasil)" value="pt-BR" />
          <Picker.Item label="Inglês (EUA)" value="en-US" />
          <Picker.Item label="Espanhol" value="es-ES" />
        </Picker>
      </View>

      {/* Condições médicas */}
      <Text style={styles.sectionTitle}>Condições médicas</Text>
      <TextInput
        placeholder="Ex: Diabetes"
        style={styles.input}
        value={medicalCondition}
        onChangeText={setMedicalCondition}
        onSubmitEditing={() => {
          addToList(medicalCondition, medicalConditions, setMedicalConditions);
          setMedicalCondition("");
        }}
      />
      {medicalConditions.map((cond, idx) => (
        <Text key={idx} style={styles.listItem}>• {cond}</Text>
      ))}

      {/* Alergias */}
      <Text style={styles.sectionTitle}>Alergias e reações adversas</Text>
      <TextInput
        placeholder="Ex: Alergia a penicilina"
        style={styles.input}
        value={allergy}
        onChangeText={setAllergy}
        onSubmitEditing={() => {
          addToList(allergy, allergies, setAllergies);
          setAllergy("");
        }}
      />
      {allergies.map((a, idx) => (
        <Text key={idx} style={styles.listItem}>• {a}</Text>
      ))}

      {/* Medicamentos */}
      <Text style={styles.sectionTitle}>Medicamentos em uso</Text>
      <TextInput
        placeholder="Ex: Metformina"
        style={styles.input}
        value={medication}
        onChangeText={setMedication}
        onSubmitEditing={() => {
          addToList(medication, medications, setMedications);
          setMedication("");
        }}
      />
      {medications.map((m, idx) => (
        <Text key={idx} style={styles.listItem}>• {m}</Text>
      ))}

      {/* Doador de órgãos */}
      <Text style={styles.sectionTitle}>Status de doador de órgãos</Text>
      <View style={styles.switchRow}>
        <Text style={styles.label}>É doador?</Text>
        <Switch value={isDonor} onValueChange={setIsDonor} />
      </View>

      {/* Contatos de emergência */}
      <Text style={styles.sectionTitle}>Contatos de emergência</Text>

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
      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={newContact.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
      />

      <TouchableOpacity style={styles.addButton} onPress={addContact}>
        <Text style={styles.addButtonText}>Adicionar contato</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12
  },
  label: {
    fontWeight: "500",
    marginTop: 10
  },
  readOnlyInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    color: "#888"
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 4
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8
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
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10
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
    fontWeight: "600"
  }
});
