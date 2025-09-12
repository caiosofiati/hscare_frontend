import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Drawer } from "expo-router/drawer";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0 }}
      style={{ flex: 1}}
    >
      <LinearGradient
        colors={["#3BB2E4", "#6DD66D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.drawerHeader}
      >
        <TouchableOpacity
          onPress={() => props.navigation.navigate("screenPerfil")}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/images/hscare.png")}
            style={styles.imagemPerfil}
          />
          <Text style={styles.nomePerfil}>Nome do Paciente</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Início"
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("screenHome")}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
      </View>

      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Perfil"
          icon={({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("screenPerfil")}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
      </View>

      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Ficha Médica"
          icon={({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("screenFichaMedica")}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: "#3BB2E4",
          drawerLabelStyle: { fontSize: 16, fontWeight: "600" },
        }}
      >
        <Drawer.Screen name="app/screenHome.tsx" />
        <Drawer.Screen name="app/screenPerfil.tsx" />
        <Drawer.Screen name="app/screenFichaMedica.tsx" />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -15,
    marginRight: -15,
    padding: 20,
  },
  imagemPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nomePerfil: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  drawerItemsContainer: {
    marginLeft: -12,
    marginRight: -12,
  },
  drawerItem: {
    borderRadius: 0,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: -4,
  },
});
