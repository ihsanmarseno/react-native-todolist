import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetcher = async (url: string) => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .get(`https://apitodolist-prisma.vercel.app/${url}`, config)
    .then((res) => res.data);
};
