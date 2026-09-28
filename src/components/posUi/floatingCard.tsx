import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  totalItems: number;
  totalPrice: number;
  formatRupiah: (value: number) => string;
  onPress: () => void;
};

export default function FloatingCart({
  totalItems,
  totalPrice,
  formatRupiah,
  onPress,
}: Props) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <View className="absolute bottom-24 left-4 right-4">
      <Pressable
        onPress={onPress}
        className="flex-row items-center rounded-2xl border border-white/10 bg-[#102A4A] px-4 py-3"
      >
        {/* Icon cart */}
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]">
          <Ionicons name="cart" size={22} color="#FFFFFF" />

          <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-[#FF9F1C] px-1">
            <Text className="text-[10px] font-bold text-[#071A33]">
              {totalItems}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View className="flex-1">
          <Text className="text-xs text-white/50">Total pesanan</Text>

          <Text className="mt-1 text-base font-bold text-white">
            {formatRupiah(totalPrice)}
          </Text>
        </View>

        {/* Lihat keranjang */}
        <View className="flex-row items-center">
          <Text className="mr-2 text-sm font-semibold text-[#4DB5FF]">
            Lihat Keranjang
          </Text>

          <Ionicons name="chevron-forward" size={19} color="#4DB5FF" />
        </View>
      </Pressable>
    </View>
  );
}
