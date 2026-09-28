import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logoutSession } from "./session";

const API_URL = "http://192.168.18.61:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";

    const tokenExpired =
      (status === 401 || status === 403) &&
      message.toLowerCase().includes("token") &&
      message.toLowerCase().includes("kadaluarsa");

    if (tokenExpired) {
      console.log("TOKEN EXPIRED - LOGOUT OTOMATIS");
      await logoutSession();
    }

    return Promise.reject(error);
  },
);
