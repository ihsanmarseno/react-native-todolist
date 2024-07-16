import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "https://apitodolist-prisma.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("token");
};

// POST request helper function
export const postRequest = async <T = any>(
  url: string,
  body: any
): Promise<AxiosResponse<T>> => {
  const token = await getAuthToken();
  return apiClient.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
