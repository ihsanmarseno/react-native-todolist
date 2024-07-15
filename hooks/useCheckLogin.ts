import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const useCheckLogin = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    router.replace("/(homepage)/in_progress");
  }
};
