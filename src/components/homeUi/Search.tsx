import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View className="px-5">
      <View className="h-[56px] flex-row items-center rounded-2xl bg-[#1A1A1A] px-4 border border-white/5">
        {/* Search Icon */}
        <Ionicons name="search-outline" size={22} color="#9CA3AF" />

        {/* Input */}
        <TextInput
          className="ml-3 flex-1 text-[15px] text-white"
          placeholder="Cari menu yang tersedia"
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Filter Button */}
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-xl bg-[#252525]"
          onPress={() => console.log("Filter pressed")}
        >
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
