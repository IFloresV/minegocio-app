import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const { API_URL, API_ECOMMERCE, PATH_IMG } = Constants.expoConfig?.extra as Record<string, string>;

const getToken = async (): Promise<string | null> => {
   return await SecureStore.getItemAsync("MiNegocio");
};

type RequestData = Record<string, any>;

const Service = {
   Login: async (data: RequestData) => {
      console.log("Login", data);
      return await axios.post(`${API_URL}leaders/login`, data, {
         headers: { "Content-Type": "application/json" },
      });
   },

   Dashboard: async (data: RequestData) => {
      const token = await getToken();
      return await axios.post(`${API_URL}leaders/dashboard`, data, {
         headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
         },
      });
   },

   RedLeader: async (data: RequestData) => {
      const token = await getToken();
      return await axios.post(`${API_URL}leaders/redleader`, data, {
         headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
         },
      });
   },
};

export { API_ECOMMERCE, API_URL, PATH_IMG };
export default Service;
