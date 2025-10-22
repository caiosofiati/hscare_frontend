import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

const API_KEY = 'AIzaSyDFDjhtabE5rqrdn9WZuccGF848-wfnO0w';

export async function enviarPerguntaGemini(promptText: string): Promise<string> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (!result) {
      console.error("Resposta inesperada da API:", response.data);
      throw new Error("Resposta inválida do Gemini");
    }

    return result;
  } catch (error: any) {
    console.error("Erro na requisição ao Gemini:", error.response?.data || error.message);
    throw error;
  }
}
