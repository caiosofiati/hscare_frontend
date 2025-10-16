    import AsyncStorage from '@react-native-async-storage/async-storage';

    export const salvarDados = async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        // handle error
      }
    };