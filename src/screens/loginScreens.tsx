import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../../App";
import { api } from "../config/Api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "warning",
        text1: "Email belum diisi",
        text2: "Silakan masukkan email terlebih dahulu.",
        position: "top",
        visibilityTime: 3000,
        topOffset: insets.top + 12,
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: "warning",
        text1: "Password belum diisi",
        text2: "Silakan masukkan password terlebih dahulu.",
        position: "top",
        visibilityTime: 3000,
        topOffset: insets.top + 12,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("TOKEN:", token);
      console.log("USER:", user);

      Toast.show({
        type: "success",
        text1: "Login Berhasil",
        text2: `Selamat datang, ${user.name}`,
        position: "top",
        visibilityTime: 1800,
        topOffset: insets.top + 12,
        onHide: () => {
          navigation.replace("MainApp", {
            token,
            user,
          });
        },
      });
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      const message =
        error?.response?.data?.message || "Tidak dapat terhubung ke server.";

      Toast.show({
        type: "error",
        text1: "Login Gagal",
        text2: message,
        position: "top",
        visibilityTime: 3500,
        topOffset: insets.top + 12,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-5">
            <View className="items-center mb-2">
              <Image
                source={require("../../assets/logo.png")}
                className="w-[230px] h-[230px]"
                resizeMode="contain"
              />
            </View>

            <View className="items-center mb-7">
              <Text className="text-[28px] font-bold tracking-[0.3px] text-slate-50 mb-2">
                Selamat Datang
              </Text>

              <Text className="text-sm text-slate-400 text-center">
                Masuk ke akun Admin/Staff Anda
              </Text>
            </View>

            <View className="w-full max-w-[440px] self-center bg-[#111827] rounded-[24px] p-[22px] border border-[#1F2937]">
              <View className="mb-5">
                <Text className="text-sm font-semibold text-slate-200 mb-2">
                  Email
                </Text>

                <View className="h-[54px] flex-row items-center bg-[#0B1120] border border-[#263244] rounded-[14px] px-[14px]">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#7DD3FC"
                    style={{
                      width: 30,
                      marginRight: 6,
                    }}
                  />

                  <TextInput
                    className="flex-1 h-full text-[15px] text-slate-50"
                    placeholder="Masukkan email"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>

              <View className="mb-5">
                <Text className="text-sm font-semibold text-slate-200 mb-2">
                  Password
                </Text>

                <View className="h-[54px] flex-row items-center bg-[#0B1120] border border-[#263244] rounded-[14px] px-[14px]">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#7DD3FC"
                    style={{
                      width: 30,
                      marginRight: 6,
                    }}
                  />

                  <TextInput
                    className="flex-1 h-full text-[15px] text-slate-50"
                    placeholder="Masukkan password"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="pl-2 py-2"
                    hitSlop={10}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#7DD3FC"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                className="self-end -mt-1 mb-[22px]"
                onPress={() => {
                  Toast.show({
                    type: "info",
                    text1: "Lupa Password?",
                    text2:
                      "Silakan hubungi IT Support untuk mereset password Anda.",
                    position: "top",
                    visibilityTime: 4000,
                    topOffset: insets.top + 12,
                  });
                }}
                disabled={loading}
              >
                <Text className="text-[13px] font-semibold text-sky-300">
                  Lupa password?
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                disabled={!isFormValid || loading}
                style={{
                  height: 54,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  backgroundColor:
                    !isFormValid || loading ? "#263244" : "#168AC5",
                  opacity: !isFormValid || loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#FFFFFF",
                      }}
                    >
                      Memproses...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        marginRight: 8,
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#FFFFFF",
                      }}
                    >
                      Masuk
                    </Text>

                    <Ionicons
                      name="arrow-forward-outline"
                      size={21}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </Pressable>
            </View>

            <Text className="text-center text-[10px] font-semibold tracking-[1px] text-slate-600 mt-7">
              RESTOINNAPP • Powered by Achmad
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
