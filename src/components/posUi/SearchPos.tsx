import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function POSSearch({ search, onSearchChange }: Props) {
  return (
    <View className="mx-5 mt-5 flex-row items-center rounded-2xl border border-white/10 bg-[#0D2544] px-4">
      <Ionicons name="search-outline" size={21} color="#94A3B8" />

      <TextInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Cari menu..."
        placeholderTextColor="#64748B"
        className="ml-3 flex-1 py-4 text-[15px] text-white"
      />

      {search.length > 0 && (
        <Pressable onPress={() => onSearchChange("")}>
          <Ionicons name="close-circle" size={20} color="#64748B" />
        </Pressable>
      )}
    </View>
  );
}
