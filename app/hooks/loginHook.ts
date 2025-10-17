import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

const path = "/auth";

export async function login(email: string, password: string) {
  try {
      const body = {
          email,
          senha: password
      }

    const response = await api.post(`${path}/login`, body);

    console.log("Retorno do login:", response.data)
    return response.data;
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
}

export async function registrar(nome: string, email: string, senha: string, cpf: string) {
  try {

      const body = {
          nome,
          email,
          senha,
          cpf
      }

      const response = await api.post(`${path}/registrar`, body);

      console.log("Retorno do cadastro:", response.data);
      
      return response.data;
    } catch (error: any) {
    console.error("Erro no registro:", error);
    throw error;
  }
}
