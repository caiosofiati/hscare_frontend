import axios from "axios";
import { Alert } from "react-native";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

const path = "/auth";

export async function login(email: string, password: string) {
  try {
      console.info(`Efetuando login do usuário de email: ${email}`);

      const body = {
          email,
          senha: password
      }

    const response = await api.post(`${path}/login`, body);

    return response.data;
  } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);

      Alert.alert(
        "Erro ao autenticar dados",
        error.response?.data?.message || "Não foi possível autenticar seus dados, tente novamente."
      );
      
    throw error;
  }
}

export async function registrar(nome: string, email: string, senha: string, cpf: string) {
  try {

      console.info(`Efetuando registro do usuário de email: ${email}`);

      const body = {
          nome,
          email,
          senha,
          cpf
      }

      const response = await api.post(`${path}/registrar`, body);

      console.info("Retorno do cadastro:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);

      Alert.alert(
        "Erro ao cadastrar dados",
        error.response?.data?.message || "Não foi possível cadastrar seus dados, tente novamente."
      );
      
    throw error;
  }
}
