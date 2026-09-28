import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  user: User;
  onProfilePress: () => void;
};

export default function HomeHeader({ user, onProfilePress }: Props) {
  return (
    <View className="px-6 pb-6 pt-5">
      {/* TOP USER HEADER */}

      <View className="flex-row items-center justify-between">
        {/* User Info */}

        <View className="flex-row items-center">
          {/* Avatar */}

          <Pressable
            onPress={onProfilePress}
            className="h-[50px] w-[50px] items-center justify-center rounded-full active:opacity-70"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.75)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            <Ionicons name="person" size={25} color="#FFFFFF" />
          </Pressable>

          {/* Greeting */}

          <View className="ml-4">
            <Text className="text-[20px] font-bold text-white">
              Hai, {user.name} 👋
            </Text>

            <Text className="mt-1 text-[13px] text-[#AFC4EA]">
              Selamat datang kembali di RestoInnApp
            </Text>
          </View>
        </View>
      </View>

      {/* Hero Title */}

      <View className="mt-12">
        <Text className="text-[38px] font-bold leading-[38px] text-white">
          Lebih Sat-set
        </Text>

        <Text className="text-[38px] font-bold leading-[46px]">
          <Text className="text-[#FFFFFF]">Dengan </Text>

          <Text className="text-[#3697FF]">
            Resto
            <Text className="text-cyan-500">InnApp</Text>
          </Text>
        </Text>
      </View>
    </View>
  );
}
