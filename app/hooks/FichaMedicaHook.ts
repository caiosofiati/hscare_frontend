import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

export async function buscarFicaMedica(idUsuario: string, token: string) {
  try {
      const headers = {
          'authorization': `Bearer ${token}`,
      };

      const params = {
          idUsuario
      }

    const response = await api.get(`/fichaMedica`, {headers, params});

    console.log("Retorno da  ficha medica :", response.data)
    return response.data;
  } catch (error: any) {
    console.error("Erro no profile:", error);
    throw error;
  }
}
