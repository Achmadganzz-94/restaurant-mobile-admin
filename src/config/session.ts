import AsyncStorage from "@react-native-async-storage/async-storage";

type SessionListener = () => void;

let sessionListener: SessionListener | null = null;

export const setSessionListener = (listener: SessionListener | null) => {
  sessionListener = listener;
};

export const logoutSession = async () => {
  await AsyncStorage.multiRemove(["token", "user"]);

  sessionListener?.();
};
