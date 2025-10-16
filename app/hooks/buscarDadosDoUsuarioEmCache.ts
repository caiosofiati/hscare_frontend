    import AsyncStorage from '@react-native-async-storage/async-storage';

    export const buscarDados = async (key: string) => {
      try {
        return AsyncStorage.getItem(key);
      } catch (e) {
        console.error("Erro ao buscar dados do cache: ", e);
      }
    };