    import AsyncStorage from '@react-native-async-storage/async-storage';

    export const buscarDados = async (key: string) => {
      try {
        return AsyncStorage.getItem(key);
      } catch (e) {
        console.error("Erro ao buscar dados do cache: ", e);
      }
    };

    export const salvarDados = async (key: string, value: string) => {
      try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
      console.error("Erro ao salvar dados do cache:", error);
      throw error;
      }
    };
