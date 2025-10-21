import axios from "axios";
import { DadosLembrete } from "../interfaces/DadosLembrete";
import { buscarDados } from "./CacheHook";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000",
  timeout: 5000,
});

const pathLembrete = "/lembretes";

export async function criarLembrete(dadosLembrete: DadosLembrete) {
  try {

    const usuario = await buscarDados("usuario");
    const usuarioObj = usuario ? JSON.parse(usuario) : null;

    const body = {
      idUsuario: usuarioObj._id,
      data: dadosLembrete.data,
      dias: dadosLembrete.dias,
      titulo: dadosLembrete.titulo,
    };

    const response = await api.post(pathLembrete, body);

    return response.data;
  } catch (error: any) {
    console.error("Erro no lembrete:", error);
    throw error;
  }
}

export async function buscarLembretes() {
  try {

    const usuario = await buscarDados("usuario");
    const usuarioObj = usuario ? JSON.parse(usuario) : null;

    const params = {
      idUsuario: usuarioObj._id,
    };

    const response = await api.get(pathLembrete, {params});

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar lembretes:", error);
    throw error;
  }
}

export async function deletarLembrete(idLembrete: string) {
  try {

    const usuario = await buscarDados("usuario");
    const usuarioObj = usuario ? JSON.parse(usuario) : null;

    console.log(idLembrete)

    const params = {
      idUsuario: usuarioObj._id,
      idLembrete
    };

    const response = await api.delete(`${pathLembrete}`, {params});

    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar lembrete:", error);
    throw error;
  }
}
