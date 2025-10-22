import axios from "axios";
import { Alert } from "react-native";
import { buscarDados } from "./CacheHook";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

const path = "/usuario";

export async function retornarDadosUsuario(email: string, token: string) {
  try {
      const headers = {
          'authorization': `Bearer ${token}`,
          email
      };

    const response = await api.get(`${path}/buscarPorEmail`, {headers});

    console.log("Retorno do profile:", response.data)
    return response.data;
  } catch (error: any) {
    console.error("Erro no profile:", error);
    throw error;
  }
}

export async function atualizarDadosUsuario(usuario: object, fotoPerfil: string) {
  try {
      //@ts-ignore
      console.info(`Atualizando dados do usuário: ${usuario.nome}`);

      const token = await buscarDados("token");

      const headers = {
          'authorization': `Bearer ${token}`,
      };

      const body = {
          ...usuario,
          fotoPerfil,
      } 

      const response = await api.post(`${path}/atualizar`, body, {headers});

    return response.data;
} catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);

      Alert.alert(
        "Erro ao atualizar dados",
        error.response?.data?.message || "Não foi possível atualizar seus dados, tente novamente."
      );
  }
};