import React from "react";
import { Text, View } from "react-native";

export default function POSHeader() {
  return (
    <View className="px-5 pt-4">
      <Text className="text-2xl font-bold text-white">Pesanan / POS</Text>

      <Text className="mt-1 text-sm text-white/50">
        Kelola menu dan pantau pesanan restoran
      </Text>
    </View>
  );
}
