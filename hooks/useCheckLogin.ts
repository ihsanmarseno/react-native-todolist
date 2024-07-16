import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  const tokenExpiry = await AsyncStorage.getItem("tokenExpiry");

  if (!token || !tokenExpiry) {
    return null;
  }

  const currentTime = Date.now();
  if (currentTime > parseInt(tokenExpiry)) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("tokenExpiry");
    return null;
  }

  return token;
};

export const useCheckLogin = async () => {
  const token = await getToken();
  if (token) {
    router.replace("/(homepage)/in_progress");
  }
};

export const useLoginHomepage = async () => {
  const token = await getToken();
  if (!token) {
    router.replace("/(onboarding)/login");
  }
};
