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
