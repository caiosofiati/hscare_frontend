import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

export async function retornarDadosUsuario(email: string, token: string) {
  try {
      const headers = {
          'Authorization': `Bearer ${token}`,
          email
      };

    const response = await api.get(`/profile`, {headers});

    console.log("Retorno do profile:", response.data)
    return response.data;
  } catch (error: any) {
    console.error("Erro no profile:", error);
    throw error;
  }
}
