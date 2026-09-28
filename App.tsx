import "./global.css";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppToast from "./src/components/toast";

import LoginScreen from "./src/screens/loginScreens";
import MainApp from "./src/navigation/mainApp";

import { setSessionListener } from "./src/config/session";
import { navigationRef } from "./src/navigation/navigationRef";

export type RootStackParamList = {
  Login: undefined;

  MainApp: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  const [storedUser, setStoredUser] = useState<
    RootStackParamList["MainApp"]["user"] | null
  >(null);

  const [storedToken, setStoredToken] = useState<string | null>(null);

  // Cek apakah JWT sudah expired
  const isTokenExpired = (token: string) => {
    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        return true;
      }

      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );

      if (!payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp <= currentTime;
    } catch (error) {
      console.log("TOKEN PARSE ERROR:", error);

      return true;
    }
  };

  // Cek session saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const userData = await AsyncStorage.getItem("user");

        // Tidak ada token atau user
        if (!token || !userData) {
          setInitialRoute("Login");
          return;
        }

        // Cek token JWT
        const expired = isTokenExpired(token);

        if (expired) {
          console.log("TOKEN SUDAH EXPIRED, HAPUS SESSION");

          await AsyncStorage.multiRemove(["token", "user"]);

          setStoredToken(null);
          setStoredUser(null);
          setInitialRoute("Login");

          return;
        }

        // Token masih valid
        const user = JSON.parse(userData);

        setStoredToken(token);
        setStoredUser(user);
        setInitialRoute("MainApp");
      } catch (error) {
        console.log("CHECK LOGIN ERROR:", error);

        await AsyncStorage.multiRemove(["token", "user"]);

        setInitialRoute("Login");
      }
    };

    checkLogin();
  }, []);

  // Dengarkan ketika session expired saat aplikasi sedang digunakan
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log("SESSION EXPIRED - KEMBALI KE LOGIN");

      setStoredToken(null);
      setStoredUser(null);

      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [
            {
              name: "Login",
            },
          ],
        });
      }
    };

    setSessionListener(handleSessionExpired);

    return () => {
      setSessionListener(null);
    };
  }, []);

  // Loading ketika mengecek session
  if (!initialRoute) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-[#080D16]">
          <ActivityIndicator size="large" color="#3697FF" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen
            name="MainApp"
            component={MainApp}
            initialParams={
              storedToken && storedUser
                ? {
                    token: storedToken,
                    user: storedUser,
                  }
                : undefined
            }
          />
        </Stack.Navigator>
      </NavigationContainer>

      <AppToast />
    </SafeAreaProvider>
  );
}
