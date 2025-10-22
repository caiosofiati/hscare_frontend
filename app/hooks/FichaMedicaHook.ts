import axios from "axios";
import { Alert } from "react-native";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

const path = "/fichaMedica";

export async function buscarFicaMedica(idUsuario: string, token: string) {
  try {
      const headers = {
          'authorization': `Bearer ${token}`,
      };

      const params = {
          idUsuario
      }

    const response = await api.get(`${path}`, {headers, params});
    return response.data;
  } catch (error: any) {
    console.error("Erro no profile:", error);
    throw error;
  }
      
}

export async function atualizarDadosFichaMedica(
  idUsuario: string,
  fichaMedica: object,
  token: string
) {
  try {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      idUsuario, // usado no backend
    };

    const response = await api.post(`${path}`, fichaMedica, { headers });
    Alert.alert("Sucesso", "Ficha médica atualizada com sucesso!");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar ficha médica:", error);
    Alert.alert(
      "Erro",
      error.response?.data?.message ||
        "Não foi possível atualizar a ficha médica."
    );
  }
}


